"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Supabase fires PASSWORD_RECOVERY when the reset link token is valid
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    // If no event fires after 3s, the link is likely expired or invalid
    const timeout = setTimeout(() => {
      if (!ready) setInvalidLink(true);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleReset = async () => {
    setError(null);

    if (!password) {
      setError("Please enter a new password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      if (error.message?.toLowerCase().includes("same password")) {
        setError("That's your current password — please choose a new one.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .fade-in { animation: fadeUp 0.5s ease forwards; }
        .fade-2  { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-3  { animation: fadeUp 0.5s 0.2s ease both; }
        .fade-4  { animation: fadeUp 0.5s 0.3s ease both; }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .input-dark {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: white;
          transition: all 0.2s ease;
          width: 100%;
        }
        .input-dark::placeholder { color: rgba(148,163,184,0.45); }
        .input-dark:focus {
          background: rgba(255,255,255,0.08);
          border-color: rgba(96,165,250,0.5);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.1);
          outline: none;
        }

        .btn-glow {
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          transition: all 0.2s ease;
        }
        .btn-glow:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(59,130,246,0.4);
        }
        .btn-glow:active { transform: translateY(0); }

        .password-toggle {
          color: rgba(148,163,184,0.6);
          transition: color 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .password-toggle:hover { color: rgba(148,163,184,1); }

        .card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
        }

        .spinner { animation: spin 0.8s linear infinite; }
        .dot-pulse { animation: pulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.06) 0%, transparent 60%)" }} />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="fade-in text-center mb-8">
          <a href="/" className="text-2xl font-bold text-white tracking-tight">
            Sabi<span className="text-blue-400">skill</span>
          </a>
        </div>

        <div className="card rounded-2xl p-7">
          {/* ── Invalid / expired link ── */}
          {invalidLink && !ready && (
            <div className="fade-in text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Link expired</h2>
              <p className="text-slate-500 text-sm mb-5">
                This reset link is invalid or has expired. Request a new one from the login page.
              </p>
              <a
                href="/login"
                className="btn-glow inline-block w-full py-3 rounded-xl text-white text-sm font-semibold text-center"
              >
                Back to Login
              </a>
            </div>
          )}

          {/* ── Verifying token ── */}
          {!ready && !invalidLink && (
            <div className="fade-in text-center py-4">
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                <svg className="spinner w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Verifying reset link...
              </div>
            </div>
          )}

          {/* ── Success state ── */}
          {success && (
            <div className="fade-in text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white font-bold text-lg mb-2">Password updated!</h2>
              <p className="text-slate-500 text-sm">
                Redirecting you to your dashboard...
              </p>
            </div>
          )}

          {/* ── Reset form ── */}
          {ready && !success && (
            <>
              <div className="fade-in mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Set new password</h2>
                <p className="text-slate-500 text-sm">Must be at least 6 characters.</p>
              </div>

              <div className="space-y-4">
                {/* New password */}
                <div className="fade-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null); }}
                      placeholder="••••••••"
                      className="input-dark px-4 py-3.5 pr-12 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="password-toggle absolute right-4 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="fade-3">
                  <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                      placeholder="••••••••"
                      className="input-dark px-4 py-3.5 pr-12 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="password-toggle absolute right-4 top-1/2 -translate-y-1/2"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Inline match indicator */}
                  {confirm.length > 0 && (
                    <p className={`text-xs mt-1.5 ${password === confirm ? "text-emerald-400" : "text-red-400"}`}>
                      {password === confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="fade-4 pt-1">
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="btn-glow w-full py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="spinner w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Updating...
                      </span>
                    ) : "Update Password"}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-600 pt-1">
                  Remembered it?{" "}
                  <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                    Back to login
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}