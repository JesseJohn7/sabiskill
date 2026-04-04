"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

// ── Step 1 Preview ────────────────────────────────────────────────────────────
const Step1Preview = () => (
  <div className="w-full rounded-2xl bg-[#0f1117] border border-white/10 p-5 select-none">
    <p className="text-center text-white/80 text-sm font-semibold mb-4">
      Create an Account
    </p>
    <button className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-lg py-2.5 text-xs text-white/60 hover:bg-white/10 transition-colors">
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Sign in with Google
    </button>
    <div className="flex items-center gap-2 my-3">
      <div className="flex-1 h-px bg-white/10" />
      <span className="text-[10px] text-white/30">or</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
    <div className="space-y-2.5">
      <div>
        <p className="text-[11px] text-white/40 mb-1">Email</p>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white/25">
          example@gmail.com
        </div>
      </div>
      <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white/25">
        Password
      </div>
    </div>
  </div>
);

// ── Step 2 Preview ────────────────────────────────────────────────────────────
const Step2Preview = () => {
  const courses = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect width="24" height="24" rx="4" fill="#E34F26"/>
          <path d="M5 3l1.5 17L12 22l5.5-2L19 3H5z" fill="#E34F26"/>
          <path d="M12 20.5l4.5-1.25 1.25-14H12v15.25z" fill="#EF652A"/>
          <path d="M12 13h-2.5l-.25-2.5H12V8H7l.75 8.5H12V13z" fill="white"/>
          <path d="M12 17.5v-2.5l2-.5.25-2.5H12V8h5l-.75 8.5L12 17.5z" fill="#EBEBEB"/>
        </svg>
      ),
      name: "Basic HTML 3",
      tag: "Beginner",
      tagClass: "bg-sky-500/20 text-sky-400",
      cat: "Code",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.032v-2.867s-.109-3.403 3.35-3.403h5.765s3.24.052 3.24-3.13V3.13S18.28 0 11.914 0zm-3.2 1.812a1.046 1.046 0 1 1 0 2.092 1.046 1.046 0 0 1 0-2.092z" fill="#366994"/>
          <path d="M12.086 24c6.096 0 5.716-2.656 5.716-2.656l-.007-2.752H12V17.766H20.1S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.032v2.867s.109 3.403-3.35 3.403H9.45s-3.24-.052-3.24 3.13v5.402S5.72 24 12.086 24zm3.2-1.812a1.046 1.046 0 1 1 0-2.092 1.046 1.046 0 0 1 0 2.092z" fill="#FFC331"/>
        </svg>
      ),
      name: "Python for Abs...",
      tag: "Expert",
      tagClass: "bg-orange-500/20 text-orange-400",
      cat: "Code",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      name: "Think Different:...",
      tag: "Expert",
      tagClass: "bg-orange-500/20 text-orange-400",
      cat: "Design",
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0f1117] border border-white/10 overflow-hidden select-none">
      {courses.map((c, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-4 py-3 ${i < courses.length - 1 ? "border-b border-white/[0.06]" : ""}`}
        >
          <span className="flex-shrink-0">{c.icon}</span>
          <span className="text-[12px] text-white/70 flex-1 truncate font-medium">{c.name}</span>
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${c.tagClass}`}>{c.tag}</span>
          <span className="text-[11px] text-white/35 w-12 text-right">{c.cat}</span>
          <svg className="w-4 h-4 text-white/25 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      ))}
    </div>
  );
};

// ── Step 3 Preview ────────────────────────────────────────────────────────────
const Step3Preview = () => {
  const groups = [
    {
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      name: "Apple Designer",
      members: "48 Members",
      iconBg: "bg-white/10",
    },
    {
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      name: "Facebook Developer",
      members: "54 Members",
      iconBg: "bg-blue-500/10",
    },
    {
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#DA291C">
          <path d="M4.5 3C4.5 3 3 3 3 6v12h2.5V6.5S5.5 5 6.5 5s1 1.5 1 1.5V18H10V6.5S10 5 11 5s1 1.5 1 1.5V18h2.5V6.5S13.5 5 14.5 5s1 1.5 1 1.5V18H18.5V6c0-3-1.5-3-1.5-3s-1.5 0-2.5 1.5C13.5 3 12.5 3 12 3s-1.5 0-2.5 1.5C8.5 3 7.5 3 6.5 3S4.5 3 4.5 3z"/>
        </svg>
      ),
      name: "Mcd Web Design",
      members: "40 Members",
      iconBg: "bg-red-500/10",
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0f1117] border border-white/10 overflow-hidden select-none space-y-2 p-3">
      {groups.map((g, i) => (
        <div key={i} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${g.iconBg}`}>
            {g.logo}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/80 truncate">{g.name}</p>
            <p className="text-[10px] text-white/35">{g.members}</p>
          </div>
          <svg className="w-4 h-4 text-white/25 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      ))}
    </div>
  );
};

// ── Data ──────────────────────────────────────────────────────────────────────
const steps = [
  {
    badge: "Step 1",
    badgeActive: false,
    title: "Create Your Account",
    description: "Quickly sign up with your email or Google for a personalized learning journey.",
    preview: <Step1Preview />,
  },
  {
    badge: "Step 2",
    badgeActive: true,
    title: "Choose Your Course",
    description: "Browse through a variety of expert-led courses and pick the one that best fits your learning goals.",
    preview: <Step2Preview />,
  },
  {
    badge: "Step 3",
    badgeActive: false,
    title: "Join the Community",
    description: "Join study groups, connect, and collaborate for an enhanced learning experience.",
    preview: <Step3Preview />,
  },
];

// ── Variants ──────────────────────────────────────────────────────────────────
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────
const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="relative bg-[#09090b] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[320px] rounded-full bg-blue-600/10 blur-[100px]" />

      {/* Header */}
      <motion.div
        className="relative max-w-2xl mx-auto text-center mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-blue-400/70 mb-3">
          How It Works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
          Three steps to start learning
        </h2>
        <p className="text-sm sm:text-base text-white/40 leading-relaxed">
          Getting started with SabiSkill is easy. Pick a track, learn at your
          pace, and grow your skills through guided practice.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="group relative flex flex-col bg-[#111114] border border-white/[0.07] rounded-3xl p-5 hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1"
          >
            {/* Hover glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(320px circle at 50% 0%, rgba(59,130,246,0.07), transparent 70%)",
              }}
            />

            {/* Preview */}
            <div className="relative mb-5">{step.preview}</div>

            {/* Badge */}
            <span
              className={`self-start text-[11px] font-bold px-4 py-1.5 rounded-full mb-3 ${
                step.badgeActive
                  ? "bg-blue-500 text-white"
                  : "bg-white/5 border border-white/10 text-white/50"
              }`}
            >
              {step.badge}
            </span>

            {/* Text */}
            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {step.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="relative mt-12 flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
      >
        <a
         href="/signup"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 active:scale-95 text-white font-bold text-sm px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-blue-500/25"
        >
        
          Get Started
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default HowItWorks;