"use client";

import React, { useState } from "react";

/* ─────────────────────────────────────────────
   Brand logos as inline SVG components
───────────────────────────────────────────── */

const AcernityLogo = () => (
  <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
    <circle cx="16" cy="16" r="14" fill="black" />
    <circle cx="16" cy="16" r="8" fill="white" opacity="0.15" />
    <circle cx="16" cy="16" r="4" fill="white" opacity="0.9" />
    <text x="36" y="21" fill="black" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="-0.3">Aceternity UI</text>
  </svg>
);

const ShadcnLogo = () => (
  <svg viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="black" />
    <line x1="10" y1="22" x2="22" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="10" y1="10" x2="16" y2="10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="16" y1="22" x2="22" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <text x="36" y="21" fill="black" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="-0.3">shadcn/ui</text>
  </svg>
);

const PrebuiltUILogo = () => (
  <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto">
    <rect x="2" y="2" width="28" height="28" rx="6" fill="#6366f1" />
    <rect x="8" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9" />
    <rect x="18" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.5" />
    <rect x="8" y="18" width="8" height="8" rx="1.5" fill="white" opacity="0.5" />
    <rect x="18" y="18" width="8" height="8" rx="1.5" fill="white" opacity="0.9" />
    <text x="36" y="21" fill="black" fontSize="13" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="-0.3">PrebuiltUI</text>
  </svg>
);

const HNGLogo = () => (
  <img
    src="https://images.hng.tech/logo.svg"
    alt="HNG"
    className="h-7 w-auto"
    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
  />
);

/* ─────────────────────────────────────────────
   Resource data
───────────────────────────────────────────── */

const resources = [
  {
    name: "Aceternity UI",
    url: "https://ui.aceternity.com",
    tagline: "Copy-paste animated components for React & Next.js",
    description:
      "200+ stunning components powered by Tailwind CSS and Framer Motion. Think 3D cards, aurora backgrounds, spotlight effects, and scroll-driven animations — all copy-paste ready.",
    Logo: AcernityLogo,
    accent: "#000000",
    hoverAccent: "#1a1a1a",
    pillBg: "#f3f4f6",
    pillColor: "#111827",
    badgeText: "Animation Library",
    badgeBg: "#f9fafb",
    badgeColor: "#374151",
    badgeBorder: "#e5e7eb",
    cardBorder: "#e5e7eb",
    cardBg: "#ffffff",
    hoverBorder: "#000000",
    hoverShadow: "0 16px 48px -8px rgba(0,0,0,0.18)",
    stats: ["200+ Components", "Framer Motion", "Tailwind CSS"],
    tag: "Free + Pro",
    tagColor: "#6b7280",
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com",
    tagline: "Beautifully designed components you own, not install",
    description:
      "Not a component library — it's a collection of re-usable components you copy into your codebase. Built on Radix UI primitives, fully accessible, and endlessly customizable.",
    Logo: ShadcnLogo,
    accent: "#18181b",
    hoverAccent: "#09090b",
    pillBg: "#f4f4f5",
    pillColor: "#18181b",
    badgeText: "Design System",
    badgeBg: "#f4f4f5",
    badgeColor: "#3f3f46",
    badgeBorder: "#e4e4e7",
    cardBorder: "#e4e4e7",
    cardBg: "#fafafa",
    hoverBorder: "#18181b",
    hoverShadow: "0 16px 48px -8px rgba(24,24,27,0.16)",
    stats: ["Radix Primitives", "Fully Accessible", "Open Code"],
    tag: "100% Free",
    tagColor: "#6b7280",
  },
  {
    name: "PrebuiltUI",
    url: "https://prebuiltui.com",
    tagline: "390+ Tailwind CSS components for rapid development",
    description:
      "A free, open-source collection of production-ready components and templates. Perfect for landing pages, dashboards, and SaaS apps — built purely with Tailwind utility classes.",
    Logo: PrebuiltUILogo,
    accent: "#6366f1",
    hoverAccent: "#4f46e5",
    pillBg: "#eef2ff",
    pillColor: "#4338ca",
    badgeText: "Component Library",
    badgeBg: "#eef2ff",
    badgeColor: "#4338ca",
    badgeBorder: "#c7d2fe",
    cardBorder: "#e0e7ff",
    cardBg: "#fafbff",
    hoverBorder: "#6366f1",
    hoverShadow: "0 16px 48px -8px rgba(99,102,241,0.22)",
    stats: ["390+ Components", "Open Source", "Dark Mode"],
    tag: "100% Free",
    tagColor: "#6366f1",
  },
  {
    name: "HNG Internship",
    url: "https://hng.tech/internship",
    tagline: "Africa's largest remote tech internship program",
    description:
      "An intense 8-week bootcamp where you ship real apps in teams, get mentored by industry pros, and land job offers at global companies. Open to coders, designers, PMs and more.",
    Logo: HNGLogo,
    accent: "#f97316",
    hoverAccent: "#ea6c0a",
    pillBg: "#fff7ed",
    pillColor: "#c2410c",
    badgeText: "Internship Program",
    badgeBg: "#fff7ed",
    badgeColor: "#c2410c",
    badgeBorder: "#fed7aa",
    cardBorder: "#fde8d0",
    cardBg: "#fffaf7",
    hoverBorder: "#f97316",
    hoverShadow: "0 16px 48px -8px rgba(249,115,22,0.22)",
    stats: ["3K+ Finalists", "21+ Countries", "Job Placement"],
    tag: "Free to Join",
    tagColor: "#f97316",
  },
];

/* ─────────────────────────────────────────────
   External link icon
───────────────────────────────────────────── */
const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const ResourcesTab: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Resources</h2>
        <p className="text-slate-500 text-base">
          Handpicked UI libraries and programs to sharpen your skills and ship faster.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {resources.map((res, i) => {
          const isHovered = hovered === i;
          const { Logo } = res;

          return (
            <div
              key={res.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-default"
              style={{
                background: res.cardBg,
                border: `1.5px solid ${isHovered ? res.hoverBorder : res.cardBorder}`,
                boxShadow: isHovered ? res.hoverShadow : "0 1px 6px rgba(0,0,0,0.05)",
                transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              }}
            >
              {/* Thin top accent line */}
              <div className="h-[3px] w-full" style={{ background: res.accent }} />

              <div className="p-6 flex flex-col gap-4 flex-1">

                {/* Row 1: Logo + badge */}
                <div className="flex items-start justify-between gap-3">
                  {/* Logo pill */}
                  <div
                    className="flex items-center px-3 py-2 rounded-xl border"
                    style={{ background: "white", borderColor: res.cardBorder, minWidth: 120 }}
                  >
                    <Logo />
                  </div>

                  {/* Badge */}
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap mt-1"
                    style={{
                      background: res.badgeBg,
                      color: res.badgeColor,
                      borderColor: res.badgeBorder,
                    }}
                  >
                    {res.badgeText}
                  </span>
                </div>

                {/* Row 2: Name + tagline */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-black text-lg text-slate-900">{res.name}</h3>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: res.pillBg, color: res.tagColor }}
                    >
                      {res.tag}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug" style={{ color: res.accent }}>
                    {res.tagline}
                  </p>
                </div>

                {/* Row 3: Description */}
                <p className="text-slate-500 text-sm leading-relaxed flex-1">
                  {res.description}
                </p>

                {/* Row 4: Stat chips */}
                <div className="flex flex-wrap gap-1.5">
                  {res.stats.map((stat) => (
                    <span
                      key={stat}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg border"
                      style={{
                        background: res.pillBg,
                        color: res.pillColor,
                        borderColor: res.badgeBorder,
                      }}
                    >
                      {stat}
                    </span>
                  ))}
                </div>

                {/* Row 5: CTA */}
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: isHovered ? res.hoverAccent : res.accent,
                  }}
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