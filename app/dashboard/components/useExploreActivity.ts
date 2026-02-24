"use client";

/**
 * useExploreActivity
 * ------------------
 * Records when a user views a course detail page in ExploreTab.
 * Writes to the explore_views table in Supabase.
 *
 * Usage:
 *   const { recordView } = useExploreActivity();
 *   recordView("web-dev"); // call when user opens a course card
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "../../lib/supabase/client";  // ✅ CORRECT - two levels up

export function useExploreActivity() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  // ── recordView ────────────────────────────────────────────────
  // Call whenever user opens a course detail card in ExploreTab
  const recordView = useCallback(async (courseId: string) => {
    if (!userId) return;

    await supabase
      .from("explore_views")
      .insert({ user_id: userId, course_id: courseId });
    // We silently ignore errors here — view tracking is non-critical
  }, [userId]);

  return { recordView };
}