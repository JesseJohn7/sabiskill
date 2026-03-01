"use client";

/**
 * useCourseProgress — custom hook
 *
 * Loads the user's course progress from Supabase on mount, and
 * exposes a `selectCourse` function that writes back to Supabase
 * whenever the user starts/continues a course.
 *
 * Usage:
 *   const { activeCourseId, completedCourseIds, selectCourse, loading } = useCourseProgress();
 *
 * Then pass these props to HomeTab / ExploreTab:
 *   <HomeTab
 *     activeCourseId={activeCourseId}
 *     completedCourseIds={completedCourseIds}
 *     onCourseSelect={selectCourse}
 *   />
 */

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { ALL_COURSES } from "./ExploreTab";

interface CourseProgressState {
  activeCourseId: string | null;
  completedCourseIds: string[];
  loading: boolean;
  /** Call this when a user clicks "Start" or "Continue" on a course */
  selectCourse: (courseId: string) => Promise<void>;
  /** Call this when a user marks a course complete */
  completeCourse: (courseId: string) => Promise<void>;
}

export function useCourseProgress(): CourseProgressState {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ── 1. Load from Supabase on mount ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("course_progress")
          .select("course_id, status")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading course progress:", error.message);
          setLoading(false);
          return;
        }

        if (data) {
          const completed = data
            .filter((row) => row.status === "completed")
            .map((row) => row.course_id);

          const active = data.find((row) => row.status === "started");

          setCompletedCourseIds(completed);
          setActiveCourseId(active?.course_id ?? null);
        }
      } catch (err) {
        console.error("Failed to load course progress:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── 2. Select (start/continue) a course ─────────────────────────────────
  const selectCourse = useCallback(async (courseId: string) => {
    // Optimistic update
    setActiveCourseId(courseId);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const course = ALL_COURSES.find((c) => c.id === courseId);
      const totalLessons = course?.lessons ?? 0;

      const { error } = await supabase.from("course_progress").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          status: "started",
          current_lesson: 0,
          total_lessons: totalLessons,
          progress_pct: 10,
          last_accessed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,course_id",
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error("Error saving course progress:", error.message);
      }
    } catch (err) {
      console.error("Failed to save course progress:", err);
    }
  }, []);

  // ── 3. Mark a course as completed ───────────────────────────────────────
  const completeCourse = useCallback(async (courseId: string) => {
    // Optimistic update
    setCompletedCourseIds((prev) =>
      prev.includes(courseId) ? prev : [...prev, courseId]
    );
    setActiveCourseId((prev) => (prev === courseId ? null : prev));

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const course = ALL_COURSES.find((c) => c.id === courseId);
      const totalLessons = course?.lessons ?? 0;

      const { error } = await supabase.from("course_progress").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          status: "completed",
          current_lesson: totalLessons,
          total_lessons: totalLessons,
          progress_pct: 100,
          last_accessed_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,course_id",
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error("Error completing course:", error.message);
      }
    } catch (err) {
      console.error("Failed to complete course:", err);
    }
  }, []);

  return {
    activeCourseId,
    completedCourseIds,
    loading,
    selectCourse,
    completeCourse,
  };
}