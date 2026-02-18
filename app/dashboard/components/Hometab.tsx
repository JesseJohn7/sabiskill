"use client";

import React from "react";
import { Trophy, CheckCircle2, Rocket, Target, ChevronRight, Play, Clock } from "lucide-react";

// ⚠️ These IDs must match the keys in VideoPlayer's COURSES object exactly
const COURSES = [
  {
    id: "web-dev",
    title: "Complete Web Development",
    thumbnail: "https://i.ytimg.com/vi/HGTJBPNC-Gw/maxresdefault.jpg",
    progress: 0,
    lessons: 37,
  },
  {
    id: "ui-ux",
    title: "UI/UX Design Fundamentals",
    thumbnail: "https://i.ytimg.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg",
    progress: 0,
    lessons: 4,
  },
  {
    id: "javascript",
    title: "JavaScript Full Course",
    thumbnail: "https://i.ytimg.com/vi/EfAl9bwzVZk/maxresdefault.jpg",
    progress: 0,
    lessons: 28,
  },
  {
    id: "crypto",
    title: "Cryptocurrency & Blockchain",
    thumbnail: "https://i.ytimg.com/vi/amAq-WHAFs8/maxresdefault.jpg",
    progress: 0,
    lessons: 11,
  },
  {
    id: "public-speak",
    title: "Public Speaking Mastery",
    thumbnail: "https://i.ytimg.com/vi/w82a1FT5o88/maxresdefault.jpg",
    progress: 0,
    lessons: 15,
  },
  {
    id: "personal-dev",
    title: "Personal Development & Growth",
    thumbnail: "https://i.ytimg.com/vi/75d_29QWELk/maxresdefault.jpg",
    progress: 0,
    lessons: 10,
  },
];

interface HomeTabProps {
  onNavigate?: (tab: string) => void;
  onCourseSelect?: (courseId: string) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onNavigate, onCourseSelect }) => {
  const handleExploreClick = () => {
    if (onNavigate) onNavigate("explore");
  };

  const handleCourseClick = (courseId: string) => {
    if (onCourseSelect) onCourseSelect(courseId);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-black text-black leading-tight">
            Hello, Alex 👋
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            Continue mastering your next skill today
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto mb-5 sm:mb-6 md:mb-8">
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-blue-100/50 transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>

          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(37, 99, 235) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            ></div>
          </div>

          <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-6 lg:gap-8">
              <div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 md:space-y-5 w-full">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm">
                  <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Get Started</span>
                </div>

                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 leading-tight">
                  Master your next{" "}
                  <span className="text-blue-600 relative inline-block">
                    Skill Path
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2 sm:h-3"
                      viewBox="0 0 200 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,5 Q50,0 100,5 T200,5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.3"
                      />
                    </svg>
                  </span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Curated tutorials in linear learning paths. Start one to unlock your progress.
                </p>

                <div className="pt-1 sm:pt-2">
                  <button
                    onClick={handleExploreClick}
                    className="group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Find Your First Track</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-2.5 sm:gap-3 flex-shrink-0">
                {COURSES.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className={`relative w-20 h-20 xl:w-24 xl:h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform duration-300 ${
                      i % 2 === 0 ? "translate-y-2" : "-translate-y-2"
                    }`}
                  >
                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tracks Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-800">
            Learning Tracks
          </h2>
          <button
            onClick={handleExploreClick}
            className="group hidden sm:flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-semibold text-[10px] sm:text-xs transition-all"
          >
            View All
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-video">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1.5 bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-md">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300"></div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700">{c.progress}%</span>
                </div>

                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-slate-900/80 backdrop-blur-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  <span className="text-[10px] sm:text-xs font-semibold text-white">{c.lessons} lessons</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <h3 className="font-black text-sm sm:text-base md:text-lg text-slate-800 line-clamp-1">
                  {c.title}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-600 font-semibold">Not started</span>
                    <span className="text-slate-500 font-bold">{c.progress}% complete</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-slate-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleCourseClick(c.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm"
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleExploreClick}
          className="sm:hidden w-full mt-3 sm:mt-4 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all"
        >
          View All Tracks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HomeTab;