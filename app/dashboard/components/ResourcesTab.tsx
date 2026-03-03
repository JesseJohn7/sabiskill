"use client";

import React from "react";

const resources = [
  {
    name: "W3Schools",
    tagline: "The world's largest web developer learning platform",
    description:
      "Free tutorials, references, and exercises covering HTML, CSS, JavaScript, Python, SQL, and more. Perfect for beginners and a handy reference for experienced devs.",
    url: "https://www.w3schools.com",
    logo: (
      <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10">
        <rect width="60" height="60" rx="10" fill="#04AA6D" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Georgia, serif">W3</text>
      </svg>
    ),
    accent: "#04AA6D",
    lightBg: "#f0fdf7",
    badge: "Reference & Tutorials",
  },
  {
    name: "freeCodeCamp",
    tagline: "Learn to code — for free",
    description:
      "A non-profit community offering thousands of hours of coding curriculum, hands-on projects, and certifications in web development, data science, and more.",
    url: "https://www.freecodecamp.org",
    logo: (
      <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10">
        <rect width="60" height="60" rx="10" fill="#0A0A23" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#99C9FF" fontSize="26" fontWeight="bold" fontFamily="monospace">{`</>`}</text>
      </svg>
    ),
    accent: "#0A0A23",
    lightBg: "#f0f4ff",
    badge: "Free Certifications",
  },
  {
    name: "HNG Internship",
    tagline: "Africa's largest tech internship program",
    description:
      "A fast-paced, remote internship for designers, developers, and marketers. Work on real projects, build your portfolio, and get hired by top companies.",
    url: "https://hng.tech",
    logo: (
      <svg viewBox="0 0 60 60" fill="none" className="w-10 h-10">
        <rect width="60" height="60" rx="10" fill="#FF6B35" />
        <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Georgia, serif">HNG</text>
      </svg>
    ),
    accent: "#FF6B35",
    lightBg: "#fff7f4",
    badge: "Internship Program",
  },
];

const ResourcesTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-black text-slate-900 mb-2">Resources</h2>
      <p className="text-slate-500 mb-10">
        Handpicked platforms to accelerate your learning and career in tech.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((res) => (
          <div
            key={res.name}
            className="group bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Top color bar */}
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: res.accent }}
            />

            <div className="p-6 flex flex-col flex-1">
              {/* Logo + Badge row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: res.lightBg }}
                >
                  {res.logo}
                </div>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full mt-1"
                  style={{
                    backgroundColor: res.lightBg,
                    color: res.accent,
                  }}
                >
                  {res.badge}
                </span>
              </div>

              {/* Name & tagline */}
              <h3 className="font-black text-xl text-slate-900 mb-1">
                {res.name}
              </h3>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: res.accent }}
              >
                {res.tagline}
              </p>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-6">
                {res.description}
              </p>

              {/* CTA */}
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: res.accent }}
              >
                Visit {res.name}
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
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesTab;