"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase/client";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { validateEmail } from "../utils/validateEmail";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getForgotPasswordErrorMessage = (error: { message: string; code?: string }): string => {
    const msg = error.message?.toLowerCase() || "";
    const code = error.code || "";

    if (
      msg.includes("over_email_send_rate_limit") ||
      msg.includes("email rate limit") ||
      code === "over_email_send_rate_limit"
    ) {
      return "Too many reset attempts — please wait a few minutes before trying again.";
    }
    if (msg.includes("unable to validate email") || msg.includes("invalid email")) {
      return "That email address doesn't look right. Please double-check and try again.";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "Connection problem — please check your internet and try again.";
    }
    return "Something went wrong. Please try again.";
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(getForgotPasswordErrorMessage(error));
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(getForgotPasswordErrorMessage({ message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle size={48} className="text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>

          <p className="text-slate-400 mb-6">
            We've sent a password reset link to <span className="font-semibold text-white">{email}</span>
          </p>

          <p className="text-slate-500 text-sm mb-8">
            The link will expire in 1 hour. If you don't see the email, check your spam folder.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} />
            Back to login
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Reset your password</h1>
          <p className="text-slate-400">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleForgotPassword} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors mt-6"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Sign up link */}
          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
