"use client";

/**
 * LearningStreak.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Tracks how many consecutive days a user has continued a course.
 *
 * HOW IT WORKS:
 * - Call `recordStreakActivity(userId)` from wherever the user clicks
 *   "Continue" on an active course. Pass it the Supabase user id so each
 *   user's streak is stored separately.
 * - Streak increments only once per calendar day (UTC).
 * - Missing a day resets the streak back to 0.
 * - Everything is stored in localStorage under `sabiskill_streak_<userId>`.
 *
 * PLACEMENT in HomeTab:
 *   1. Import: `import { LearningStreak, recordStreakActivity } from "../components/LearningStreak";`
 *   2. Call `recordStreakActivity(userId)` inside `handleStartFromGrid` when
 *      the course is active (not locked/available).
 *   3. Render `<LearningStreak userId={userId} />` anywhere in the HomeTab JSX
 *      — it's designed to slot neatly between the header and the hero banner.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from "react";
import { Flame, Zap, Trophy, Star } from "lucide-react";

// ─── Storage helpers ──────────────────────────────────────────────────────────
interface StreakData {
  count: number;         // current consecutive-day streak
  lastDate: string;      // ISO date string of last activity day "YYYY-MM-DD"
  longest: number;       // all-time longest streak
  totalDays: number;     // total days ever active
}

function streakKey(userId: string) {
  return `sabiskill_streak_${userId}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function daysBetween(a: string, b: string) {
  const msPerDay = 86400000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

function loadStreak(userId: string): StreakData {
  try {
    const raw = localStorage.getItem(streakKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { count: 0, lastDate: "", longest: 0, totalDays: 0 };
}

function saveStreak(userId: string, data: StreakData) {
  try {
    localStorage.setItem(streakKey(userId), JSON.stringify(data));
  } catch {}
}

/**
 * Call this whenever a user clicks "Continue" on their active course.
 * Safe to call multiple times in a day — only increments once per day.
 */
export function recordStreakActivity(userId: string) {
  if (!userId) return;
  const today = todayStr();
  const data = loadStreak(userId);

  if (data.lastDate === today) return; // already recorded today

  const gap = data.lastDate ? daysBetween(data.lastDate, today) : 1;

  const newCount = gap === 1 ? data.count + 1 : 1; // consecutive = +1, gap = reset to 1
  const newLongest = Math.max(data.longest, newCount);
  const newTotal = data.totalDays + 1;

  saveStreak(userId, {
    count: newCount,
    lastDate: today,
    longest: newLongest,
    totalDays: newTotal,
  });
}

// ─── Milestone config ─────────────────────────────────────────────────────────
function getMilestone(streak: number) {
  if (streak >= 30) return { label: "Legend", color: "#f59e0b", glow: "rgba(245,158,11,0.35)", icon: "👑" };
  if (streak >= 14) return { label: "On Fire", color: "#ef4444", glow: "rgba(239,68,68,0.35)", icon: "🔥" };
  if (streak >= 7)  return { label: "Hot Streak", color: "#f97316", glow: "rgba(249,115,22,0.30)", icon: "⚡" };
  if (streak >= 3)  return { label: "Building", color: "#3b82f6", glow: "rgba(59,130,246,0.25)", icon: "📈" };
  if (streak >= 1)  return { label: "Started", color: "#10b981", glow: "rgba(16,185,129,0.25)", icon: "🌱" };
  return { label: "No streak yet", color: "#94a3b8", glow: "transparent", icon: "💤" };
}

// Last 7 days dots
function getLast7(lastDate: string, count: number): boolean[] {
  const today = todayStr();
  return Array.from({ length: 7 }, (_, i) => {
    // i=6 is today, i=0 is 6 days ago
    const daysAgo = 6 - i;
    if (!lastDate) return false;
    const gap = daysBetween(lastDate, today);
    // Was this day active?
    if (gap > count) return false; // streak broke before this window
    return daysAgo < count && daysAgo <= gap;
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
interface LearningStreakProps {
  userId: string;
}

export function LearningStreak({ userId }: LearningStreakProps) {
  const [data, setData] = useState<StreakData>({ count: 0, lastDate: "", longest: 0, totalDays: 0 });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const loaded = loadStreak(userId);
    setData(loaded);
    // Trigger entrance animation
    const t = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(t);
  }, [userId]);

  if (!userId || data.count === 0) return null; // hide until streak starts

  const milestone = getMilestone(data.count);
  const dots = getLast7(data.lastDate, data.count);
  const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  // Align to real days — get the day of week for "6 days ago"
  const todayDow = new Date().getDay(); // 0=Sun
  const labels = Array.from({ length: 7 }, (_, i) => {
    const dow = (todayDow - (6 - i) + 7) % 7;
    return ["S", "M", "T", "W", "T", "F", "S"][dow];
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        .streak-root { font-family: 'Sora', sans-serif; }
        @keyframes streak-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes flame-pulse {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50%       { transform: scale(1.15) rotate(3deg); }
        }
        @keyframes dot-pop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .streak-card  { animation: streak-in 0.45s cubic-bezier(.22,1,.36,1) both; }
        .flame-icon   { animation: flame-pulse 1.8s ease-in-out infinite; }
        .dot-active   { animation: dot-pop 0.4s cubic-bezier(.34,1.56,.64,1) both; }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #fde68a 40%, #fbbf24 60%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      <div className="streak-root max-w-7xl mx-auto mb-4 sm:mb-5 px-0">
        <div
          className={`streak-card relative overflow-hidden rounded-2xl sm:rounded-3xl transition-all ${animate ? "opacity-100" : "opacity-0"}`}
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px -4px ${milestone.glow}`,
          }}
        >
          {/* Glow orb behind number */}
          <div
            className="absolute top-1/2 left-4 sm:left-6 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-2xl opacity-60 pointer-events-none"
            style={{ background: milestone.glow }}
          />

          {/* Subtle dot texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}
          />

          <div className="relative z-10 flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5">

            {/* Flame + count */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <span className="flame-icon text-2xl sm:text-3xl leading-none">{milestone.icon}</span>
              <span
                className="text-2xl sm:text-3xl font-black leading-none mt-0.5 tabular-nums"
                style={{ color: milestone.color, textShadow: `0 0 20px ${milestone.glow}` }}
              >
                {data.count}
              </span>
              <span className="text-[9px] sm:text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">
                day{data.count !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-10 sm:h-12 bg-white/10 flex-shrink-0" />

            {/* Middle: label + days */}
            <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-sm sm:text-base font-black"
                  style={{ color: milestone.color }}
                >
                  {milestone.label}
                </span>
                <span className="text-white/40 text-[10px] sm:text-xs font-semibold">
                  · {data.totalDays} total day{data.totalDays !== 1 ? "s" : ""}
                </span>
              </div>

              {/* 7-day dot grid */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                {dots.map((active, i) => (
                  <div key={i} className="flex flex-col items-center gap-0.5 sm:gap-1">
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                        active ? "dot-active" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.06}s`,
                        background: active
                          ? `linear-gradient(135deg, ${milestone.color}, ${milestone.color}cc)`
                          : "rgba(255,255,255,0.06)",
                        boxShadow: active ? `0 0 8px ${milestone.glow}` : "none",
                      }}
                    >
                      {active && (
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L5 8.5 2 5.5l-1 1 4 4 6-7z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold text-white/25">{labels[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: longest streak */}
            <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-0.5 text-center">
              <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
              <span className="text-lg font-black text-white tabular-nums">{data.longest}</span>
              <span className="text-[9px] text-white/30 font-semibold uppercase tracking-wide">best</span>
            </div>

          </div>

          {/* Bottom progress bar toward next milestone */}
          {(() => {
            const milestones = [3, 7, 14, 30];
            const next = milestones.find((m) => m > data.count) ?? 30;
            const prev = milestones.filter((m) => m <= data.count).pop() ?? 0;
            const pct = Math.round(((data.count - prev) / (next - prev)) * 100);
            return (
              <div className="relative z-10 px-4 sm:px-6 pb-3 sm:pb-4">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/30 font-semibold mb-1">
                  <span>{data.count} day{data.count !== 1 ? "s" : ""}</span>
                  <span>{next} day milestone</span>
                </div>
                <div className="w-full h-1 sm:h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${milestone.color}99, ${milestone.color})`,
                    }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}

export default LearningStreak;