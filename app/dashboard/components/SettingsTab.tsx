"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";

interface SettingsTabProps {
  onNameChange?: (newName: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onNameChange }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);

  // ── Load user from Supabase ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const emailAddr = user.email ?? "";
        setEmail(emailAddr);

        // Derive display name: metadata first, then email prefix
        const metaName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        if (metaName) {
          setName(metaName);
          setNameInput(metaName);
        } else if (emailAddr) {
          const derived = emailAddr
            .split("@")[0]
            .replace(/[._\-0-9]+/g, " ")
            .trim()
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          setName(derived);
          setNameInput(derived);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  // ── Save updated name to Supabase user_metadata ──────────────────────
  const handleSaveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === name) {
      setEditingName(false);
      return;
    }
    setSaveState("saving");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: trimmed, name: trimmed },
      });
      if (error) throw error;
      setName(trimmed);
      setEditingName(false);
      setSaveState("saved");
      onNameChange?.(trimmed); // 🔑 lift up to parent → updates HomeTab greeting
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2500);
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // ── Delete account ───────────────────────────────────────────────────
  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      const supabase = createClient();
      // Calls your API route that uses the service role to delete the user
      await fetch("/api/delete-account", { method: "DELETE" });
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch {
      // handle error silently or show toast
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-1">
            Settings
          </h2>
          <p className="text-sm text-slate-500">Manage your profile and account.</p>
        </div>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-4">

          {/* Avatar + identity */}
          <div className="flex items-center gap-4 px-5 py-5 border-b border-slate-100">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-black shadow-md select-none flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base text-slate-900 truncate">{name}</p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{email}</p>
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="px-5 py-4 border-b border-slate-100">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Email
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-slate-500 truncate">{email}</span>
              <span className="ml-auto flex-shrink-0 text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                Fixed
              </span>
            </div>
          </div>

          {/* Display Name (editable) */}
          <div className="px-5 py-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
              Display Name
            </label>

            {editingName ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") { setEditingName(false); setNameInput(name); }
                  }}
                  className="flex-1 text-sm font-medium rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  onClick={handleSaveName}
                  disabled={saveState === "saving"}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 active:scale-95 text-white text-sm font-bold transition-all shadow-sm"
                >
                  {saveState === "saving" ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  ) : "Save"}
                </button>
                <button
                  onClick={() => { setEditingName(false); setNameInput(name); }}
                  className="px-3 py-2.5 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-800 truncate">{name}</span>
                <button
                  onClick={() => { setEditingName(true); setNameInput(name); }}
                  className="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-all active:scale-95"
                >
                  Edit
                </button>
              </div>
            )}

            {/* Status messages */}
            {saveState === "saved" && (
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Name updated — greeting will reflect this
              </p>
            )}
            {saveState === "error" && (
              <p className="text-xs text-red-500 font-semibold mt-2">
                Failed to save. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* ── Actions Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

          {/* Log Out */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 group hover:bg-slate-50 active:opacity-70 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">Log Out</p>
                <p className="text-xs text-slate-500">Sign out of your account</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between px-5 py-4 group hover:bg-red-50/60 active:opacity-70 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-red-500">Delete Account</p>
                <p className="text-xs text-slate-500">Permanently remove all your data</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">v2.4.1 · © 2026</p>
      </div>

      {/* ── Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
          />
          <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="w-10 h-1 rounded-full bg-slate-200 mx-auto mb-5 sm:hidden" />
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">Delete Account?</h3>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed">
              This cannot be undone. All your data will be permanently deleted.{" "}
              Type <span className="font-bold text-slate-900">DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full text-sm rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white mb-4 transition-all"
            />
            <div className="flex gap-2.5">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirm !== "DELETE"}
                className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;