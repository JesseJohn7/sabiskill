"use client";

import React, { useState } from "react";

type Theme = "light" | "dark";

interface SettingsTabProps {
  onThemeChange?: (theme: Theme) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ onThemeChange }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [name, setName] = useState("Alex Johnson");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [saved, setSaved] = useState(false);

  const dark = theme === "dark";

  const handleTheme = (t: Theme) => {
    setTheme(t);
    onThemeChange?.(t);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      setEditingName(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const bg = dark ? "bg-[#0f1117]" : "bg-[#f5f5f3]";
  const card = dark ? "bg-[#1a1d27] border-white/[0.06]" : "bg-white border-slate-200/80";
  const heading = dark ? "text-white" : "text-slate-900";
  const sub = dark ? "text-slate-400" : "text-slate-500";
  const inputBg = dark
    ? "bg-[#12151e] border-white/10 text-white placeholder:text-slate-500"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400";
  const divider = dark ? "border-white/[0.06]" : "border-slate-100";
  const labelText = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen w-full ${bg} transition-colors duration-300 p-4 sm:p-8`}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight mb-1 ${heading}`}>
            Settings
          </h2>
          <p className={`text-sm ${sub}`}>Manage your profile and preferences.</p>
        </div>

        {/* Profile + Name + Theme Card */}
        <div className={`rounded-2xl border ${card} overflow-hidden mb-4 shadow-sm`}>

          {/* Avatar row */}
          <div className={`flex items-center gap-4 px-5 py-5 border-b ${divider}`}>
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 via-violet-500 to-pink-500 flex items-center justify-center text-white text-xl font-black shadow-lg select-none">
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="min-w-0">
              <p className={`font-bold text-base truncate ${heading}`}>{name}</p>
              <p className={`text-xs mt-0.5 ${sub}`}>Hover avatar to change photo</p>
            </div>
          </div>

          {/* Name */}
          <div className={`px-5 py-4 border-b ${divider}`}>
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2.5 ${labelText}`}>
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
                  className={`flex-1 text-sm font-medium rounded-xl border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${inputBg}`}
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-bold transition-all shadow-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => { setEditingName(false); setNameInput(name); }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${dark ? "bg-white/10 hover:bg-white/15 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-semibold truncate ${heading}`}>{name}</span>
                <button
                  onClick={() => { setEditingName(true); setNameInput(name); }}
                  className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 ${dark ? "text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20" : "text-indigo-600 bg-indigo-50 hover:bg-indigo-100"}`}
                >
                  Edit
                </button>
              </div>
            )}
            {saved && (
              <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Name updated
              </p>
            )}
          </div>

          {/* Theme */}
          <div className="px-5 py-4">
            <label className={`block text-[10px] font-bold uppercase tracking-widest mb-3 ${labelText}`}>
              Dashboard Theme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(["light", "dark"] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTheme(t)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all font-semibold text-sm active:scale-[0.97] ${
                    theme === t
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-500"
                      : dark
                      ? "border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[0.03]"
                      : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-lg">{t === "light" ? "☀️" : "🌙"}</span>
                  <span className="capitalize">{t}</span>
                  {theme === t && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className={`rounded-2xl border ${card} overflow-hidden shadow-sm`}>

          {/* Log Out */}
          <button className={`w-full flex items-center justify-between px-5 py-4 border-b ${divider} group transition-colors ${dark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"} active:opacity-70`}>
            <div className="flex items-center gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${dark ? "bg-white/[0.07]" : "bg-slate-100"}`}>
                <svg className={`w-4 h-4 ${sub}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${heading}`}>Log Out</p>
                <p className={`text-xs ${sub}`}>Sign out of your account</p>
              </div>
            </div>
            <svg className={`w-4 h-4 ${sub} group-hover:translate-x-0.5 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Delete Account */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className={`w-full flex items-center justify-between px-5 py-4 group transition-colors ${dark ? "hover:bg-red-500/5" : "hover:bg-red-50/60"} active:opacity-70`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-red-500">Delete Account</p>
                <p className={`text-xs ${sub}`}>Permanently remove all your data</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className={`text-center text-xs mt-6 ${sub}`}>v2.4.1 · © 2026</p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
          />
          <div className={`relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl border shadow-2xl p-6 sm:p-6 ${dark ? "bg-[#1a1d27] border-white/10" : "bg-white border-slate-200"}`}>
            {/* Drag handle on mobile */}
            <div className={`w-10 h-1 rounded-full mx-auto mb-5 sm:hidden ${dark ? "bg-white/20" : "bg-slate-200"}`} />

            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className={`text-lg font-black mb-1.5 ${heading}`}>Delete Account?</h3>
            <p className={`text-sm mb-5 leading-relaxed ${sub}`}>
              This cannot be undone. All your data will be permanently deleted. Type{" "}
              <span className={`font-bold ${heading}`}>DELETE</span> to confirm.
            </p>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className={`w-full text-sm rounded-xl border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4 transition-all ${inputBg}`}
            />
            <div className="flex gap-2.5">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${dark ? "bg-white/10 hover:bg-white/15 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
              >
                Cancel
              </button>
              <button
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