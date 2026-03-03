"use client";

import React, { useState } from "react";

const resources = [
  {
    name: "W3Schools",
    tagline: "The world's largest web developer site",
    description:
      "Free tutorials, references, and exercises for HTML, CSS, JavaScript, Python, SQL, and 40+ other languages. The go-to reference for web developers since 1999.",
    url: "https://www.w3schools.com",
    logo: "https://www.w3schools.com/images/w3schools_logo_436_2.png",
    logoAlt: "W3Schools logo",
    accent: "#04AA6D",
    bgGradient: "linear-gradient(135deg, #f0fdf8 0%, #dcfce7 100%)",
    borderColor: "#bbf7d0",
    badgeText: "Tutorials & Reference",
    badgeBg: "#dcfce7",
    badgeColor: "#15803d",
    stats: ["40+ Languages", "Free Exercises", "Certifications"],
  },
  {
    name: "freeCodeCamp",
    tagline: "Learn to code for free. Build projects. Earn certifications.",
    description:
      "A non-profit community with thousands of hours of curriculum, hands-on projects, and industry-recognized certifications in web dev, data science, and more.",
    url: "https://www.freecodecamp.org",
    logo: "https://design-style-guide.freecodecamp.org/downloads/fcc_secondary_small.svg",
    logoAlt: "freeCodeCamp logo",
    accent: "#1b1b32",
    bgGradient: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
    borderColor: "#c7d2fe",
    badgeText: "Free Certifications",
    badgeBg: "#e0e7ff",
    badgeColor: "#4338ca",
    stats: ["3,000+ Hours", "Non-profit", "Job Ready"],
  },
  {
    name: "HNG Internship",
    tagline: "Africa's largest remote tech internship program",
    description:
      "An intense 8-week bootcamp where you build real apps in teams, get mentored by industry pros, and get connected to job opportunities at global companies.",
    url: "https://hng.tech/internship",
    logo: "https://images.hng.tech/",
    logoAlt: "HNG Internship logo",
    accent: "#f97316",
    bgGradient: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
    borderColor: "#fed7aa",
    badgeText: "Internship Program",
    badgeBg: "#ffedd5",
    badgeColor: "#c2410c",
    stats: ["3K+ Finalists", "21+ Countries", "Job Placement"],
  },
];

const ArrowIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
    />
  </svg>
);

const ResourcesTab: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Resources</h2>
        <p className="text-slate-500 text-lg">
          Handpicked platforms to accelerate your learning and tech career.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res, i) => (
          <div
            key={res.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300"
            style={{
              borderColor: hovered === i ? res.accent : res.borderColor,
              boxShadow:
                hovered === i
                  ? `0 12px 40px -8px ${res.accent}44`
                  : "0 2px 12px rgba(0,0,0,0.06)",
              transform: hovered === i ? "translateY(-3px)" : "translateY(0)",
              background: res.bgGradient,
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-1 w-full"
              style={{ backgroundColor: res.accent }}
            />

            <div className="flex flex-col flex-1 p-6 gap-4">
              {/* Logo + Badge */}
              <div className="flex items-center justify-between">
                <div className="bg-white rounded-xl p-2.5 shadow-sm border border-slate-100 flex items-center justify-center h-14 w-36">
                  <img
                    src={res.logo}
                    alt={res.logoAlt}
                    className="h-8 w-auto max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: res.badgeBg,
                    color: res.badgeColor,
                  }}
                >
                  {res.badgeText}
                </span>
              </div>

              {/* Name & tagline */}
              <div>
                <h3 className="font-black text-xl text-slate-900 mb-1">
                  {res.name}
                </h3>
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: res.accent }}
                >
                  {res.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                {res.description}
              </p>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-2">
                {res.stats.map((stat) => (
                  <span
                    key={stat}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/70 text-slate-600 border"
                    style={{ borderColor: res.borderColor }}
                  >
                    {stat}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: res.accent }}
              >
                Visit {res.name}
                <ArrowIcon />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesTab;