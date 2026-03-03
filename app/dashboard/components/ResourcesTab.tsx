"use client";

import React, { useState } from "react";

/* ── Logos ─────────────────────────────────────────────────────── */

const RoadmapLogo = () => (
  <svg viewBox="0 0 96 22" fill="none" className="h-5 w-auto">
    <circle cx="11" cy="11" r="9" stroke="#ef4444" strokeWidth="2" />
    <circle cx="11" cy="11" r="3.5" fill="#ef4444" />
    <text x="25" y="15.5" fill="#111827" fontSize="11.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="-0.4">roadmap.sh</text>
  </svg>
);

const AcernityLogo = () => (
  <svg viewBox="0 0 100 22" fill="none" className="h-5 w-auto">
    <circle cx="11" cy="11" r="9" fill="#111827" />
    <circle cx="11" cy="11" r="5" fill="#374151" />
    <circle cx="11" cy="11" r="2.5" fill="white" />
    <text x="25" y="15.5" fill="#111827" fontSize="11.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="-0.4">Aceternity UI</text>
  </svg>
);

const ShadcnLogo = () => (
  <svg viewBox="0 0 80 22" fill="none" className="h-5 w-auto">
    <rect x="1" y="1" width="20" height="20" rx="5" fill="#09090b" />
    <line x1="7" y1="15" x2="15" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="7" y1="7" x2="11" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <line x1="11" y1="15" x2="15" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <text x="26" y="15.5" fill="#111827" fontSize="11.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="-0.4">shadcn/ui</text>
  </svg>
);

const PrebuiltLogo = () => (
  <svg viewBox="0 0 86 22" fill="none" className="h-5 w-auto">
    <rect x="1" y="1" width="20" height="20" rx="5" fill="#6366f1" />
    <rect x="5" y="5" width="5" height="5" rx="1" fill="white" opacity="0.9" />
    <rect x="12" y="5" width="5" height="5" rx="1" fill="white" opacity="0.5" />
    <rect x="5" y="12" width="5" height="5" rx="1" fill="white" opacity="0.5" />
    <rect x="12" y="12" width="5" height="5" rx="1" fill="white" opacity="0.9" />
    <text x="26" y="15.5" fill="#111827" fontSize="11.5" fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="-0.4">PrebuiltUI</text>
  </svg>
);

const HNGLogo = () => (
  <img
    src="https://images.hng.tech/logo.svg"
    alt="HNG"
    className="h-5 w-auto"
    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
  />
);

/* ── Data ───────────────────────────────────────────────────────── */

const resources = [
  {
    name: "roadmap.sh",
    url: "https://roadmap.sh",
    tagline: "Know exactly what to learn next",
    description: "Community-built roadmaps for Frontend, Backend, DevOps, AI and 50+ more paths. Interactive, structured, and always up to date.",
    Logo: RoadmapLogo,
    accent: "#ef4444",
    tag: "Free",
    stats: ["50+ Roadmaps", "2.8M Users", "350K ★ GitHub"],
  },
  {
    name: "Aceternity UI",
    url: "https://ui.aceternity.com",
    tagline: "Stunning animated React components",
    description: "200+ copy-paste components powered by Tailwind CSS and Framer Motion — 3D cards, aurora effects, spotlight animations, and more.",
    Logo: AcernityLogo,
    accent: "#111827",
    tag: "Free + Pro",
    stats: ["200+ Components", "Framer Motion", "Next.js Ready"],
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com",
    tagline: "Accessible components you own outright",
    description: "Copy components directly into your codebase. Built on Radix UI primitives, fully type-safe, and customizable to any design system.",
    Logo: ShadcnLogo,
    accent: "#09090b",
    tag: "Free",
    stats: ["Radix Primitives", "TypeScript", "Fully Accessible"],
  },
  {
    name: "PrebuiltUI",
    url: "https://prebuiltui.com",
    tagline: "390+ Tailwind components, copy-paste ready",
    description: "Open-source Tailwind CSS components and page sections — hero blocks, dashboards, cards, navbars. No install, just paste and ship.",
    Logo: PrebuiltLogo,
    accent: "#6366f1",
    tag: "Open Source",
    stats: ["390+ Components", "Dark Mode", "Free Forever"],
  },
  {
    name: "HNG Internship",
    url: "https://hng.tech/internship",
    tagline: "Ship real products. Get hired.",
    description: "8-week remote bootcamp where you build production apps in teams, get mentored by pros, and connect to job opportunities at global companies.",
    Logo: HNGLogo,
    accent: "#f97316",
    tag: "Free to Join",
    stats: ["3K+ Finalists", "21+ Countries", "Job Placement"],
  },
];

/* ── Tag color helpers ──────────────────────────────────────────── */
const tagStyles: Record<string, { bg: string; color: string }> = {
  "Free":        { bg: "#dcfce7", color: "#15803d" },
  "Free + Pro":  { bg: "#f3f4f6", color: "#374151" },
  "Open Source": { bg: "#ede9fe", color: "#6d28d9" },
  "Free to Join":{ bg: "#fff7ed", color: "#c2410c" },
};

/* ── ExternalIcon ───────────────────────────────────────────────── */
const ExternalIcon = () => (
  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

/* ── Component ──────────────────────────────────────────────────── */
const ResourcesTab: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-black text-slate-900 mb-2">Resources</h2>
      <p className="text-slate-400 text-sm mb-8">
        Curated tools and platforms for modern developers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {resources.map((res, i) => {
          const isHovered = hovered === i;
          const { Logo } = res;
          const ts = tagStyles[res.tag] ?? { bg: "#f3f4f6", color: "#374151" };

          return (
            <div
              key={res.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col rounded-xl overflow-hidden transition-all duration-250"
              style={{
                border: `1.5px solid ${isHovered ? res.accent : "#e5e7eb"}`,
                boxShadow: isHovered
                  ? `0 8px 28px -6px ${res.accent}28`
                  : "0 1px 4px rgba(0,0,0,0.04)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* Accent top bar */}
              <div className="h-[3px]" style={{ background: res.accent }} />

              <div className="p-4 flex flex-col gap-3 flex-1">
                {/* Logo row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center h-8">
                    <Logo />
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: ts.bg, color: ts.color }}
                  >
                    {res.tag}
                  </span>
                </div>

                {/* Tagline */}
                <div>
                  <p className="text-xs font-bold" style={{ color: res.accent }}>
                    {res.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed flex-1">
                  {res.description}
                </p>

                {/* Stat chips */}
                <div className="flex flex-wrap gap-1">
                  {res.stats.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-slate-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg text-xs font-bold text-white transition-all duration-200 active:scale-[0.98] mt-1"
                  style={{ background: res.accent }}
                >
                  Visit {res.name}
                  <ExternalIcon />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesTab;