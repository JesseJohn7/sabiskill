"use client";

import React from "react";
import { Trophy, CheckCircle2, Rocket, Target, ChevronRight, Play, Clock } from "lucide-react";

const COURSES = [
  {
    id: "react",
    title: "React Foundations",
    thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    progress: 40,
    lessons: 12,
  },
  {
    id: "tailwind",
    title: "Tailwind CSS Basics",
    thumbnail: "https://i.ytimg.com/vi/pfaSUYaSgRo/maxresdefault.jpg",
    progress: 75,
    lessons: 8,
  },
  {
    id: "typescript",
    title: "TypeScript Mastery",
    thumbnail: "https://i.ytimg.com/vi/BwuLxPH8IDs/maxresdefault.jpg",
    progress: 20,
    lessons: 15,
  },
];

const HomeTab = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Title */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-blue-600 leading-tight">
              Hello, Alex 👋
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              Continue mastering your next skill today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:max-w-md">
            <div className="group bg-white p-3 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="p-1.5 sm:p-2 bg-amber-50 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-amber-700 uppercase font-bold tracking-wide">
                    Paths
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-black text-amber-900">2</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-white p-3 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-green-300 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-green-700 uppercase font-bold tracking-wide">
                    Modules
                  </p>
                  <p className="text-lg sm:text-xl md:text-2xl font-black text-green-900">6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 p-5 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 md:space-y-5">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                  <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Get Started
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight">
                  Master your next{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10">skill path</span>
                    <span className="absolute bottom-0 left-0 w-full h-1.5 sm:h-2 md:h-3 bg-white/30 -rotate-1 rounded-full"></span>
                  </span>
                </h2>
                
                <p className="text-xs sm:text-sm md:text-base text-blue-50 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Curated tutorials in linear learning paths. Start one to unlock your progress.
                </p>
                
                <button className="group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-white hover:bg-blue-50 text-blue-600 rounded-full font-semibold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
                  Find Your First Track 
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Decorative Image Grid - Hidden on mobile */}
              <div className="hidden lg:grid grid-cols-2 gap-2.5 sm:gap-3 flex-shrink-0">
                {COURSES.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className={`relative w-20 h-20 xl:w-24 xl:h-24 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg hover:scale-105 transition-transform ${
                      i % 2 === 0 ? "translate-y-2" : "-translate-y-2"
                    }`}
                  >
                    <img
                      src={c.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-900/20"></div>
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="p-1 sm:p-1.5 bg-blue-600 rounded-lg">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-800">
              Learning Tracks
            </h2>
          </div>
          
          <button className="group hidden sm:flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-semibold text-[10px] sm:text-xs transition-all">
            View All 
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all overflow-hidden hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src={c.thumbnail} 
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Progress Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/95 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md border border-blue-100">
                  <span className="text-[10px] sm:text-xs font-black text-blue-600">{c.progress}%</span>
                </div>

                {/* Lesson Count */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-white/95 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-md flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-600" />
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-700">{c.lessons} lessons</span>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 md:p-5 space-y-2.5 sm:space-y-3">
                <h3 className="font-black text-sm sm:text-base md:text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {c.title}
                </h3>
                
                {/* Progress Bar */}
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">
                      {c.progress < 30 ? 'Just started' : c.progress < 70 ? 'In progress' : 'Almost done'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{c.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm">
                  Continue Learning
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <button className="sm:hidden w-full mt-3 sm:mt-4 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all">
          View All Tracks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HomeTab;