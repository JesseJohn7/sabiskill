"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { validateEmail } from "../utils/validateEmail";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  //Turns Supabase's confusing error codes into plain English 
  function getLoginErrorMessage(error: { message: string; code?: string }): string {
    const msg = error.message?.toLowerCase() || "";
    const code = error.code || "";

    if (
      msg.includes("over_email_send_rate_limit") ||
      msg.includes("email rate limit") ||
      code === "over_email_send_rate_limit"
    ) {
      return "Too many attempts — please wait a few minutes before trying again.";
    }
    if (msg.includes("invalid login credentials") || msg.includes("invalid credentials") || msg.includes("invalid password")) {
      return "Incorrect email or password. Please check and try again.";
    }
    if (msg.includes("email not confirmed")) {
      return "You haven't confirmed your email yet. Check your inbox for the confirmation link.";
    }
    if (msg.includes("user not found") || msg.includes("no user found")) {
      return "No account found with that email. Want to sign up instead?";
    }
    if (msg.includes("too many requests") || msg.includes("rate limit")) {
      return "Too many failed attempts. Please wait a few minutes before trying again.";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "Connection problem — please check your internet and try again.";
    }
    // Fallback: show something friendly instead of Supabase's raw error
    return "Something went wrong. Please try again.";
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ── Step 1: Validate email CLIENT-SIDE first (no Supabase call yet) ──
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return; // Stop here — don't waste an email send
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(), // trim spaces the user may have accidentally typed
      password,
    });

    if (error) {
      setError(getLoginErrorMessage(error));
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError("Could not connect to Google. Please try again.");
    setLoading(false);
  };

  const isNoAccount = error?.includes("No account found");

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col lg:flex-row">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes float4 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        .fade-1{animation:fadeUp 0.5s ease forwards}
        .fade-2{animation:fadeUp 0.5s 0.1s ease both}
        .fade-3{animation:fadeUp 0.5s 0.2s ease both}
        .fade-4{animation:fadeUp 0.5s 0.3s ease both}
        .fade-5{animation:fadeUp 0.5s 0.4s ease both}

        .float-1{animation:float 6s ease-in-out infinite}
        .float-2{animation:float2 5s ease-in-out infinite 0.5s}
        .float-3{animation:float3 7s ease-in-out infinite 1s}
        .float-4{animation:float4 4.5s ease-in-out infinite 1.5s}

        .gradient-text{
          background:linear-gradient(135deg,#60a5fa,#a78bfa,#34d399);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .glass{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.09);
          backdrop-filter:blur(12px);
        }

        .input-dark{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.09);
          color:white;
          transition:all 0.2s ease;
          width:100%;
        }
        .input-dark::placeholder{color:rgba(148,163,184,0.45)}
        .input-dark:focus{
          background:rgba(255,255,255,0.08);
          border-color:rgba(96,165,250,0.5);
          box-shadow:0 0 0 3px rgba(96,165,250,0.1);
          outline:none;
        }

        .btn-glow{
          background:linear-gradient(135deg,#1d4ed8,#3b82f6);
          transition:all 0.2s ease;
        }
        .btn-glow:hover{
          transform:translateY(-1px);
          box-shadow:0 8px 30px rgba(59,130,246,0.4);
        }
        .btn-glow:active{transform:translateY(0)}

        .google-btn{
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.1);
          transition:all 0.2s ease;
        }
        .google-btn:hover{
          background:rgba(255,255,255,0.09);
          border-color:rgba(255,255,255,0.18);
          transform:translateY(-1px);
        }

        .card-badge{
          background:rgba(15,20,40,0.85);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(16px);
        }

        .password-toggle{
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
        .password-toggle:hover{ color: rgba(148,163,184,1); }
      `}</style>

      {/* ── LEFT PANEL — Illustration ── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col"
        style={{ background: "linear-gradient(145deg, #0d1627 0%, #090d1a 50%, #0a0a0f 100%)" }}
      >
        <div className="absolute -top-30 -left-20 w-125 h-125 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-20 -right-15 w-100 h-100 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%)" }} />
        <div className="absolute top-[45%] right-[5%] w-62.5 h-62.5 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 65%)" }} />

        <div className="relative z-10 p-10 xl:p-14">
          <a href="/" className="text-2xl font-bold text-white tracking-tight">
            Sabi<span className="text-blue-400">skill</span>
          </a>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center px-10 xl:px-16 pb-10">
          <div className="relative w-full max-w-md">
            <div className="glass rounded-3xl p-5 xl:p-6 float-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <div className="flex-1 mx-3 h-5 rounded-md" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.3), rgba(139,92,246,0.3))", border: "1px solid rgba(96,165,250,0.2)" }}>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xs text-blue-300 font-semibold mb-1 uppercase tracking-wider">Continue Learning</div>
                        <div className="text-white font-bold text-base">Complete Web Development</div>
                        <div className="text-slate-400 text-xs mt-1">37 lessons · Beginner to Pro</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.2)" }}>
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <div className="h-1.5 rounded-full w-[65%]" style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }} />
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-slate-500 text-xs">Progress</span>
                      <span className="text-blue-400 text-xs font-semibold">65%</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "🎨", title: "UI/UX Design", lessons: "14 lessons", color: "rgba(236,72,153,0.15)", border: "rgba(236,72,153,0.2)" },
                    { icon: "📈", title: "Crypto & Web3", lessons: "8 lessons", color: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.2)" },
                  ].map((c, i) => (
                    <div key={i} className="rounded-2xl p-3.5" style={{ background: c.color, border: `1px solid ${c.border}` }}>
                      <div className="text-xl mb-2">{c.icon}</div>
                      <div className="text-white text-xs font-semibold leading-tight">{c.title}</div>
                      <div className="text-slate-500 text-xs mt-1">{c.lessons}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card-badge absolute -top-5 -right-5 xl:-right-8 rounded-2xl px-4 py-3 float-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white text-xs font-bold">Certificate Earned</div>
                  <div className="text-slate-500 text-xs">Web Development</div>
                </div>
              </div>
            </div>

            <div className="card-badge absolute -bottom-4 -left-5 xl:-left-8 rounded-2xl px-4 py-3 float-3">
              <div className="flex items-center gap-2.5">
                <div className="text-2xl">🔥</div>
                <div>
                  <div className="text-white text-xs font-bold">7 Day Streak</div>
                  <div className="text-slate-500 text-xs">Keep it up!</div>
                </div>
              </div>
            </div>

            <div className="card-badge absolute top-[45%] -left-6 xl:-left-10 rounded-2xl px-3 py-2.5 float-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-white text-xs font-semibold">2 Active courses</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-10 xl:px-14 pb-10">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
            Welcome back.<br />
            <span className="text-blue-400">Keep Learning.</span>
          </h2>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 py-10 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.04) 0%, transparent 60%)" }} />

        <div className="w-full max-w-100 relative z-10">
          <div className="lg:hidden text-center mb-7">
            <a href="/" className="text-2xl font-bold text-white tracking-tight">
              Sabi<span className="text-blue-400">skill</span>
            </a>
          </div>

          <div className="fade-1 mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to continue your learning journey.</p>
          </div>

          <div className="fade-2 mb-5">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="google-btn w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-200 disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="fade-2 relative flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
            <span className="text-slate-600 text-xs">or with email</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="fade-3">
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="you@example.com"
                required
                className="input-dark px-4 py-3.5 rounded-xl text-sm"
              />
            </div>

            <div className="fade-3">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="********"
                  required
                  className="input-dark px-4 py-3.5 pr-12 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="password-toggle absolute right-4 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-red-400 text-sm">{error}</p>
                  {isNoAccount && (
                    <a href="/signup" className="inline-block mt-1.5 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors">
                      → Create an account
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="fade-4 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="btn-glow w-full py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Logging in...
                  </span>
                ) : "Log In"}
              </button>
            </div>
          </form>

          <p className="fade-5 text-center text-sm text-slate-300 mt-5">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}