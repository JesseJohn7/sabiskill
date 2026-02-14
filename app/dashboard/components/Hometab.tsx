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

const HomeTab = ({ onNavigate }) => {
  const handleExploreClick = () => {
    if (onNavigate) {
      onNavigate('explore');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-blue-600 leading-tight">
            Hello, Alex 👋
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            Continue mastering your next skill today
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          {/* Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
          
          <div className="relative z-10 p-5 sm:p-8 md:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 md:space-y-5">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                  <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Get Started
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-slate-800 leading-tight">
                  Master your next{" "}
                  <span className="text-blue-600">skill path</span>
                </h2>
                
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Curated tutorials in linear learning paths. Start one to unlock your progress.
                </p>
                
                <button 
                  onClick={handleExploreClick}
                  className="group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Find Your First Track 
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              {/* Decorative Image Grid - Hidden on mobile */}
              <div className="hidden lg:grid grid-cols-2 gap-2.5 sm:gap-3 flex-shrink-0">
                {COURSES.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    className={`relative w-20 h-20 xl:w-24 xl:h-24 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:scale-105 transition-transform ${
                      i % 2 === 0 ? "translate-y-2" : "-translate-y-2"
                    }`}
                  >
                    <img
                      src={c.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
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
          
          <button 
            onClick={handleExploreClick}
            className="group hidden sm:flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-semibold text-[10px] sm:text-xs transition-all"
          >
            View All 
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
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
                
                {/* Progress Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1.5 bg-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg shadow-md">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-600"></div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700">{c.progress}%</span>
                </div>

                {/* Lesson Count */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 bg-slate-900/80 backdrop-blur-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                  <span className="text-[10px] sm:text-xs font-semibold text-white">{c.lessons} lessons</span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <h3 className="font-black text-sm sm:text-base md:text-lg text-slate-800 line-clamp-1">
                  {c.title}
                </h3>
                
                {/* Progress Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-slate-600 font-semibold">
                      {c.progress < 30 ? 'Just started' : c.progress < 70 ? 'In progress' : 'Almost done'}
                    </span>
                    <span className="text-blue-600 font-bold">{c.progress}% complete</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ width: `${c.progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm">
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
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