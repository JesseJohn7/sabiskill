"use client";

import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────────────
   LOGOS — faithful SVG recreations of each brand's visual identity
───────────────────────────────────────────────────────────────── */

// roadmap.sh — red road-pin dot + wordmark in their actual font style
const RoadmapLogo = () => (
  <svg viewBox="0 0 130 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    {/* Map pin */}
    <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 13 6 13s6-8.5 6-13c0-3.31-2.69-6-6-6z" fill="#EF4444"/>
    <circle cx="10" cy="8" r="2.5" fill="white"/>
    {/* Wordmark */}
    <text x="22" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill="#1a1a1a" letterSpacing="-0.3">roadmap</text>
    <text x="94" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill="#EF4444" letterSpacing="-0.3">.sh</text>
  </svg>
);

// Aceternity UI — their actual "A" monogram style + wordmark
const AcernityLogo = () => (
  <svg viewBox="0 0 128 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    {/* "A" lettermark in a dark rounded square */}
    <rect width="22" height="22" rx="5" fill="#0f0f0f" y="1"/>
    <path d="M11 5L16.5 18H13.8L12.6 15H9.4L8.2 18H5.5L11 5ZM11 8.5L10.2 13H11.8L11 8.5Z" fill="white"/>
    {/* Wordmark */}
    <text x="27" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#0f0f0f" letterSpacing="-0.2">Aceternity</text>
    <text x="97" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12" fontWeight="400" fill="#6b7280" letterSpacing="-0.2"> UI</text>
  </svg>
);

// shadcn/ui — their exact diagonal-slash logo
const ShadcnLogo = () => (
  <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    {/* Exact shadcn logo: two lines forming their icon */}
    <line x1="3" y1="20" x2="19" y2="4" stroke="#09090b" strokeWidth="2.8" strokeLinecap="round"/>
    <line x1="11" y1="20" x2="19" y2="20" stroke="#09090b" strokeWidth="2.8" strokeLinecap="round"/>
    {/* Wordmark */}
    <text x="25" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill="#09090b" letterSpacing="-0.3">shadcn/ui</text>
  </svg>
);

// PrebuiltUI — grid of 4 squares like their actual mark
const PrebuiltLogo = () => (
  <svg viewBox="0 0 112 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    <rect x="1" y="1" width="10" height="10" rx="2.5" fill="#6366f1"/>
    <rect x="13" y="1" width="10" height="10" rx="2.5" fill="#6366f1" opacity="0.4"/>
    <rect x="1" y="13" width="10" height="10" rx="2.5" fill="#6366f1" opacity="0.4"/>
    <rect x="13" y="13" width="10" height="10" rx="2.5" fill="#6366f1"/>
    <text x="28" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill="#111" letterSpacing="-0.3">Prebuilt</text>
    <text x="79" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="12.5" fontWeight="700" fill="#6366f1" letterSpacing="-0.3">UI</text>
  </svg>
);

// HNG — use their actual hosted SVG logo
const HNGLogo = () => (
  <img
    src="https://images.hng.tech/logo.svg"
    alt="HNG Internship"
    className="h-5 w-auto object-contain"
    onError={(e) => {
      const el = e.target as HTMLImageElement;
      el.style.display = "none";
    }}
  />
);

// Frontend Mentor — stylised "FM" bracket mark + wordmark
const FrontendMentorLogo = () => (
  <svg viewBox="0 0 152 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
    {/* Bracket / chevron mark */}
    <path d="M4 4L12 12L4 20" stroke="#3F54A3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12H20" stroke="#3F54A3" strokeWidth="3" strokeLinecap="round"/>
    {/* Wordmark */}
    <text x="26" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="11.5" fontWeight="700" fill="#1e2d6e" letterSpacing="-0.2">Frontend</text>
    <text x="84" y="17" fontFamily="'Segoe UI', system-ui, sans-serif" fontSize="11.5" fontWeight="700" fill="#3F54A3" letterSpacing="-0.2"> Mentor</text>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const resources = [
  {
    name: "roadmap.sh",
    url: "https://roadmap.sh",
    tagline: "Know exactly what to learn next",
    description:
      "Community-built interactive roadmaps for Frontend, Backend, DevOps, AI and 50+ more career paths. Always up to date.",
    Logo: RoadmapLogo,
    accent: "#EF4444",
    tag: "Free",
    tagColors: { bg: "#fef2f2", text: "#dc2626" },
    chips: ["50+ Roadmaps", "2.8M Users", "350K ★"],
  },
  {
    name: "Aceternity UI",
    url: "https://ui.aceternity.com",
    tagline: "Animated React components, copy-paste ready",
    description:
      "200+ stunning components with Tailwind CSS & Framer Motion — 3D cards, aurora backgrounds, spotlight effects and more.",
    Logo: AcernityLogo,
    accent: "#0f0f0f",
    tag: "Free + Pro",
    tagColors: { bg: "#f3f4f6", text: "#374151" },
    chips: ["200+ Components", "Framer Motion", "Next.js"],
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com",
    tagline: "Accessible components you own completely",
    description:
      "Copy components into your repo. Built on Radix UI primitives — fully typed, accessible, and styled with Tailwind.",
    Logo: ShadcnLogo,
    accent: "#09090b",
    tag: "Free",
    tagColors: { bg: "#f4f4f5", text: "#3f3f46" },
    chips: ["Radix Primitives", "TypeScript", "A11y"],
  },
  {
    name: "PrebuiltUI",
    url: "https://prebuiltui.com",
    tagline: "390+ Tailwind sections, just paste and ship",
    description:
      "Open-source collection of hero blocks, dashboards, navbars, and cards. Pure Tailwind — no install needed.",
    Logo: PrebuiltLogo,
    accent: "#6366f1",
    tag: "Open Source",
    tagColors: { bg: "#eef2ff", text: "#4f46e5" },
    chips: ["390+ Components", "Dark Mode", "MIT"],
  },
  {
    name: "HNG Internship",
    url: "https://hng.tech/internship",
    tagline: "Ship real products. Get hired globally.",
    description:
      "8-week remote bootcamp — build production apps in teams, get mentored by pros, and land roles at international companies.",
    Logo: HNGLogo,
    accent: "#f97316",
    tag: "Free to Join",
    tagColors: { bg: "#fff7ed", text: "#c2410c" },
    chips: ["3K+ Finalists", "21+ Countries", "Job Placement"],
  },
  {
    name: "Frontend Mentor",
    url: "https://www.frontendmentor.io",
    tagline: "Build real projects. Impress employers.",
    description:
      "100+ professionally designed challenges that mirror real dev work — from HTML/CSS basics to full-stack apps. Submit, get feedback, grow your portfolio.",
    Logo: FrontendMentorLogo,
    accent: "#3F54A3",
    tag: "Free + Pro",
    tagColors: { bg: "#eef0fb", text: "#3F54A3" },
    chips: ["1.1M+ Devs", "100+ Challenges", "AI Feedback"],
  },
];

/* ─────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────── */
export default function ResourcesTab() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-1">
          Resources
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">
          Curated tools &amp; platforms for developers
        </p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {resources.map((res, i) => {
          const active = hovered === i;
          const { Logo } = res;
          return (
            <div
              key={res.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900"
              style={{
                border: `1.5px solid ${active ? res.accent : "#e5e7eb"} ${active ? "" : "dark:#1e293b"}`,
                boxShadow: active
                  ? `0 8px 24px -6px ${res.accent}35`
                  : "0 1px 4px rgba(0,0,0,0.05), 0 0px 0px rgba(0,0,0,0.02) inset",
                transform: active ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.18s ease",
              }}
            >
              {/* Accent stripe */}
              <div style={{ height: "2.5px", background: res.accent }} />

              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Row: Logo + badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center min-h-[20px]">
                    <Logo />
                  </div>
                  <span
                    className="text-[9.5px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
                    style={{
                      background: res.tagColors.bg,
                      color: res.tagColors.text,
                    }}
                  >
                    {res.tag}
                  </span>
                </div>

                {/* Tagline */}
                <p
                  className="text-[10.5px] font-bold leading-snug"
                  style={{ color: res.accent }}
                >
                  {res.tagline}
                </p>

                {/* Description */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {res.description}
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-1">
                  {res.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[10.5px] font-bold text-white dark:text-slate-900 transition-opacity duration-150"
                  style={{
                    background: res.accent,
                    opacity: active ? 0.88 : 1,
                  }}
                >
                  Visit {res.name}
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                  </svg>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}