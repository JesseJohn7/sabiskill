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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-8 sm:mb-12 lg:mb-16">
        <div className="flex flex-col gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              Hello, Alex
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium">
              Continue mastering your next skill today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl sm:rounded-2xl">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    Paths Done
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">2</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-black tracking-wider">
                    Modules
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-3xl sm:rounded-[3rem] lg:rounded-[4rem] shadow-xl shadow-slate-200/60 overflow-hidden mb-12 sm:mb-16 lg:mb-20">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Skewed Background Element - Hidden on mobile */}
        <div className="hidden lg:block absolute top-0 right-0 w-[55%] h-full bg-gradient-to-br from-slate-50 to-slate-100 -skew-x-12 translate-x-1/4"></div>
        
        <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-16 xl:p-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16">
            {/* Content */}
            <div className="flex-1 text-center lg:text-left space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4" /> Get Started
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 leading-tight">
                Master your next{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-blue-600">skill path</span>
                  <span className="absolute bottom-1 left-0 w-full h-3 sm:h-4 bg-blue-100 -rotate-1"></span>
                </span>
                .
              </h2>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0">
                We've curated the best tutorials into linear learning paths. Start one to unlock progress.
              </p>
              
              <button className="group w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg lg:text-xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 sm:gap-4">
                Find Your First Track 
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Course Thumbnails Grid - Hidden on mobile/tablet */}
            <div className="hidden xl:grid grid-cols-2 gap-4 flex-shrink-0">
              {COURSES.slice(0, 4).map((c, i) => (
                <div
                  key={i}
                  className={`w-28 h-28 xl:w-32 xl:h-32 rounded-2xl xl:rounded-3xl overflow-hidden border-4 border-white shadow-xl hover:scale-105 transition-all ${
                    i % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                  }`}
                >
                  <img
                    src={c.thumbnail}
                    alt=""
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Tracks Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 bg-slate-100 rounded-xl">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900">
              Popular Learning Tracks
            </h2>
          </div>
          
          <button className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-bold text-xs sm:text-sm transition-all">
            View Library 
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="group bg-white rounded-2xl sm:rounded-3xl lg:rounded-[3rem] border border-slate-100 shadow-md hover:shadow-xl transition-all overflow-hidden hover:-translate-y-1"
            >
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={c.thumbnail} 
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="p-5 sm:p-6 lg:p-8 space-y-4">
                <h3 className="font-black text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                  {c.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
                    <span>Progress</span>
                    <span>{c.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-slate-900 to-slate-700 h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95">
                  Continue 
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeTab;