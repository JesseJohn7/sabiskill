"use client";

/**
 * LearningStreak.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Streak data is stored in Supabase (user_streaks table) so it persists
 * across devices, browsers, and browser clears.
 * localStorage is used as a fast read-cache to avoid flicker on load.
 *
 * SUPABASE TABLE — run this once in your SQL editor:
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
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StreakData {
  count: number;
  lastDate: string;       // "YYYY-MM-DD"
  longest: number;
  totalDays: number;
  activeDates: string[];  // last 30 active "YYYY-MM-DD" dates
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
function daysBetween(a: string, b: string): number {
  const ms = new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime();
  return Math.round(ms / 86400000);
}

// ─── localStorage cache (fast read, avoids flicker) ──────────────────────────
function cacheKey(userId: string) { return `sabiskill_streak_${userId}`; }

function readCache(userId: string): StreakData | null {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
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
      count:       data.count       ?? 0,
      lastDate:    data.last_date   ?? "",
      longest:     data.longest     ?? 0,
      totalDays:   data.total_days  ?? 0,
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
  if (current.lastDate === today) return current; // already done today

  const gap = current.lastDate ? daysBetween(current.lastDate, today) : 1;
  const newCount = gap === 1 ? current.count + 1 : 1;
  const newDates = [...(current.activeDates || []), today].slice(-30);

  return {
    count:       newCount,
    lastDate:    today,
    longest:     Math.max(current.longest, newCount),
    totalDays:   current.totalDays + 1,
    activeDates: newDates,
  };
}

/**
 * Call when user clicks Continue on their active course.
 * Optimistically updates localStorage + fires event, then persists to Supabase.
 */
export async function recordStreakActivity(userId: string): Promise<void> {
  if (!userId) return;

  // 1. Read latest (try Supabase first, fall back to cache)
  let current = await fetchFromSupabase(userId);
  if (!current) current = readCache(userId) ?? EMPTY;

  // 2. Already recorded today — nothing to do
  if (current.lastDate === todayStr()) return;

  // 3. Compute new streak
  const updated = computeNewStreak(current);

  // 4. Optimistic local update so UI reflects instantly
  writeCache(userId, updated);
  window.dispatchEvent(new CustomEvent("sabiskill-streak-update", { detail: updated }));

  // 5. Persist to Supabase (background, non-blocking)
  await upsertToSupabase(userId, updated);
}

// ─── useStreakData hook ───────────────────────────────────────────────────────
function useStreakData(userId: string) {
  const [data, setData] = useState<StreakData | null>(() =>
    userId ? readCache(userId) : null
  );

  const load = useCallback(async () => {
    if (!userId) return;
    // Show cache immediately
    const cached = readCache(userId);
    if (cached) setData(cached);
    // Then fetch from Supabase for accuracy
    const remote = await fetchFromSupabase(userId);
    if (remote) {
      writeCache(userId, remote);
      setData(remote);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  // Listen for same-tab updates fired by recordStreakActivity
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as StreakData | undefined;
      if (detail) setData(detail);
      else load();
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

// ─── Week builder ─────────────────────────────────────────────────────────────
interface DayEntry {
  dateStr: string;
  label: string;
  status: "done" | "today" | "future" | "missed";
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildWeek(activeDates: string[]): DayEntry[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const todayDateStr = toDateStr(now);
  const todayDow = now.getDay(); // 0=Sun
  const activeSet = new Set(activeDates);

  // Start from Monday of this week
  const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toDateStr(d);
    const isToday = dateStr === todayDateStr;
    const isPast = d < now;
    const isFuture = d > now;

    let status: DayEntry["status"];
    if (activeSet.has(dateStr)) {
      status = "done";
    } else if (isToday) {
      status = "today";
    } else if (isFuture) {
      status = "future";
    } else {
      status = "missed";
    }

    return { dateStr, label: DAY_NAMES[d.getDay()], status };
  });
}

// ─── Level config ─────────────────────────────────────────────────────────────
function getLevel(count: number) {
  if (count >= 30) return { label: "Legendary 👑", color: "#f59e0b" };
  if (count >= 14) return { label: "On Fire 🔥",   color: "#ef4444" };
  if (count >= 7)  return { label: "Hot Streak ⚡", color: "#f97316" };
  if (count >= 3)  return { label: "Building 📈",  color: "#3b82f6" };
  if (count >= 1)  return { label: "Started 🌱",   color: "#10b981" };
  return             { label: "No streak yet",      color: "#64748b" };
}

// ─── StreakBar — compact badge for header ─────────────────────────────────────
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
          day streak
        </span>
      </div>
    </>
  );
}

// ─── StreakCard — full card for home page ─────────────────────────────────────
export function StreakCard({ userId }: { userId: string }) {
  const data = useStreakData(userId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!userId || data === null) return null;

  const level     = getLevel(data.count);
  const week      = buildWeek(data.activeDates || []);
  const isActive  = data.count > 0;
  const todayDone = data.activeDates.includes(todayStr());

  // Progress to next milestone
  const MILESTONES = [3, 7, 14, 30, 60, 100];
  const nextMs = MILESTONES.find((m) => m > data.count) ?? 100;
  const prevMs = [...MILESTONES].reverse().find((m) => m <= data.count) ?? 0;
  const pct = prevMs === nextMs
    ? 100
    : Math.min(100, Math.round(((data.count - prevMs) / (nextMs - prevMs)) * 100));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        .sc2 * { font-family:'Sora',sans-serif; }
        @keyframes sc2-in     { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes sc2-flame  { 0%,100%{transform:scale(1) rotate(-6deg);filter:drop-shadow(0 0 4px transparent)} 50%{transform:scale(1.2) rotate(6deg);filter:drop-shadow(0 0 14px rgba(251,146,60,.7))} }
        @keyframes sc2-pop    { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
        @keyframes sc2-shim   { 0%{transform:translateX(-120%)} 100%{transform:translateX(400%)} }
        @keyframes sc2-ring   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes sc2-today  { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 50%{box-shadow:0 0 0 6px rgba(59,130,246,0)} }
        .sc2-card  { animation: sc2-in .45s cubic-bezier(.22,1,.36,1) both; }
        .sc2-flame { animation: sc2-flame ${isActive ? "1.9s" : "5s"} ease-in-out infinite; display:inline-block; line-height:1; }
        .sc2-pop   { animation: sc2-pop .4s cubic-bezier(.34,1.56,.64,1) both; }
        .sc2-shim  { animation: sc2-shim 2.2s ease-in-out infinite; }
        .sc2-ring  { animation: sc2-ring 1.4s ease-out infinite; }
        .sc2-today { animation: sc2-today 2s ease-in-out infinite; }
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
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage:"radial-gradient(circle,#2563eb 1px,transparent 1px)", backgroundSize:"20px 20px" }} />

          {/* Glow */}
          {isActive && (
            <div className="absolute -top-6 left-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background:"radial-gradient(circle,#bfdbfe,transparent 70%)" }} />
          )}

          {/* ── Top row ── */}
          <div className="relative z-10 flex items-center px-4 sm:px-6 pt-4 sm:pt-5 pb-3 gap-4 sm:gap-5">

            {/* Flame + count */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative flex items-center justify-center mb-0.5">
                {isActive && <div className="sc2-ring absolute w-9 h-9 rounded-full border-2 border-orange-400/40" />}
                <span className="sc2-flame text-3xl sm:text-4xl">{isActive ? "🔥" : "💤"}</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black tabular-nums leading-none"
                style={{ color: isActive ? "#fb923c" : "#64748b", textShadow: isActive ? "0 0 20px rgba(251,146,60,.4)" : "none" }}>
                {data.count}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                {data.count === 1 ? "day" : "days"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-14 bg-slate-200 flex-shrink-0" />

            {/* Label */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-black leading-tight" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 leading-snug">
                {isActive
                  ? todayDone
                    ? "Today's session logged ✓"
                    : "Continue a course to keep your streak alive"
                  : "Complete a course today to start your streak"}
              </p>
            </div>

            {/* Best streak */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0 bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2">
              <span className="text-lg sm:text-xl">🏆</span>
              <span className="text-sm sm:text-base font-black text-slate-800 tabular-nums">{data.longest}</span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">best</span>
            </div>
          </div>

          {/* ── Week row ── */}
          <div className="relative z-10 px-4 sm:px-6 pb-2 sm:pb-3">
            <div className="flex items-end justify-between gap-2 sm:gap-3">
              {week.map((day, i) => {
                const isDone   = day.status === "done";
                const isToday  = day.status === "today";
                const isFuture = day.status === "future";
                const isMissed = day.status === "missed";
                // todayDone means today IS in activeDates → show as done not "today"
                const showDone = isDone || (isToday && todayDone);

                return (
                  <div key={day.dateStr} className="flex flex-col items-center gap-1 sm:gap-1.5 flex-1 min-w-0">

                    {/* Day tile */}
                    <div
                      className={`
                        relative flex items-center justify-center
                        w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl
                        transition-all duration-300
                        ${showDone ? "sc2-pop" : ""}
                        ${isToday && !todayDone ? "sc2-today" : ""}
                      `}
                      style={{
                        animationDelay: showDone ? `${i * 0.06}s` : "0s",
                        background: showDone
                          ? "linear-gradient(135deg,#fb923c,#ef4444)"
                          : isToday
                            ? "rgba(59,130,246,.15)"
                            : isMissed
                              ? "rgba(241,245,249,1)"
                              : "rgba(248,250,252,1)",
                        boxShadow: showDone
                          ? "0 2px 12px rgba(251,146,60,.4)"
                          : isToday
                            ? "0 0 0 2px rgba(59,130,246,.45)"
                            : "none",
                      }}
                    >
                      {showDone ? (
                        <span className="sc2-flame text-sm sm:text-base leading-none"
                          style={{ animationDuration: `${1.6 + i * 0.12}s` }}>🔥</span>
                      ) : isToday ? (
                        /* Blue pulsing dot = today, not yet done */
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-400 animate-pulse" />
                      ) : isMissed ? (
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-300" fill="none" viewBox="0 0 12 12">
                          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className="text-[8px] sm:text-[10px] font-bold leading-none"
                      style={{
                        color: isToday
                          ? "#60a5fa"
                          : showDone
                            ? "rgba(251,146,60,.75)"
                            : "#cbd5e1",
                      }}
                    >
                      {day.label.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-5 pt-1 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-semibold">
                {data.count} / {nextMs} days → next milestone
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{pct}%</span>
            </div>
            <div className="relative w-full h-1.5 sm:h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{
                  width: `${pct}%`,
                  background: isActive ? "linear-gradient(90deg,#3b82f6,#60a5fa)" : "#e2e8f0",
                }}
              >
                {isActive && pct > 8 && (
                  <div className="sc2-shim absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default StreakCard;