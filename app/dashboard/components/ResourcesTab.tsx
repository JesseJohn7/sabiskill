"use client";

import React, { useState } from "react";

const JOIN_LINK =
  "https://docs.google.com/forms/d/e/1FAIpQLSeu4dmCuFnYSdqATlOOaFoO5ILtFRHIjuTJev2HsbZ3_M8XwQ/viewform?pli=1";

/* ─── Types ─────────────────────────────────────────── */
interface Book {
  title: string;
  author: string;
  description: string;
  cover: string; // emoji stand-in until real covers are provided
  tag: string;
}

/* ─── Data ───────────────────────────────────────────── */
const books: Book[] = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description:
      "A handbook of agile software craftsmanship that teaches writing readable, maintainable code.",
    cover: "📘",
    tag: "Engineering",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Hunt & Thomas",
    description:
      "Timeless lessons and best practices drawn from the authors' combined experience.",
    cover: "🟠",
    tag: "Career",
  },
  {
    title: "Designing Data-Intensive Apps",
    author: "Martin Kleppmann",
    description:
      "Deep-dives into the principles behind reliable, scalable, and maintainable systems.",
    cover: "📗",
    tag: "Systems",
  },
  {
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    description:
      "A series that explores the core mechanisms of the JavaScript language in full depth.",
    cover: "📙",
    tag: "JavaScript",
  },
];

/* ─── Sub-components ─────────────────────────────────── */

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-indigo-600 mb-3">
    <span className="block w-4 h-px bg-indigo-400" />
    {children}
    <span className="block w-4 h-px bg-indigo-400" />
  </span>
);

const ScholarshipSection: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="mb-14">
      <SectionLabel>Scholarship</SectionLabel>
      <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
        Community Scholarship
      </h2>
      <p className="text-slate-500 mb-8 max-w-xl">
        Join a curated space for builders, learners, and creators. Access
        exclusive resources, mentorship, and growth opportunities.
      </p>

      {/* Community card */}
      <div
        className="relative overflow-hidden rounded-3xl border border-indigo-100 shadow-xl mb-6"
        style={{
          background:
            "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
        }}
      >
        {/* decorative blobs */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-30 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, #818cf8 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          {/* Logo placeholder */}
          <div className="flex-shrink-0">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              {/* Replace the content below with an <img> tag once you have the logo */}
              <span className="text-4xl select-none">🎓</span>
            </div>
            <p className="text-xs text-center mt-2 text-indigo-400 font-semibold tracking-wide">
              LOGO
            </p>
          </div>

          {/* Text block */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Community
              </span>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Free to Join
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              {/* Replace with actual community name */}
              Your Community Name
            </h3>
            <p className="text-slate-600 leading-relaxed max-w-lg">
              {/* Replace with actual community description */}
              This is a brief description of your community — what it stands
              for, who it's for, and what members gain by being part of it.
              Highlight the unique value, culture, and opportunities you offer.
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <a
              href={JOIN_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group inline-flex items-center gap-2 text-white font-black px-7 py-3.5 rounded-2xl shadow-lg transition-all duration-200"
              style={{
                background: hovered
                  ? "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
                  : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered
                  ? "0 12px 32px rgba(99,102,241,0.45)"
                  : "0 6px 18px rgba(99,102,241,0.3)",
              }}
            >
              Join Community
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Scholarship apply card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-md p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🏅</span>
        </div>
        <div className="flex-1">
          <h4 className="font-black text-slate-900 text-base mb-0.5">
            Apply for a Scholarship
          </h4>
          <p className="text-slate-500 text-sm">
            Eligible members can apply for learning scholarships and sponsored
            access to premium resources.
          </p>
        </div>
        <a
          href={JOIN_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-2 border-2 border-indigo-600 text-indigo-700 font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-all text-sm"
        >
          Apply Now
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};

const BooksSection: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string>("All");
  const tags = ["All", ...Array.from(new Set(books.map((b) => b.tag)))];
  const filtered =
    activeTag === "All" ? books : books.filter((b) => b.tag === activeTag);

  return (
    <section>
      <SectionLabel>Books</SectionLabel>
      <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
        Recommended Reading
      </h2>
      <p className="text-slate-500 mb-6 max-w-xl">
        Hand-picked books to accelerate your learning journey across engineering,
        design, and growth.
      </p>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-7">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className="text-sm font-bold px-4 py-1.5 rounded-full border-2 transition-all"
            style={{
              background: activeTag === tag ? "#6366f1" : "white",
              color: activeTag === tag ? "white" : "#6366f1",
              borderColor: "#6366f1",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Book grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((book) => (
          <div
            key={book.title}
            className="group bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            style={{ transform: "translateY(0)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {/* Cover strip */}
            <div
              className="h-28 flex items-center justify-center text-5xl"
              style={{
                background:
                  "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
              }}
            >
              {book.cover}
            </div>

            <div className="p-4">
              <span className="text-xs font-bold text-indigo-500 tracking-wide uppercase">
                {book.tag}
              </span>
              <h4 className="font-black text-slate-900 text-base leading-snug mt-1 mb-0.5">
                {book.title}
              </h4>
              <p className="text-xs text-slate-400 font-semibold mb-2">
                {book.author}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add-more nudge */}
      <div className="mt-6 text-center text-sm text-slate-400">
        More books coming soon —{" "}
        <a
          href={JOIN_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-500 font-bold hover:underline"
        >
          join the community
        </a>{" "}
        to suggest titles.
      </div>
    </section>
  );
};

/* ─── Main export ────────────────────────────────────── */
const ResourcesTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 max-w-5xl mx-auto py-4 px-2">
      <h2 className="text-4xl font-black text-slate-900 mb-2">Resources</h2>
      <p className="text-slate-500 mb-10">
        Everything you need to learn, grow, and connect with the community.
      </p>

      <ScholarshipSection />
      <BooksSection />
    </div>
  );
};

export default ResourcesTab;