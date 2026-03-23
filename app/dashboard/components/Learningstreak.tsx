"use client";

/**
 * LearningStreak.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Streak counts in WEEKS. A week runs Mon–Sun.
 * • Complete at least one session every day of a week → +1 week streak
 * • Miss any day in the current week → streak resets to 0 (best preserved)
 * • Calendar shows the current Mon–Sun week with 🔥 on each active day
 *
 * Supabase table (unchanged schema):
 * ─────────────────────────────────────────────────────────────────────────────
 * create table user_streaks (
 *   user_id     uuid primary key references auth.users(id) on delete cascade,
 *   count       int  not null default 0,
 *   last_date   date,
 *   longest     int  not null default 0,
 *   total_days  int  not null default 0,
 *   active_dates date[] not null default '{}',
 *   updated_at  timestamptz default now()
 * );
 * alter table user_streaks enable row level security;
 * create policy "own streak" on user_streaks
 *   for all using (auth.uid() = user_id)
 *   with check (auth.uid() = user_id);
 */

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StreakData {
  count: number;        // weeks completed
  lastDate: string;     // "YYYY-MM-DD" last active date
  longest: number;      // best week streak ever
  totalDays: number;    // total individual days learned
  activeDates: string[];// last 60 active "YYYY-MM-DD" dates
}

const EMPTY: StreakData = {
  count: 0, lastDate: "", longest: 0, totalDays: 0, activeDates: [],
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayStr(): string { return toDateStr(new Date()); }

/** Returns Monday of the week containing `dateStr` */
function getMondayOf(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const dow = d.getDay(); // 0=Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  return toDateStr(d);
}

/** Returns all 7 date strings (Mon–Sun) for the week containing `dateStr` */
function getWeekDates(dateStr: string): string[] {
  const monday = new Date(getMondayOf(dateStr) + "T00:00:00");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateStr(d);
  });
}

/**
 * A week is "complete" if every day Mon–Sun up to (and including) today
 * has an entry in activeDates.
 */
function isWeekComplete(weekDates: string[], activeDates: string[], today: string): boolean {
  const activeSet = new Set(activeDates);
  const pastDays = weekDates.filter((d) => d <= today);
  return pastDays.every((d) => activeSet.has(d));
}

/**
 * Compute week streak from activeDates + today.
 * Walk back week by week from the current week;
 * stop as soon as a week has a missing past day.
 */
function computeWeekStreak(activeDates: string[], today: string): number {
  const activeSet = new Set(activeDates);
  let streak = 0;
  let checkDate = today;

  for (let w = 0; w < 520; w++) { // max ~10 years back
    const weekDates = getWeekDates(checkDate);
    const pastDays = weekDates.filter((d) => d <= today);
    const allDone = pastDays.every((d) => activeSet.has(d));
    if (!allDone) break;
    streak++;
    // Move to the previous week
    const prevWeek = new Date(weekDates[0] + "T00:00:00");
    prevWeek.setDate(prevWeek.getDate() - 1);
    checkDate = toDateStr(prevWeek);
  }

  return streak;
}

// ─── localStorage cache ───────────────────────────────────────────────────────
function cacheKey(userId: string) { return `sabiskill_streak_${userId}`; }
function readCache(userId: string): StreakData | null {
  try { const r = localStorage.getItem(cacheKey(userId)); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function writeCache(userId: string, data: StreakData) {
  try { localStorage.setItem(cacheKey(userId), JSON.stringify(data)); } catch {}
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────
async function fetchFromSupabase(userId: string): Promise<StreakData | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_streaks")
      .select("count, last_date, longest, total_days, active_dates")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      count:       data.count        ?? 0,
      lastDate:    data.last_date    ?? "",
      longest:     data.longest      ?? 0,
      totalDays:   data.total_days   ?? 0,
      activeDates: data.active_dates ?? [],
    };
  } catch { return null; }
}

async function upsertToSupabase(userId: string, streak: StreakData): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("user_streaks").upsert({
      user_id:      userId,
      count:        streak.count,
      last_date:    streak.lastDate || null,
      longest:      streak.longest,
      total_days:   streak.totalDays,
      active_dates: streak.activeDates,
      updated_at:   new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch {}
}

// ─── Core streak logic ────────────────────────────────────────────────────────
function computeNewStreak(current: StreakData): StreakData {
  const today = todayStr();
  if (current.lastDate === today) return current; // already recorded today

  const newDates = [...new Set([...(current.activeDates || []), today])].slice(-60);
  const weekStreak = computeWeekStreak(newDates, today);

  return {
    count:       weekStreak,
    lastDate:    today,
    longest:     Math.max(current.longest, weekStreak),
    totalDays:   current.totalDays + 1,
    activeDates: newDates,
  };
}

export async function recordStreakActivity(userId: string): Promise<void> {
  if (!userId) return;
  let current = await fetchFromSupabase(userId);
  if (!current) current = readCache(userId) ?? EMPTY;
  if (current.lastDate === todayStr()) return;
  const updated = computeNewStreak(current);
  writeCache(userId, updated);
  window.dispatchEvent(new CustomEvent("sabiskill-streak-update", { detail: updated }));
  await upsertToSupabase(userId, updated);
}

// ─── useStreakData hook ───────────────────────────────────────────────────────
function useStreakData(userId: string) {
  const [data, setData] = useState<StreakData | null>(() =>
    userId ? readCache(userId) : null
  );

  const load = useCallback(async () => {
    if (!userId) return;
    const cached = readCache(userId);
    if (cached) setData(cached);
    const remote = await fetchFromSupabase(userId);
    if (remote) { writeCache(userId, remote); setData(remote); }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as StreakData | undefined;
      if (detail) setData(detail); else load();
    };
    const storageHandler = () => load();
    window.addEventListener("sabiskill-streak-update", handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("sabiskill-streak-update", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [load]);

  return data;
}

// ─── Level config (now based on weeks) ───────────────────────────────────────
function getLevel(weekCount: number) {
  if (weekCount >= 12) return { label: "Legendary 👑", color: "#f59e0b" };
  if (weekCount >= 6)  return { label: "On Fire 🔥",   color: "#ef4444" };
  if (weekCount >= 3)  return { label: "Hot Streak ⚡", color: "#f97316" };
  if (weekCount >= 1)  return { label: "Building 📈",  color: "#3b82f6" };
  return                      { label: "No streak yet", color: "#64748b" };
}

// ─── StreakBar — compact header badge ────────────────────────────────────────
export function StreakBar({ userId }: { userId: string }) {
  const data = useStreakData(userId);
  if (!userId || data === null) return null;
  const isActive = data.count > 0;
  const todayDone = data.activeDates.includes(todayStr());

  return (
    <>
      <style>{`
        @keyframes sb-pop   { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes sb-flame { 0%,100%{transform:rotate(-5deg) scale(1)} 50%{transform:rotate(5deg) scale(1.15)} }
        .sb-wrap  { animation: sb-pop .4s cubic-bezier(.34,1.56,.64,1) both; }
        .sb-flame { animation: sb-flame ${isActive ? "1.8s" : "4s"} ease-in-out infinite; display:inline-block; }
      `}</style>
      <div className="sb-wrap flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm select-none cursor-default">
        <span className="sb-flame text-base sm:text-lg leading-none">
          {todayDone ? "🔥" : isActive ? "🔥" : "💤"}
        </span>
        <span className={`text-sm sm:text-base font-black tabular-nums leading-none ${isActive ? "text-orange-500" : "text-slate-400"}`}>
          {data.count}
        </span>
        <span className="hidden sm:inline text-[11px] font-semibold text-slate-400 leading-none">
          {data.count === 1 ? "wk streak" : "wk streak"}
        </span>
      </div>
    </>
  );
}

// ─── StreakCard — calendar-style weekly card ──────────────────────────────────
export function StreakCard({ userId }: { userId: string }) {
  const data = useStreakData(userId);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  if (!userId || data === null) return null;

  const today     = todayStr();
  const level     = getLevel(data.count);
  const isActive  = data.count > 0;
  const todayDone = data.activeDates.includes(today);
  const activeSet = new Set(data.activeDates);

  // Build Mon–Sun for this week
  const weekDates  = getWeekDates(today);
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Week completion progress (how many past days in this week are done)
  const pastDaysThisWeek   = weekDates.filter((d) => d <= today);
  const doneDaysThisWeek   = pastDaysThisWeek.filter((d) => activeSet.has(d));
  const weekPct            = pastDaysThisWeek.length === 0 ? 0
    : Math.round((doneDaysThisWeek.length / 7) * 100);
  const allDoneThisWeek    = pastDaysThisWeek.every((d) => activeSet.has(d));

  // Next milestone in weeks
  const MILESTONES = [1, 3, 6, 12, 24, 52];
  const nextMs  = MILESTONES.find((m) => m > data.count) ?? 52;
  const prevMs  = [...MILESTONES].reverse().find((m) => m <= data.count) ?? 0;
  const msPct   = prevMs === nextMs ? 100
    : Math.min(100, Math.round(((data.count - prevMs) / (nextMs - prevMs)) * 100));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        .sc2 * { font-family:'Sora',sans-serif; }
        @keyframes sc2-in    { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes sc2-flame { 0%,100%{transform:scale(1) rotate(-6deg)} 50%{transform:scale(1.2) rotate(6deg)} }
        @keyframes sc2-pop   { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
        @keyframes sc2-shim  { 0%{transform:translateX(-120%)} 100%{transform:translateX(400%)} }
        @keyframes sc2-ring  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes sc2-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 50%{box-shadow:0 0 0 6px rgba(59,130,246,0)} }
        .sc2-card  { animation: sc2-in .45s cubic-bezier(.22,1,.36,1) both; }
        .sc2-flame { animation: sc2-flame ${isActive ? "1.9s" : "5s"} ease-in-out infinite; display:inline-block; }
        .sc2-pop   { animation: sc2-pop .4s cubic-bezier(.34,1.56,.64,1) both; }
        .sc2-shim  { animation: sc2-shim 2.2s ease-in-out infinite; }
        .sc2-ring  { animation: sc2-ring 1.4s ease-out infinite; }
        .sc2-pulse { animation: sc2-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className={`sc2 max-w-7xl mx-auto mb-4 sm:mb-5 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div
          className="sc2-card relative overflow-hidden rounded-2xl sm:rounded-3xl border"
          style={{
            background: "linear-gradient(135deg,#f0f7ff 0%,#ffffff 55%,#eff6ff 100%)",
            borderColor: isActive ? "rgba(59,130,246,.25)" : "rgba(226,232,240,1)",
            boxShadow: `0 4px 24px -4px ${isActive ? "rgba(59,130,246,.12)" : "rgba(0,0,0,.06)"}`,
          }}
        >
          {/* Dot texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage:"radial-gradient(circle,#2563eb 1px,transparent 1px)", backgroundSize:"22px 22px" }} />

          {/* Glow blob */}
          {isActive && (
            <div className="absolute -top-8 left-8 w-48 h-48 rounded-full blur-3xl opacity-[0.15] pointer-events-none"
              style={{ background:"radial-gradient(circle,#bfdbfe,transparent 70%)" }} />
          )}

          {/* ── Header row ── */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-5 px-4 sm:px-6 pt-4 sm:pt-5 pb-3">

            {/* Flame + week count */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative flex items-center justify-center mb-0.5">
                {isActive && <div className="sc2-ring absolute w-9 h-9 rounded-full border-2 border-orange-400/40" />}
                <span className="sc2-flame text-3xl sm:text-4xl">{isActive ? "🔥" : "💤"}</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black tabular-nums leading-none"
                style={{ color: isActive ? "#fb923c" : "#64748b", textShadow: isActive ? "0 0 20px rgba(251,146,60,.4)" : "none" }}>
                {data.count}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {data.count === 1 ? "week" : "weeks"}
              </span>
            </div>

            <div className="w-px h-14 bg-slate-200 shrink-0" />

            {/* Status text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-black leading-tight" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-snug">
                {allDoneThisWeek && pastDaysThisWeek.length === 7
                  ? "Perfect week! 🎉 Week complete"
                  : todayDone
                    ? `${doneDaysThisWeek.length}/7 days this week ✓`
                    : isActive
                      ? "Learn today to keep your streak alive"
                      : "Complete every day this week to start a streak"}
              </p>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                {data.totalDays} total day{data.totalDays !== 1 ? "s" : ""} learned
              </p>
            </div>

            {/* Best streak */}
            <div className="flex flex-col items-center gap-0.5 shrink-0 bg-amber-50 border border-amber-100 rounded-2xl px-3 py-2">
              <span className="text-lg sm:text-xl">🏆</span>
              <span className="text-sm sm:text-base font-black text-slate-800 tabular-nums">{data.longest}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-tight text-center">best<br/>wks</span>
            </div>
          </div>

          {/* ── Calendar row ── */}
          <div className="relative z-10 px-4 sm:px-6 pb-3">
            {/* Month label */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              {new Date(today + "T00:00:00").toLocaleString("default", { month: "long", year: "numeric" })} — This Week
            </p>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekDates.map((dateStr, i) => {
                const isToday   = dateStr === today;
                const isDone    = activeSet.has(dateStr);
                const isFuture  = dateStr > today;
                const isMissed  = !isDone && !isFuture && !isToday;
                const dayNum    = new Date(dateStr + "T00:00:00").getDate();

                return (
                  <div key={dateStr} className="flex flex-col items-center gap-1">
                    {/* Day label */}
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: isToday ? "#3b82f6" : "#94a3b8" }}>
                      {DAY_LABELS[i]}
                    </span>

                    {/* Calendar cell */}
                    <div
                      className={`
                        relative w-full aspect-square rounded-xl sm:rounded-2xl
                        flex flex-col items-center justify-center gap-0.5
                        transition-all duration-300
                        ${isDone ? "sc2-pop" : ""}
                        ${isToday && !isDone ? "sc2-pulse" : ""}
                      `}
                      style={{
                        animationDelay: isDone ? `${i * 0.07}s` : "0s",
                        background: isDone
                          ? "linear-gradient(135deg,#fb923c,#ef4444)"
                          : isToday
                            ? "rgba(59,130,246,.1)"
                            : isMissed
                              ? "rgba(241,245,249,1)"
                              : "rgba(248,250,252,1)",
                        border: isToday && !isDone
                          ? "2px solid rgba(59,130,246,.5)"
                          : isDone
                            ? "2px solid rgba(251,146,60,.3)"
                            : "2px solid transparent",
                        boxShadow: isDone ? "0 3px 10px rgba(251,146,60,.35)" : "none",
                      }}
                    >
                      {isDone ? (
                        <>
                          <span className="sc2-flame text-base sm:text-xl leading-none"
                            style={{ animationDuration: `${1.6 + i * 0.15}s` }}>🔥</span>
                          <span className="text-[8px] sm:text-[9px] font-black text-white/90 leading-none">{dayNum}</span>
                        </>
                      ) : isToday ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mb-0.5" />
                          <span className="text-[9px] sm:text-[10px] font-black text-blue-500 leading-none">{dayNum}</span>
                        </>
                      ) : isMissed ? (
                        <>
                          <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 12 12">
                            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 leading-none">{dayNum}</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mb-0.5" />
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 leading-none">{dayNum}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Week completion bar */}
            <div className="mt-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">
                  This week: {doneDaysThisWeek.length} / 7 days
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{weekPct}%</span>
              </div>
              <div className="relative w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                  style={{
                    width: `${weekPct}%`,
                    background: allDoneThisWeek
                      ? "linear-gradient(90deg,#fb923c,#ef4444)"
                      : "linear-gradient(90deg,#3b82f6,#60a5fa)",
                  }}
                >
                  {weekPct > 8 && (
                    <div className="sc2-shim absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Streak milestone progress ── */}
          <div className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-5 pt-0 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">
                {data.count} / {nextMs} week{nextMs !== 1 ? "s" : ""} → next milestone
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{msPct}%</span>
            </div>
            <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${msPct}%`,
                  background: isActive ? "linear-gradient(90deg,#a78bfa,#7c3aed)" : "#e2e8f0",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default StreakCard;