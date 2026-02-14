"use client";

import React from "react";
import { Trophy, CheckCircle2, Rocket, Target, ChevronRight, Play } from "lucide-react";

const COURSES = [
  {
    id: "react",
    title: "React Foundations",
    thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/maxresdefault.jpg",
    progress: 40,
  },
  {
    id: "tailwind",
    title: "Tailwind CSS Basics",
    thumbnail: "https://i.ytimg.com/vi/pfaSUYaSgRo/maxresdefault.jpg",
    progress: 75,
  },
  {
    id: "typescript",
    title: "TypeScript Mastery",
    thumbnail: "https://i.ytimg.com/vi/BwuLxPH8IDs/maxresdefault.jpg",
    progress: 20,
  },
];

const HomeTab = () => {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-600 leading-tight">
              Hello, Alex
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Continue mastering your next skill today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-2.5 sm:gap-3">
            <div className="group bg-amber-50 p-3.5 sm:p-4 rounded-2xl border border-amber-200 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-amber-700 uppercase font-black tracking-wide">
                    Paths
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-amber-900">2</p>
                </div>
              </div>
            </div>
            
            <div className="group bg-green-50 p-3.5 sm:p-4 rounded-2xl border border-green-200 shadow-sm hover:shadow-lg hover:border-green-300 transition-all cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-green-700 uppercase font-black tracking-wide">
                    Modules
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-green-900">6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-white border border-slate-200 rounded-3xl sm:rounded-[2.5rem] shadow-lg overflow-hidden mb-6 sm:mb-8">
        {/* Decorative Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full opacity-5">
            <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
        
        <div className="relative z-10 p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-lg">
                <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Get Started
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 leading-tight">
                Master your next{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600">
                    skill path
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-2 sm:h-3 bg-blue-100 -rotate-1 rounded-full"></span>
                </span>
              </h2>
              
              <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Curated tutorials in linear learning paths. Start one to unlock your progress.
              </p>
              
              <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2.5">
                Find Your First Track 
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Course Thumbnails Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0">
              {COURSES.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className={`relative w-24 h-24 xl:w-28 xl:h-28 rounded-2xl overflow-hidden border-3 border-white shadow-lg hover:scale-105 transition-transform ${
                    i % 2 === 0 ? "translate-y-3" : "-translate-y-3"
                  }`}
                >
                  <img
                    src={c.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-900/30"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tracks Section */}
      <div>
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-600">
              Learning Tracks
            </h2>
          </div>
          
          <button className="group hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-bold text-xs transition-all">
            View All 
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all overflow-hidden hover:-translate-y-0.5"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src={c.thumbnail} 
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
                <div className="absolute inset-0 bg-blue-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Progress Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-lg border border-blue-100">
                  <span className="text-xs font-black text-blue-600">{c.progress}%</span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 space-y-3">
                <h3 className="font-black text-base sm:text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {c.title}
                </h3>
                
                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-semibold">
                    {c.progress < 30 ? 'Just started' : c.progress < 70 ? 'In progress' : 'Almost done'}
                  </p>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-sm">
                  Continue 
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <button className="sm:hidden w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-blue-200 text-blue-600 bg-white hover:bg-blue-50 font-bold text-sm transition-all">
          View All Tracks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HomeTab;