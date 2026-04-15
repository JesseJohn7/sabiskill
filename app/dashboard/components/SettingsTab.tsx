"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/app/lib/supabase/client";

interface SettingsTabProps {
  onNameChange?: (newName: string) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onNameChange }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const emailAddr = user.email ?? "";
      setEmail(emailAddr);

      const providerAvatar =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;
      setAvatarUrl(providerAvatar);

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
    };
    load();
  }, []);

  useEffect(() => {
    if (editingName) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editingName]);

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
      onNameChange?.(trimmed);
      setTimeout(() => setSaveState("idle"), 3500);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3500);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const showPhoto = Boolean(avatarUrl) && !imgError;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4">

        {/* Page heading */}
        <div className="pb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* ── Profile card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

          {/* Blue banner */}
          <div className="relative h-24 sm:h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 dark:from-blue-900 dark:via-blue-800 dark:to-slate-800 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 60%, rgba(255,255,255,0.18) 0%, transparent 55%), " +
                  "radial-gradient(circle at 85% 25%, rgba(255,255,255,0.12) 0%, transparent 45%)",
              }}
            />
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 36"
              preserveAspectRatio="none"
              fill="white"
            >
              <path d="M0,36 C480,0 960,36 1440,12 L1440,36 Z" />
            </svg>
          </div>

          {/* Avatar + identity */}
          <div className="px-5 sm:px-7 pb-6">
            {/* Avatar row — pulled up to overlap the banner */}
            <div className="flex items-end gap-4 -mt-10 sm:-mt-11 mb-5">
              {/* Avatar wrapper */}
              <div className="relative flex-shrink-0 group cursor-pointer">
                {showPhoto ? (
                  <>
                    <img
                      src={avatarUrl as string}
                      alt={name}
                      onError={() => setImgError(true)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border-4 border-white shadow-xl"
                    />
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-4 border-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                      <CameraIcon className="w-6 h-6 text-white drop-shadow" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-800 dark:to-blue-900 border-4 border-white dark:border-slate-800 shadow-xl dark:shadow-blue-950/50 flex items-center justify-center select-none">
                      <span className="text-white dark:text-slate-100 text-2xl sm:text-3xl font-black leading-none">
                        {initials}
                      </span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-4 border-white bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                      <CameraIcon className="w-6 h-6 text-white drop-shadow" />
                    </div>
                  </>
                )}
                {/* Online dot */}
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
              </div>

              {/* Name + email beside avatar */}
              <div className="min-w-0 pb-1">
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">
                  {name || "—"}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {email || "—"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 dark:bg-slate-800 mb-5" />

            {/* Display name field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Display Name
                </label>
                {!editingName && (
                  <button
                    onClick={() => {
                      setEditingName(true);
                      setNameInput(name);
                      setSaveState("idle");
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <PencilIcon className="w-3 h-3" />
                    Edit
                  </button>
                )}
              </div>

              {editingName ? (
                <div className="space-y-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") {
                        setEditingName(false);
                        setNameInput(name);
                      }
                    }}
                    placeholder="Enter your display name"
                    className="w-full text-sm font-medium text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent dark:focus:bg-slate-700 focus:bg-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <div className="flex gap-2.5">
                    <button
                      onClick={handleSaveName}
                      disabled={saveState === "saving" || !nameInput.trim()}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white dark:text-slate-100 text-sm font-semibold rounded-xl transition-colors active:scale-[0.98]"
                    >
                      {saveState === "saving" ? (
                        <>
                          <SpinnerIcon />
                          Saving…
                        </>
                      ) : (
                        <>
                          <CheckIcon className="w-3.5 h-3.5" />
                          Save changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNameInput(name);
                      }}
                      className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 min-h-[2.5rem]">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{name || "—"}</p>
                  {saveState === "saved" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-full">
                      <CheckIcon className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                  {saveState === "error" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded-full">
                      Failed to save
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Email card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="px-5 sm:px-7 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                  <MailIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                    Email address
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {email || "—"}
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-full tracking-wide">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* ── Account actions card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">

          {/* Sign out */}
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center gap-4 px-5 sm:px-7 py-4 sm:py-5 text-left hover:bg-red-50 dark:hover:bg-red-950/20 active:bg-red-100 dark:active:bg-red-950/40 transition-colors group disabled:opacity-60"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/30 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 flex items-center justify-center flex-shrink-0 transition-colors">
              {logoutLoading ? (
                <SpinnerIcon className="text-red-400 dark:text-red-500" />
              ) : (
                <LogoutIcon className="w-5 h-5 text-red-500 dark:text-red-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {logoutLoading ? "Signing out…" : "Sign out"}
              </p>
              <p className="text-xs text-red-400 dark:text-red-500 mt-0.5">
                Log out of your account on this device
              </p>
            </div>
            <ChevronIcon className="w-4 h-4 text-red-300 dark:text-red-900/60 group-hover:text-red-400 dark:group-hover:text-red-700/80 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </button>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-3 pt-2 pb-4 flex-wrap">
          <a href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
            Privacy Policy
          </a>
          <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
          <a href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
            Terms of Service
          </a>
          <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
          <a href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
            Help
          </a>
        </div>

      </div>
    </div>
  );
};

/* ── Icon components ──────────────────────────────────────────────────── */

const SpinnerIcon = ({ className }: { className?: string }) => (
  <span
    className={`w-4 h-4 border-2 border-current dark:border-current border-t-transparent rounded-full animate-spin inline-block opacity-70 ${className ?? ""}`}
  />
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default SettingsTab;