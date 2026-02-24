"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "../../lib/supabase/client";  // ✅ CORRECT - two levels up

// ── Types ────────────────────────────────────────────────────────────────────

export interface CourseProgressRow {
  course_id: string;
  status: "started" | "completed";
  current_lesson: number;
  total_lessons: number;
  progress_pct: number;
  started_at: string;
  last_accessed_at: string;
  completed_at: string | null;
}

export type ProgressMap = Record<string, CourseProgressRow>;

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useCourseProgress() {
  const supabase = createClient();

  const [progressMap, setProgressMap] = useState<ProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ── Fetch all progress rows for the current user ──────────────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("course_progress")
        .select("*")
        .eq("user_id", user.id);

      if (!error && data) {
        const map: ProgressMap = {};
        data.forEach((row: CourseProgressRow) => {
          map[row.course_id] = row;
        });
        setProgressMap(map);
      }

      setLoading(false);
    };

    init();
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────

  // The one course the user is actively working on (started but not completed)
  const activeCourseId =
    Object.values(progressMap).find((r) => r.status === "started")?.course_id ??
    null;

  // All course ids that are fully completed
  const completedCourseIds = Object.values(progressMap)
    .filter((r) => r.status === "completed")
    .map((r) => r.course_id);

  // ── openCourse ────────────────────────────────────────────────────────────
  // Call this when a user clicks "Start" or "Continue" on a course.
  // Creates a new row if it doesn't exist, or updates last_accessed_at.
  const openCourse = useCallback(
    async (courseId: string, totalLessons: number) => {
      if (!userId) return;

      const existing = progressMap[courseId];

      if (existing) {
        // Just update last_accessed_at
        const { error } = await supabase
          .from("course_progress")
          .update({ last_accessed_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("course_id", courseId);

        if (!error) {
          setProgressMap((prev) => ({
            ...prev,
            [courseId]: {
              ...prev[courseId],
              last_accessed_at: new Date().toISOString(),
            },
          }));
        }
      } else {
        // Insert new row — course is being opened for the first time
        const newRow: Omit<CourseProgressRow, "completed_at"> & {
          user_id: string;
          completed_at: null;
        } = {
          user_id: userId,
          course_id: courseId,
          status: "started",
          current_lesson: 0,
          total_lessons: totalLessons,
          progress_pct: 0,
          started_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          completed_at: null,
        };

        const { error } = await supabase
          .from("course_progress")
          .insert(newRow);

        if (!error) {
          setProgressMap((prev) => ({
            ...prev,
            [courseId]: { ...newRow, status: "started" },
          }));
        }
      }
    },
    [userId, progressMap]
  );

  // ── advanceLesson ─────────────────────────────────────────────────────────
  // Call this whenever the user moves to the next lesson inside a course.
  // lessonIndex is 0-based. totalLessons is the full lesson count.
  const advanceLesson = useCallback(
    async (courseId: string, lessonIndex: number, totalLessons: number) => {
      if (!userId) return;

      const progressPct = Math.round(((lessonIndex + 1) / totalLessons) * 100);

      const update = {
        current_lesson: lessonIndex,
        total_lessons: totalLessons,
        progress_pct: progressPct,
        last_accessed_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("course_progress")
        .update(update)
        .eq("user_id", userId)
        .eq("course_id", courseId);

      if (!error) {
        setProgressMap((prev) => ({
          ...prev,
          [courseId]: { ...prev[courseId], ...update },
        }));
      }
    },
    [userId]
  );

  // ── completeCourse ────────────────────────────────────────────────────────
  // Call this when the user finishes the last lesson.
  const completeCourse = useCallback(
    async (courseId: string, totalLessons: number) => {
      if (!userId) return;

      const update = {
        status: "completed" as const,
        current_lesson: totalLessons - 1,
        total_lessons: totalLessons,
        progress_pct: 100,
        last_accessed_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("course_progress")
        .update(update)
        .eq("user_id", userId)
        .eq("course_id", courseId);

      if (!error) {
        setProgressMap((prev) => ({
          ...prev,
          [courseId]: { ...prev[courseId], ...update },
        }));
      }
    },
    [userId]
  );

  return {
    loading,
    progressMap,
    activeCourseId,
    completedCourseIds,
    openCourse,
    advanceLesson,
    completeCourse,
  };
}