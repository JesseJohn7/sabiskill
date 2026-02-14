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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Integrated Stats */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-1">
              Hello, Alex
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Continue mastering your next skill today.
            </p>
          </div>

          {/* Improved Stats Cards - Horizontal Layout */}
          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex-1 min-w-[140px] sm:min-w-[160px]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-0.5">
                    Paths Done
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">2</p>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex-1 min-w-[140px] sm:min-w-[160px]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-0.5">
                    Modules Done
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">6</p>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer flex-1 min-w-[140px] sm:min-w-[160px]">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-0.5">
                    Hours Learned
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">24</p>
                </div>
                <div className="p-2 sm:p-2.5 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner - Compact Design */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="relative z-10 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-6 lg:gap-10">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                <Rocket className="w-3 h-3" /> Quick Start
              </div>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight">
                Master your next{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-400">skill path</span>
                  <span className="absolute bottom-0 left-0 w-full h-2 bg-blue-500/30 rounded-full"></span>
                </span>
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto lg:mx-0">
                Curated tutorials in linear paths. Start learning now.
              </p>
              
              <button className="group w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-blue-500 text-slate-900 hover:text-white rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                Explore Tracks 
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Compact Thumbnails */}
            <div className="hidden lg:flex gap-2 flex-shrink-0">
              {COURSES.slice(0, 3).map((c, i) => (
                <div
                  key={i}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg hover:scale-105 transition-transform"
                >
                  <img
                    src={c.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tracks Section */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-slate-900 rounded-full"></div>
            Learning Tracks
          </h2>
          
          <button className="group hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-all">
            View All 
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Thumbnail with Overlay Info */}
              <div className="relative overflow-hidden">
                <div className="aspect-video bg-slate-100">
                  <img 
                    src={c.thumbnail} 
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                
                {/* Progress Badge - Top Right */}
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-md">
                  <span className="text-xs font-black text-slate-900">{c.progress}%</span>
                </div>
                
                {/* Title Overlay - Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-black text-base text-white line-clamp-1 drop-shadow-lg">
                    {c.title}
                  </h3>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-3 space-y-2.5">
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {c.progress < 30 ? '🚀 Getting started' : c.progress < 70 ? '⚡ In progress' : '🎯 Almost done'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-500"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Continue Button */}
                <button className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 text-sm shadow-sm hover:shadow-md active:scale-95">
                  Continue Learning
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <button className="sm:hidden w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 font-semibold text-sm transition-all">
          View All Tracks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HomeTab;