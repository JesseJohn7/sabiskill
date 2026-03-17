"use client";

/**
 * LearningStreak.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Duolingo-style streak tracker. Always visible. Shows 0 when no streak yet.
 *
 * PLACEMENT:
 *   Render <StreakBar userId={userId} /> inside the header row in HomeTab,
 *   right next to the "Hello, {firstName}" text — it will sit inline on desktop
 *   and stack below the greeting on mobile.
 *
 * TRIGGERING:
 *   Call recordStreakActivity(userId) whenever the user clicks Continue on
 *   their active course (already done in handleStartFromGrid).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState, useRef } from "react";

// ─── Storage ──────────────────────────────────────────────────────────────────
interface StreakData {
  count: number;
  lastDate: string;  // "YYYY-MM-DD"
  longest: number;
  totalDays: number;
}

function streakKey(userId: string) {
  return `sabiskill_streak_${userId}`;
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86400000
  );
}

function loadStreak(userId: string): StreakData {
  try {
    const raw = localStorage.getItem(streakKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastDate: "", longest: 0, totalDays: 0 };
}

function saveStreakData(userId: string, data: StreakData) {
  try {
    localStorage.setItem(streakKey(userId), JSON.stringify(data));
  } catch {}
}

/** Call when user clicks Continue on their active course */
export function recordStreakActivity(userId: string) {
  if (!userId) return;
  const today = todayUTC();
  const data = loadStreak(userId);
  if (data.lastDate === today) return; // already counted today

  const gap = data.lastDate ? daysBetween(data.lastDate, today) : 1;
  const newCount = gap === 1 ? data.count + 1 : 1;
  saveStreakData(userId, {
    count: newCount,
    lastDate: today,
    longest: Math.max(data.longest, newCount),
    totalDays: data.totalDays + 1,
  });
}

// ─── Visual helpers ───────────────────────────────────────────────────────────
function getStreakLevel(n: number) {
  if (n >= 30) return { bg: "from-amber-400 to-orange-500", badge: "from-amber-300 to-orange-400", text: "text-amber-900", label: "Legendary" };
  if (n >= 14) return { bg: "from-orange-400 to-red-500",   badge: "from-orange-300 to-red-400",   text: "text-orange-900", label: "On Fire" };
  if (n >= 7)  return { bg: "from-orange-300 to-amber-500", badge: "from-orange-200 to-amber-400", text: "text-orange-900", label: "Hot" };
  if (n >= 3)  return { bg: "from-blue-400 to-blue-600",    badge: "from-blue-300 to-blue-500",    text: "text-blue-900",   label: "Building" };
  if (n >= 1)  return { bg: "from-emerald-400 to-teal-500", badge: "from-emerald-300 to-teal-400", text: "text-emerald-900",label: "Started" };
  return       { bg: "from-slate-300 to-slate-400",          badge: "from-slate-200 to-slate-300",  text: "text-slate-600",  label: "Start a streak!" };
}

// Last 7 days: which ones had activity?
function buildWeek(lastDate: string, count: number): boolean[] {
  const today = todayUTC();
  return Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i; // i=0 → 6 days ago, i=6 → today
    if (!lastDate || count === 0) return false;
    const gapFromLast = daysBetween(lastDate, today);
    // This day was active if it falls within [today - count + 1 ... today]
    // AND it's not after lastDate
    return daysAgo >= 0 && daysAgo < count && gapFromLast <= daysAgo + (gapFromLast > 0 ? gapFromLast : 0);
  });
}

// Simpler, more reliable week builder
function buildWeekDots(lastDate: string, count: number): boolean[] {
  if (!lastDate || count === 0) return Array(7).fill(false);
  const today = todayUTC();
  const gapToToday = daysBetween(lastDate, today);

  // If gap > 1, streak is broken — show 0 active dots for recent days
  // (the streak is already reset to 1 by recordStreakActivity)
  return Array.from({ length: 7 }, (_, i) => {
    const daysAgo = 6 - i;
    // A dot is active if:
    // - It corresponds to lastDate or earlier within the streak window
    // - The day is within [lastDate - (count-1) .. lastDate]
    const dayOffset = daysAgo - gapToToday; // positive = before lastDate
    return dayOffset >= 0 && dayOffset < count;
  });
}

// Day labels aligned to real weekdays
function getDayLabels(): string[] {
  const dow = new Date().getDay(); // 0=Sun
  const short = ["S","M","T","W","T","F","S"];
  return Array.from({ length: 7 }, (_, i) => {
    return short[(dow - (6 - i) + 7) % 7];
  });
}

// ─── StreakBar — compact inline badge (for header) ────────────────────────────
interface StreakBarProps {
  userId: string;
  /** compact mode for mobile header */
  compact?: boolean;
}

export function StreakBar({ userId, compact = false }: StreakBarProps) {
  const [data, setData] = useState<StreakData | null>(null);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setData(loadStreak(userId));
  }, [userId]);

  // Reload when localStorage changes (after recordStreakActivity)
  useEffect(() => {
    if (!userId) return;
    const handler = () => setData(loadStreak(userId));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [userId]);

  if (!userId || data === null) return null;

  const level = getStreakLevel(data.count);
  const isActive = data.count > 0;

  return (
    <>
      <style>{`
        @keyframes streak-pop {
          0%   { transform: scale(0.85); opacity: 0; }
          65%  { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes flame-bob {
          0%, 100% { transform: translateY(0) rotate(-4deg) scale(1); }
          50%       { transform: translateY(-3px) rotate(4deg) scale(1.1); }
        }
        @keyframes count-bounce {
          0%, 100% { transform: scale(1); }
          40%       { transform: scale(1.25); }
        }
        .streak-badge   { animation: streak-pop 0.4s cubic-bezier(.34,1.56,.64,1) both; }
        .flame-anim     { animation: flame-bob ${isActive ? "1.6s" : "3s"} ease-in-out infinite; display: inline-block; }
        .count-anim     { animation: count-bounce 0.5s ease both; }
      `}</style>

      <div className={`streak-badge inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${level.bg} shadow-md cursor-default select-none`}>
        <span className="flame-anim text-lg sm:text-xl leading-none">
          {isActive ? "🔥" : "💤"}
        </span>
        <span className={`count-anim text-base sm:text-lg font-black tabular-nums leading-none ${level.text}`}>
          {data.count}
        </span>
        {!compact && (
          <span className={`text-[10px] sm:text-xs font-bold leading-none ${level.text} opacity-80`}>
            day{data.count !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </>
  );
}

// ─── StreakCard — full card (for home page) ───────────────────────────────────
interface StreakCardProps {
  userId: string;
}

export function StreakCard({ userId }: StreakCardProps) {
  const [data, setData] = useState<StreakData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setData(loadStreak(userId));
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const handler = () => setData(loadStreak(userId));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [userId]);

  if (!userId || data === null) return null;

  const level = getStreakLevel(data.count);
  const dots = buildWeekDots(data.lastDate, data.count);
  const labels = getDayLabels();
  const isActive = data.count > 0;

  // Next milestone
  const MILESTONES = [3, 7, 14, 30, 60, 100];
  const nextMilestone = MILESTONES.find((m) => m > data.count) ?? 100;
  const prevMilestone = [...MILESTONES].reverse().find((m) => m <= data.count) ?? 0;
  const progressPct = Math.min(
    100,
    Math.round(((data.count - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        .sc-root * { font-family: 'Sora', sans-serif; }
        @keyframes sc-in {
          from { opacity:0; transform:translateY(14px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes sc-flame {
          0%, 100% { transform: scale(1) rotate(-5deg); filter: drop-shadow(0 0 6px rgba(251,146,60,0)); }
          50%       { transform: scale(1.18) rotate(5deg); filter: drop-shadow(0 0 12px rgba(251,146,60,.6)); }
        }
        @keyframes sc-dot-pop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sc-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes sc-pulse-ring {
          0%   { transform: scale(1); opacity: .6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .sc-card    { animation: sc-in .45s cubic-bezier(.22,1,.36,1) both; }
        .sc-flame   { animation: sc-flame ${isActive ? "1.8s" : "4s"} ease-in-out infinite; display:inline-block; line-height:1; }
        .sc-dot-active { animation: sc-dot-pop .4s cubic-bezier(.34,1.56,.64,1) both; }
        .sc-shimmer { animation: sc-shimmer 1.8s ease both; }
        .sc-pulse   { animation: sc-pulse-ring 1.3s ease-out infinite; }
      `}</style>

      <div className={`sc-root max-w-7xl mx-auto mb-4 sm:mb-5 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        <div className={`sc-card relative overflow-hidden rounded-2xl sm:rounded-3xl`}
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1a1035 55%, #0f172a 100%)",
            boxShadow: `0 0 0 1px rgba(255,255,255,.07), 0 12px 40px -8px ${isActive ? "rgba(251,146,60,.3)" : "rgba(0,0,0,.3)"}`,
          }}
        >
          {/* Subtle grid texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "18px 18px" }} />

          {/* Glow blob */}
          {isActive && (
            <div className="absolute -top-4 -right-4 w-32 h-32 sm:w-40 sm:h-40 rounded-full pointer-events-none blur-3xl opacity-25"
              style={{ background: "radial-gradient(circle, #fb923c, transparent 70%)" }} />
          )}

          <div className="relative z-10 flex items-center gap-0 sm:gap-0">

            {/* ── Left: big flame + count ── */}
            <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-4 sm:py-5 min-w-[80px] sm:min-w-[100px]">
              {/* Pulse ring on active */}
              {isActive && (
                <div className="relative flex items-center justify-center mb-1">
                  <div className="sc-pulse absolute w-8 h-8 rounded-full border-2 border-orange-400/50" />
                  <span className="sc-flame text-3xl sm:text-4xl">{isActive ? "🔥" : "💤"}</span>
                </div>
              )}
              {!isActive && <span className="sc-flame text-3xl sm:text-4xl mb-1">💤</span>}

              <span
                className="text-3xl sm:text-4xl font-black tabular-nums leading-none"
                style={{
                  color: isActive ? "#fb923c" : "#94a3b8",
                  textShadow: isActive ? "0 0 24px rgba(251,146,60,.5)" : "none",
                }}
              >
                {data.count}
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">
                {data.count === 1 ? "day" : "days"}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-16 sm:h-20 bg-white/8 flex-shrink-0" />

            {/* ── Center: label + week dots + progress ── */}
            <div className="flex-1 px-4 sm:px-5 py-3 sm:py-4 space-y-2 sm:space-y-3 min-w-0">

              {/* Label row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm sm:text-base font-black bg-gradient-to-r ${level.bg} bg-clip-text text-transparent`}>
                  {level.label}
                </span>
                {!isActive && (
                  <span className="text-[10px] sm:text-xs text-white/35 font-medium">
                    Continue a course to start your streak
                  </span>
                )}
                {isActive && data.totalDays > 1 && (
                  <span className="text-[10px] sm:text-xs text-white/30 font-semibold">
                    {data.totalDays} total days
                  </span>
                )}
              </div>

              {/* Week dots */}
              <div className="flex items-end gap-1 sm:gap-1.5">
                {dots.map((active, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <div
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${active ? "sc-dot-active" : ""}`}
                      style={{
                        animationDelay: `${i * 0.05 + 0.1}s`,
                        background: active
                          ? `linear-gradient(135deg, #fb923c, #ef4444)`
                          : "rgba(255,255,255,.06)",
                        boxShadow: active ? "0 2px 10px rgba(251,146,60,.4)" : "none",
                      }}
                    >
                      {active ? (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white drop-shadow" fill="none" viewBox="0 0 16 16">
                          <path d="M3 8.5l3.5 3.5 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-white/25">{labels[i]}</span>
                  </div>
                ))}
              </div>

              {/* Progress to next milestone */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] text-white/25 font-semibold">
                    {data.count} / {nextMilestone} days to next milestone
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-white/40">{progressPct}%</span>
                </div>
                <div className="relative w-full h-1.5 sm:h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progressPct}%`,
                      background: isActive
                        ? "linear-gradient(90deg, #fb923c, #ef4444)"
                        : "rgba(255,255,255,.15)",
                    }}
                  >
                    {/* Shimmer on the bar */}
                    {isActive && progressPct > 5 && (
                      <div className="sc-shimmer absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: best streak (hidden on small mobile) ── */}
            <div className="hidden sm:flex flex-col items-center justify-center px-5 py-4 gap-1 border-l border-white/8 min-w-[72px]">
              <span className="text-lg">🏆</span>
              <span className="text-xl font-black text-white tabular-nums">{data.longest}</span>
              <span className="text-[9px] text-white/25 font-bold uppercase tracking-wide">best</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// Default export = StreakCard (what HomeTab uses)
export default StreakCard;