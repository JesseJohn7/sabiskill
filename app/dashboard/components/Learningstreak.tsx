"use client";

import React, { useEffect, useState } from "react";

// ─── Storage types ────────────────────────────────────────────────────────────
interface StreakData {
  count: number;
  lastDate: string;   // "YYYY-MM-DD"
  longest: number;
  totalDays: number;
  // Set of all dates the user was active, stored as "YYYY-MM-DD"
  activeDates: string[];
}

function streakKey(userId: string) {
  return `sabiskill_streak_${userId}`;
}

function toDateStr(d: Date): string {
  // Local calendar date, not UTC, so the day matches what the user sees
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function todayStr(): string {
  return toDateStr(new Date());
}

function daysBetween(a: string, b: string): number {
  const aMs = new Date(a + "T00:00:00").getTime();
  const bMs = new Date(b + "T00:00:00").getTime();
  return Math.round((bMs - aMs) / 86400000);
}

function loadStreak(userId: string): StreakData {
  try {
    const raw = localStorage.getItem(streakKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      // Back-fill activeDates if missing (old data)
      if (!parsed.activeDates) parsed.activeDates = parsed.lastDate ? [parsed.lastDate] : [];
      return parsed;
    }
  } catch {}
  return { count: 0, lastDate: "", longest: 0, totalDays: 0, activeDates: [] };
}

function saveStreakData(userId: string, data: StreakData) {
  try {
    localStorage.setItem(streakKey(userId), JSON.stringify(data));
  } catch {}
}

/** Call when user clicks Continue on their active course */
export function recordStreakActivity(userId: string) {
  if (!userId) return;
  const today = todayStr();
  const data = loadStreak(userId);

  if (data.lastDate === today) return; // already recorded today

  const gap = data.lastDate ? daysBetween(data.lastDate, today) : 1;
  const newCount = gap === 1 ? data.count + 1 : 1; // consecutive = +1, gap = reset to 1

  // Keep activeDates capped at last 30 days to avoid bloat
  const newDates = [...(data.activeDates || []), today].slice(-30);

  saveStreakData(userId, {
    count: newCount,
    lastDate: today,
    longest: Math.max(data.longest, newCount),
    totalDays: data.totalDays + 1,
    activeDates: newDates,
  });

  // Notify same-tab listeners (storage events only fire cross-tab)
  window.dispatchEvent(new Event("sabiskill-streak-update"));
}

// ─── Build the 7-day week starting from today going back ──────────────────────
/**
 * Returns 7 entries ordered Mon → Sun of the CURRENT week
 * that contains today. Each entry is:
 *   status: "done" | "today" | "future" | "missed"
 *   label: "Mon" | "Tue" etc.
 *   isToday: boolean
 */
interface DayEntry {
  dateStr: string;
  label: string;
  status: "done" | "today" | "future" | "missed";
  isToday: boolean;
}

const FULL_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SHORT_DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function buildWeek(activeDates: string[]): DayEntry[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDow = today.getDay(); // 0=Sun, 1=Mon, ...6=Sat
  const todayDateStr = toDateStr(today);

  const activeSet = new Set(activeDates);

  // Build Mon (dow=1) to Sun (dow=0 mapped to 7) for the current week
  // We want: Mon=0 ... Sat=5 Sun=6
  const mondayOffset = (todayDow === 0 ? -6 : 1 - todayDow); // days from today back to Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = toDateStr(d);
    const dow = d.getDay();
    const label = FULL_DAY_LABELS[dow];
    const isToday = dateStr === todayDateStr;
    const isPast = d < today;
    const isFuture = d > today;

    let status: DayEntry["status"];
    if (isToday) {
      status = activeSet.has(dateStr) ? "done" : "today";
    } else if (isFuture) {
      status = "future";
    } else {
      // past day
      status = activeSet.has(dateStr) ? "done" : "missed";
    }

    return { dateStr, label, status, isToday };
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

// ─── StreakBar (compact badge for header) ─────────────────────────────────────
export function StreakBar({ userId }: { userId: string }) {
  const [data, setData] = useState<StreakData | null>(null);

  const reload = () => { if (userId) setData(loadStreak(userId)); };

  useEffect(() => { reload(); }, [userId]);
  useEffect(() => {
    window.addEventListener("sabiskill-streak-update", reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener("sabiskill-streak-update", reload);
      window.removeEventListener("storage", reload);
    };
  }, [userId]);

  if (!userId || data === null) return null;

  const isActive = data.count > 0;
  const todayDone = data.activeDates?.includes(todayStr());

  return (
    <>
      <style>{`
        @keyframes sb-pop { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
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

// ─── StreakCard (full card for home page) ─────────────────────────────────────
export function StreakCard({ userId }: { userId: string }) {
  const [data, setData] = useState<StreakData | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = () => { if (userId) setData(loadStreak(userId)); };

  useEffect(() => {
    reload();
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [userId]);

  useEffect(() => {
    window.addEventListener("sabiskill-streak-update", reload);
    window.addEventListener("storage", reload);
    return () => {
      window.removeEventListener("sabiskill-streak-update", reload);
      window.removeEventListener("storage", reload);
    };
  }, [userId]);

  if (!userId || data === null) return null;

  const level = getLevel(data.count);
  const week = buildWeek(data.activeDates || []);
  const isActive = data.count > 0;
  const todayDone = data.activeDates?.includes(todayStr());

  // Progress to next milestone
  const MILESTONES = [3, 7, 14, 30, 60, 100];
  const nextMs = MILESTONES.find((m) => m > data.count) ?? 100;
  const prevMs = [...MILESTONES].reverse().find((m) => m <= data.count) ?? 0;
  const pct = prevMs === nextMs ? 100 : Math.min(100, Math.round(((data.count - prevMs) / (nextMs - prevMs)) * 100));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        .sc2 * { font-family:'Sora',sans-serif; }
        @keyframes sc2-in    { from{opacity:0;transform:translateY(12px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes sc2-flame { 0%,100%{transform:scale(1) rotate(-6deg);filter:drop-shadow(0 0 4px rgba(251,146,60,0))} 50%{transform:scale(1.2) rotate(6deg);filter:drop-shadow(0 0 14px rgba(251,146,60,.7))} }
        @keyframes sc2-pop   { 0%{transform:scale(0);opacity:0} 65%{transform:scale(1.3)} 100%{transform:scale(1);opacity:1} }
        @keyframes sc2-shimmer { 0%{transform:translateX(-120%)} 100%{transform:translateX(400%)} }
        @keyframes sc2-pulse { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes sc2-today-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 50%{box-shadow:0 0 0 6px rgba(59,130,246,0)} }
        .sc2-card   { animation: sc2-in .45s cubic-bezier(.22,1,.36,1) both; }
        .sc2-flame  { animation: sc2-flame ${isActive ? "1.9s" : "5s"} ease-in-out infinite; display:inline-block; line-height:1; }
        .sc2-pop    { animation: sc2-pop .4s cubic-bezier(.34,1.56,.64,1) both; }
        .sc2-shimmer{ animation: sc2-shimmer 2.2s ease-in-out infinite; }
        .sc2-pulse  { animation: sc2-pulse 1.4s ease-out infinite; }
        .sc2-today  { animation: sc2-today-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className={`sc2 max-w-7xl mx-auto mb-4 sm:mb-5 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <div
          className="sc2-card relative overflow-hidden rounded-2xl sm:rounded-3xl"
          style={{
            background: "linear-gradient(135deg,#0c1220 0%,#141b2d 60%,#0c1220 100%)",
            boxShadow: `0 0 0 1px rgba(255,255,255,.06), 0 16px 48px -12px ${isActive ? "rgba(59,130,246,.25)" : "rgba(0,0,0,.4)"}`,
          }}
        >
          {/* Background dot texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize:"20px 20px" }} />

          {/* Active glow */}
          {isActive && (
            <div className="absolute -top-6 left-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background:"radial-gradient(circle,#3b82f6,transparent 70%)" }} />
          )}

          {/* ── Top row: flame + count + label + best ── */}
          <div className="relative z-10 flex items-center px-4 sm:px-6 pt-4 sm:pt-5 pb-3 gap-4 sm:gap-5">

            {/* Flame + count */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative flex items-center justify-center">
                {isActive && <div className="sc2-pulse absolute w-9 h-9 rounded-full border-2 border-blue-400/40" />}
                <span className="sc2-flame text-3xl sm:text-4xl">{isActive ? "🔥" : "💤"}</span>
              </div>
              <span
                className="text-2xl sm:text-3xl font-black tabular-nums mt-0.5 leading-none"
                style={{ color: isActive ? "#fb923c" : "#64748b", textShadow: isActive ? "0 0 20px rgba(251,146,60,.4)" : "none" }}
              >
                {data.count}
              </span>
              <span className="text-[9px] text-white/25 font-bold uppercase tracking-widest mt-0.5">
                {data.count === 1 ? "day" : "days"}
              </span>
            </div>

            {/* Vertical divider */}
            <div className="w-px h-14 bg-white/8 flex-shrink-0" />

            {/* Label + sub */}
            <div className="flex-1 min-w-0">
              <p className="text-sm sm:text-base font-black leading-tight" style={{ color: level.color }}>
                {level.label}
              </p>
              <p className="text-[10px] sm:text-xs text-white/30 font-medium mt-0.5 leading-snug">
                {isActive
                  ? todayDone
                    ? `Today's session logged ✓`
                    : `Continue a course to keep your streak alive`
                  : `Complete a course today to start your streak`}
              </p>
            </div>

            {/* Best streak — hidden on tiny mobile */}
            <div className="hidden xs:flex sm:flex flex-col items-center gap-0.5 flex-shrink-0 bg-white/5 rounded-2xl px-3 py-2">
              <span className="text-xl">🏆</span>
              <span className="text-base sm:text-lg font-black text-white tabular-nums">{data.longest}</span>
              <span className="text-[8px] sm:text-[9px] text-white/25 font-bold uppercase tracking-widest">best</span>
            </div>
          </div>

          {/* ── Week row ── */}
          <div className="relative z-10 px-4 sm:px-6 pb-2 sm:pb-3">
            <div className="flex items-end justify-between gap-1 sm:gap-2">
              {week.map((day, i) => {
                const isDone    = day.status === "done";
                const isToday   = day.status === "today";
                const isFuture  = day.status === "future";
                const isMissed  = day.status === "missed";

                return (
                  <div key={day.dateStr} className="flex flex-col items-center gap-1 sm:gap-1.5 flex-1">

                    {/* The day circle / icon */}
                    <div
                      className={`
                        relative flex items-center justify-center
                        w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl
                        transition-all duration-300
                        ${isDone    ? "sc2-pop" : ""}
                        ${isToday && !todayDone ? "sc2-today" : ""}
                      `}
                      style={{
                        animationDelay: isDone ? `${i * 0.06}s` : "0s",
                        // Done = fire gradient orange
                        background: isDone
                          ? "linear-gradient(135deg,#fb923c,#ef4444)"
                          : isToday && !todayDone
                            // Today not yet done = blue pulsing
                            ? "rgba(59,130,246,.18)"
                            : isToday && todayDone
                              ? "linear-gradient(135deg,#fb923c,#ef4444)"
                              : isFuture
                                ? "rgba(255,255,255,.04)"
                                : "rgba(255,255,255,.05)", // missed
                        boxShadow: isDone
                          ? "0 2px 12px rgba(251,146,60,.35)"
                          : isToday && !todayDone
                            ? "0 0 0 2px rgba(59,130,246,.5)"
                            : isToday && todayDone
                              ? "0 2px 12px rgba(251,146,60,.35)"
                              : "none",
                      }}
                    >
                      {(isDone || (isToday && todayDone)) ? (
                        // 🔥 fire emoji for completed days
                        <span className="sc2-flame text-base sm:text-lg leading-none"
                          style={{ animationDuration: `${1.6 + i * 0.15}s` }}>
                          🔥
                        </span>
                      ) : isToday && !todayDone ? (
                        // Blue dot for today (in progress)
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-400" />
                      ) : isMissed ? (
                        // Small grey X for missed
                        <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 12 12">
                          <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        // Empty future day
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      )}
                    </div>

                    {/* Day label */}
                    <span
                      className="text-[8px] sm:text-[10px] font-bold leading-none"
                      style={{
                        color: isToday
                          ? "#60a5fa"               // blue for today
                          : isDone
                            ? "rgba(251,146,60,.7)" // orange for done
                            : "rgba(255,255,255,.2)", // dim for future/missed
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
              <span className="text-[9px] sm:text-[10px] text-white/20 font-semibold">
                {data.count} / {nextMs} days → next milestone
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-white/30">{pct}%</span>
            </div>
            <div className="relative w-full h-1.5 sm:h-2 bg-white/6 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{
                  width: `${pct}%`,
                  background: isActive
                    ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                    : "rgba(255,255,255,.1)",
                }}
              >
                {isActive && pct > 8 && (
                  <div className="sc2-shimmer absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
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