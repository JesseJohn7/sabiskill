"use client";

/**
 * useCommunityActivity
 * --------------------
 * Loads which communities the logged-in user has joined,
 * and lets them join/unjoin — all saved to Supabase per user.
 *
 * Usage:
 *   const { joinedIds, loading, joinCommunity, leaveCommunity } = useCommunityActivity();
 */

import { useEffect, useState, useCallback } from "react";
import { createClient } from "../lib/supabase/client";

export function useCommunityActivity() {
  const supabase = createClient();
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ── Load joined communities from DB on mount ──────────────────
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("community_joins")
        .select("community_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setJoinedIds(new Set(data.map((row: { community_id: string }) => row.community_id)));
      }

      setLoading(false);
    };

    init();
  }, []);

  // ── joinCommunity ─────────────────────────────────────────────
  // Call this when user clicks "Get Started" on a community card
  const joinCommunity = useCallback(async (communityId: string) => {
    if (!userId) return;

    // Optimistic update — update UI immediately
    setJoinedIds((prev) => new Set(prev).add(communityId));

    const { error } = await supabase
      .from("community_joins")
      .insert({ user_id: userId, community_id: communityId })
      .select()
      .maybeSingle(); // won't throw if already exists due to unique constraint

    if (error && error.code !== "23505") {
      // 23505 = unique violation (already joined) — that's fine, ignore it
      // For any other error, roll back the optimistic update
      console.error("Error joining community:", error.message);
      setJoinedIds((prev) => {
        const next = new Set(prev);
        next.delete(communityId);
        return next;
      });
    }
  }, [userId]);

  // ── leaveCommunity ────────────────────────────────────────────
  // Optional: if you ever want an "unjoin" button
  const leaveCommunity = useCallback(async (communityId: string) => {
    if (!userId) return;

    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(communityId);
      return next;
    });

    const { error } = await supabase
      .from("community_joins")
      .delete()
      .eq("user_id", userId)
      .eq("community_id", communityId);

    if (error) {
      console.error("Error leaving community:", error.message);
      // Roll back
      setJoinedIds((prev) => new Set(prev).add(communityId));
    }
  }, [userId]);

  return { joinedIds, loading, joinCommunity, leaveCommunity };
}