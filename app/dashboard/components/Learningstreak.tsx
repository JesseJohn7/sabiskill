"use client";

/**
 * LearningStreak.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Streak counts in DAYS.
 * • Learn today → streak +1
 * • Miss any single day → streak resets to 0 (best is preserved)
 * • Calendar shows the full current month with a flame on each active day
 */

import React, { useEffect, useState, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface StreakData {
  count: number;
  lastDate: string;
  longest: number;
  totalDays: number;
  activeDates: string[];
}

const EMPTY: StreakData = {
  count: 0, lastDate: "", longest: 0, totalDays: 0, activeDates: [],
};

// ─── Date helpers ─────────────────────────────────────────────────────────────
function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayStr(): string { return toDateStr(new Date()); }
function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b + "T00:00:00").getTime() - new Date(a + "T00:00:00").getTime()) / 86400000
  );
}

// ─── localStorage cache ───────────────────────────────────────────────────────
function cacheKey(uid: string) { return `sabiskill_streak_${uid}`; }
function readCache(uid: string): StreakData | null {
  try { const r = localStorage.getItem(cacheKey(uid)); return r ? JSON.parse(r) : null; }
  catch { return null; }
}
function writeCache(uid: string, d: StreakData) {
  try { localStorage.setItem(cacheKey(uid), JSON.stringify(d)); } catch {}
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
async function fetchFromSupabase(uid: string): Promise<StreakData | null> {
  try {
    const sb = createClient();
    const { data, error } = await sb
      .from("user_streaks")
      .select("count, last_date, longest, total_days, active_dates")
      .eq("user_id", uid)
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

async function upsertToSupabase(uid: string, s: StreakData): Promise<void> {
  try {
    const sb = createClient();
    await sb.from("user_streaks").upsert({
      user_id:      uid,
      count:        s.count,
      last_date:    s.lastDate || null,
      longest:      s.longest,
      total_days:   s.totalDays,
      active_dates: s.activeDates,
      updated_at:   new Date().toISOString(),
    }, { onConflict: "user_id" });
  } catch {}
}

// ─── Core streak logic ────────────────────────────────────────────────────────
function computeNewStreak(current: StreakData): StreakData {
  const today = todayStr();
  if (current.lastDate === today) return current;
  const gap = current.lastDate ? daysBetween(current.lastDate, today) : 1;
  // gap > 1 means at least one day was missed → reset to 1
  const newCount = gap === 1 ? current.count + 1 : 1;
  const newDates = [...new Set([...(current.activeDates ?? []), today])].slice(-90);
  return {
    count:       newCount,
    lastDate:    today,
    longest:     Math.max(current.longest, newCount),
    totalDays:   current.totalDays + 1,
    activeDates: newDates,
  };
}

export async function recordStreakActivity(uid: string): Promise<void> {
  if (!uid) return;
  let current = await fetchFromSupabase(uid);
  if (!current) current = readCache(uid) ?? EMPTY;
  if (current.lastDate === todayStr()) return;
  const updated = computeNewStreak(current);
  writeCache(uid, updated);
  window.dispatchEvent(new CustomEvent("sabiskill-streak-update", { detail: updated }));
  await upsertToSupabase(uid, updated);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useStreakData(uid: string) {
  const [data, setData] = useState<StreakData | null>(() => uid ? readCache(uid) : null);
  const load = useCallback(async () => {
    if (!uid) return;
    const cached = readCache(uid);
    if (cached) setData(cached);
    const remote = await fetchFromSupabase(uid);
    if (remote) { writeCache(uid, remote); setData(remote); }
  }, [uid]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent).detail as StreakData | undefined;
      if (d) setData(d); else load();
    };
    window.addEventListener("sabiskill-streak-update", h);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("sabiskill-streak-update", h);
      window.removeEventListener("storage", load);
    };
  }, [load]);
  return data;
}

// ─── StreakBar — compact header badge ────────────────────────────────────────
export function StreakBar({ userId }: { userId: string }) {
  const data = useStreakData(userId);
  if (!userId || !data) return null;
  const active    = data.count > 0;
  const todayDone = data.activeDates.includes(todayStr());

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-secondary)",
      borderRadius: 999, padding: "6px 12px",
    }}>
      <span style={{ fontSize: 16 }}>{todayDone || active ? "🔥" : "💤"}</span>
      <span style={{
        fontSize: 14, fontWeight: 500, lineHeight: 1,
        color: active ? "#f97316" : "var(--color-text-tertiary)",
      }}>
        {data.count}
      </span>
      <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
        day{data.count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ─── StreakCard — compact monthly calendar card ───────────────────────────────
export function StreakCard({ userId }: { userId: string }) {
  const data = useStreakData(userId);
  if (!userId || !data) return null;

  const today      = todayStr();
  const now        = new Date(today + "T00:00:00");
  const activeSet  = new Set(data.activeDates);
  const todayDone  = activeSet.has(today);
  const isActive   = data.count > 0;

  // Build calendar for current month
  const year        = now.getFullYear();
  const month       = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow    = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = firstDow === 0 ? 6 : firstDow - 1; // shift Mon=0
  const monthLabel  = now.toLocaleString("default", { month: "long", year: "numeric" });
  const DAY_LABELS  = ["M", "T", "W", "T", "F", "S", "S"];

  type CellType = "done" | "today" | "missed" | "future" | "empty";
  const cells: Array<{ day: number; dateStr: string; type: CellType }> = [];

  for (let i = 0; i < startOffset; i++) cells.push({ day: 0, dateStr: "", type: "empty" });

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    let type: CellType;
    if (activeSet.has(dateStr))  type = "done";
    else if (dateStr === today)  type = "today";
    else if (dateStr > today)    type = "future";
    else                         type = "missed";
    cells.push({ day: d, dateStr, type });
  }

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "14px 16px 14px",
      marginBottom: 16,
      maxWidth: "100%",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>

        {/* Flame + count */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>{isActive ? "🔥" : "💤"}</span>
          <div>
            <span style={{
              fontSize: 20, fontWeight: 500, lineHeight: 1,
              color: isActive ? "#f97316" : "var(--color-text-tertiary)",
            }}>
              {data.count}
            </span>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: 4 }}>
              day streak
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Best */}
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          background: "var(--color-background-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-md)",
          padding: "5px 10px", flexShrink: 0,
        }}>
          <span style={{ fontSize: 14 }}>🏆</span>
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>{data.longest}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginLeft: 3 }}>best</span>
          </div>
        </div>
      </div>

      {/* Status message */}
      <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-text-secondary)" }}>
        {todayDone
          ? `Today's session logged ✓ — ${data.totalDays} total day${data.totalDays !== 1 ? "s" : ""} learned`
          : isActive
            ? "Learn today or your streak resets to 0!"
            : "Complete a course today to start your streak"}
      </p>

      {/* ── Month label ── */}
      <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 500, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {monthLabel}
      </p>

      {/* ── Day headers ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 3 }}>
        {DAY_LABELS.map((l, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 10, fontWeight: 500, color: "var(--color-text-tertiary)" }}>
            {l}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((cell, i) => {
          if (cell.type === "empty") return <div key={`e-${i}`} />;

          const isDone   = cell.type === "done";
          const isToday  = cell.type === "today";
          const isMissed = cell.type === "missed";

          return (
            <div
              key={cell.dateStr}
              style={{
                aspectRatio: "1",
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0,
                background: isDone
                  ? "#fff7ed"
                  : isToday
                    ? "var(--color-background-info)"
                    : isMissed
                      ? "var(--color-background-secondary)"
                      : "transparent",
                border: isToday
                  ? "1px solid var(--color-border-info)"
                  : isDone
                    ? "1px solid #fed7aa"
                    : "none",
              }}
            >
              {isDone ? (
                <>
                  <span style={{ fontSize: 11, lineHeight: 1 }}>🔥</span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: "#c2410c", lineHeight: 1.2 }}>{cell.day}</span>
                </>
              ) : isToday ? (
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-info)", lineHeight: 1 }}>{cell.day}</span>
              ) : isMissed ? (
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1 }}>{cell.day}</span>
              ) : (
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", opacity: 0.45, lineHeight: 1 }}>{cell.day}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
        {[
          { emoji: "🔥", label: "Learned" },
          { color: "var(--color-background-info)", border: "var(--color-border-info)", label: "Today" },
          { color: "var(--color-background-secondary)", border: "var(--color-border-tertiary)", label: "Missed" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {"emoji" in item ? (
              <span style={{ fontSize: 11 }}>{item.emoji}</span>
            ) : (
              <div style={{
                width: 10, height: 10, borderRadius: 3,
                background: item.color,
                border: `0.5px solid ${item.border}`,
              }} />
            )}
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{item.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default StreakCard;