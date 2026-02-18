"use client";

import React from "react";
import { Play, Clock, Lock, CheckCircle2, ChevronRight, Star, Zap } from "lucide-react";

// ⚠️ These IDs must match the keys in VideoPlayer's COURSES object exactly
export const ALL_COURSES = [
  {
    id: "web-dev",
    title: "Complete Web Development",
    description: "HTML, CSS, JavaScript & beyond — build real-world projects from scratch.",
    thumbnail: "https://i.ytimg.com/vi/HGTJBPNC-Gw/maxresdefault.jpg",
    lessons: 37,
    level: "Beginner",
    tag: "Most Popular",
  },
  {
    id: "ui-ux",
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of great design and build beautiful user experiences.",
    thumbnail: "https://i.ytimg.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg",
    lessons: 4,
    level: "Beginner",
    tag: "Quick Start",
  },
  {
    id: "javascript",
    title: "JavaScript Full Course",
    description: "Deep dive into modern JavaScript — ES6+, async, DOM, and more.",
    thumbnail: "https://i.ytimg.com/vi/EfAl9bwzVZk/maxresdefault.jpg",
    lessons: 28,
    level: "Intermediate",
    tag: "Trending",
  },
  {
    id: "crypto",
    title: "Cryptocurrency & Blockchain",
    description: "Understand crypto, wallets, DeFi, NFTs, and the future of finance.",
    thumbnail: "https://i.ytimg.com/vi/amAq-WHAFs8/maxresdefault.jpg",
    lessons: 11,
    level: "Beginner",
    tag: null,
  },
  {
    id: "public-speak",
    title: "Public Speaking Mastery",
    description: "Overcome fear and speak confidently in front of any audience.",
    thumbnail: "https://i.ytimg.com/vi/w82a1FT5o88/maxresdefault.jpg",
    lessons: 15,
    level: "All Levels",
    tag: null,
  },
  {
    id: "personal-dev",
    title: "Personal Development & Growth",
    description: "Build habits, mindset, and systems to reach your full potential.",
    thumbnail: "https://i.ytimg.com/vi/75d_29QWELk/maxresdefault.jpg",
    lessons: 10,
    level: "All Levels",
    tag: null,
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
  "All Levels": "bg-blue-100 text-blue-700",
};

interface ExploreTabProps {
  activeCourseId?: string | null;       // the course currently in progress (only one allowed)
  completedCourseIds?: string[];         // courses fully finished
  onCourseSelect?: (courseId: string) => void;
}

const ExploreTab: React.FC<ExploreTabProps> = ({
  activeCourseId = null,
  completedCourseIds = [],
  onCourseSelect,
}) => {
  const getStatus = (id: string): "completed" | "active" | "locked" | "available" => {
    if (completedCourseIds.includes(id)) return "completed";
    if (id === activeCourseId) return "active";
    // If there's an active course, all others (except completed) are locked
    if (activeCourseId && id !== activeCourseId) return "locked";
    return "available";
  };

  const handleClick = (id: string) => {
    const status = getStatus(id);
    if (status === "locked") return;
    if (onCourseSelect) onCourseSelect(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-black text-black leading-tight">
            Explore Tracks 🔍
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            {activeCourseId
              ? "Finish your active course to unlock other tracks."
              : "Pick one track to start — complete it before unlocking the next."}
          </p>
        </div>
      </div>

      {/* Active course notice */}
      {activeCourseId && (() => {
        const active = ALL_COURSES.find((c) => c.id === activeCourseId);
        return active ? (
          <div className="max-w-7xl mx-auto mb-5 sm:mb-6">
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
              <Zap className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-blue-700 font-semibold">
                You're currently on{" "}
                <span className="font-black">{active.title}</span>. Complete it to unlock other tracks.
              </p>
              <button
                onClick={() => handleClick(activeCourseId)}
                className="ml-auto flex-shrink-0 flex items-center gap-1 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : null;
      })()}

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {ALL_COURSES.map((c) => {
            const status = getStatus(c.id);
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            const isActive = status === "active";

            return (
              <div
                key={c.id}
                onClick={() => handleClick(c.id)}
                className={`group bg-white rounded-xl sm:rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col
                  ${isLocked
                    ? "border-slate-200 opacity-60 cursor-not-allowed"
                    : isCompleted
                    ? "border-emerald-200 hover:border-emerald-300 hover:shadow-xl cursor-pointer"
                    : isActive
                    ? "border-blue-300 hover:shadow-xl cursor-pointer ring-2 ring-blue-400 ring-offset-1"
                    : "border-slate-200 hover:border-blue-200 hover:shadow-xl cursor-pointer"
                  }`}
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <div className="aspect-video">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${!isLocked ? "group-hover:scale-105" : ""}`}
                    />
                  </div>

                  {/* Locked overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                      <Lock className="w-6 h-6 text-white" />
                      <span className="text-white text-[10px] font-bold">Finish active track first</span>
                    </div>
                  )}

                  {/* Completed overlay */}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1.5 shadow-lg">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                    </div>
                  )}

                  {/* Active badge */}
                  {isActive && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                      In Progress
                    </div>
                  )}

                  {/* Tag badge */}
                  {c.tag && !isLocked && !isCompleted && !isActive && (
                    <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-black uppercase px-2 py-1 rounded-full shadow flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {c.tag}
                    </div>
                  )}

                  {/* Lessons badge */}
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white" />
                    <span className="text-[10px] sm:text-xs font-semibold text-white">{c.lessons} lessons</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${LEVEL_COLORS[c.level] || "bg-slate-100 text-slate-600"}`}>
                        {c.level}
                      </span>
                    </div>
                    <h3 className="font-black text-sm sm:text-base text-slate-800 line-clamp-1">{c.title}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>
                  </div>

                  <div className="mt-auto pt-1">
                    {isLocked ? (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-400 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Locked
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleClick(c.id)}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Review Course
                      </button>
                    ) : isActive ? (
                      <button
                        onClick={() => handleClick(c.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={() => handleClick(c.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Get Started
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExploreTab;