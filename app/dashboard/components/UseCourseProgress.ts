"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { ALL_COURSES } from "./ExploreTab";

// Per-course progress detail (lesson index + real %)
export interface CourseProgressDetail {
  courseId: string;
  status: "started" | "completed";
  currentLesson: number;   // 0-based lesson index to resume from
  totalLessons: number;
  progressPct: number;     // 0-100, calculated from completed lessons
}

interface CourseProgressState {
  activeCourseId: string | null;
  completedCourseIds: string[];
  /** Map of courseId → progress detail (only courses with saved progress) */
  progressMap: Record<string, CourseProgressDetail>;
  loading: boolean;
  selectCourse: (courseId: string) => Promise<void>;
  saveLessonProgress: (
    courseId: string,
    completedLessonIndex: number,
    totalLessons: number
  ) => Promise<void>;
  completeCourse: (courseId: string) => Promise<void>;
}

export function useCourseProgress(): CourseProgressState {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgressDetail>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data, error } = await supabase
          .from("course_progress")
          .select("course_id, status, current_lesson, total_lessons, progress_pct")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading course progress:", error.message);
          setLoading(false);
          return;
        }

        if (data) {
          const completed: string[] = [];
          let active: string | null = null;
          const map: Record<string, CourseProgressDetail> = {};

          data.forEach((row) => {
            if (row.status === "completed") completed.push(row.course_id);
            else if (row.status === "started") active = row.course_id;

            map[row.course_id] = {
              courseId: row.course_id,
              status: row.status,
              currentLesson: row.current_lesson ?? 0,
              totalLessons: row.total_lessons ?? 0,
              progressPct: row.progress_pct ?? 0,
            };
          });

          setCompletedCourseIds(completed);
          setActiveCourseId(active);
          setProgressMap(map);
        }
      } catch (err) {
        console.error("Failed to load course progress:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const selectCourse = useCallback(async (courseId: string) => {
    setActiveCourseId(courseId);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const course = ALL_COURSES.find((c) => c.id === courseId);
      const totalLessons = course?.lessons ?? 0;

      // Insert only if no row exists — preserves existing progress
      await supabase.from("course_progress").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          status: "started",
          current_lesson: 0,
          total_lessons: totalLessons,
          progress_pct: 0,
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id", ignoreDuplicates: true }
      );

      // Always refresh last_accessed_at
      await supabase
        .from("course_progress")
        .update({ last_accessed_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("course_id", courseId);

    } catch (err) {
      console.error("Failed to select course:", err);
    }
  }, []);

  const saveLessonProgress = useCallback(async (
    courseId: string,
    completedLessonIndex: number,
    totalLessons: number
  ) => {
    const completedCount = completedLessonIndex + 1;
    const progressPct = Math.round((completedCount / totalLessons) * 100);
    const nextLesson = Math.min(completedLessonIndex + 1, totalLessons - 1);

    // Optimistic local update so UI reflects immediately
    setProgressMap((prev) => ({
      ...prev,
      [courseId]: {
        courseId,
        status: "started",
        currentLesson: nextLesson,
        totalLessons,
        progressPct,
      },
    }));

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("course_progress").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          status: "started",
          current_lesson: nextLesson,
          total_lessons: totalLessons,
          progress_pct: progressPct,
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id", ignoreDuplicates: false }
      );

      if (error) console.error("Error saving lesson progress:", error.message);
    } catch (err) {
      console.error("Failed to save lesson progress:", err);
    }
  }, []);

  const completeCourse = useCallback(async (courseId: string) => {
    const course = ALL_COURSES.find((c) => c.id === courseId);
    const totalLessons = course?.lessons ?? 0;

    setCompletedCourseIds((prev) => prev.includes(courseId) ? prev : [...prev, courseId]);
    setActiveCourseId((prev) => prev === courseId ? null : prev);
    setProgressMap((prev) => ({
      ...prev,
      [courseId]: {
        courseId,
        status: "completed",
        currentLesson: totalLessons - 1,
        totalLessons,
        progressPct: 100,
      },
    }));

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
        { onConflict: "user_id,course_id", ignoreDuplicates: false }
      );

      if (error) console.error("Error completing course:", error.message);
    } catch (err) {
      console.error("Failed to complete course:", err);
    }
  }, []);

  return {
    activeCourseId,
    completedCourseIds,
    progressMap,
    loading,
    selectCourse,
    saveLessonProgress,
    completeCourse,
  };
}