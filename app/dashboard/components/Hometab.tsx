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

const HomeTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">Hello, Alex</h1>
          <p className="text-slate-400 font-medium text-xl">
            Continue mastering your next skill today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black">
                Paths Done
              </p>
              <p className="text-xl font-black text-slate-900">2</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black">
                Modules
              </p>
              <p className="text-xl font-black text-slate-900">6</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative p-12 md:p-20 bg-white border border-slate-100 rounded-[4rem] shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 -skew-x-12 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest mb-8 shadow-xl">
              <Rocket className="w-4 h-4" /> Get Started
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8">
              Master your next{" "}
              <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">
                skill path
              </span>
              .
            </h2>
            <p className="text-slate-400 font-medium text-xl mb-12 max-w-xl">
              We’ve curated the best tutorials into linear learning paths. Start one to unlock progress.
            </p>
            <button className="px-12 py-6 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-4">
              Find Your First Track <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4 flex-shrink-0">
            {COURSES.slice(0, 4).map((c, i) => (
              <div
                key={i}
                className={`w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl ${
                  i % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                }`}
              >
                <img
                  src={c.thumbnail}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-slate-900" />
            <h2 className="text-3xl font-black text-slate-900">Popular Learning Tracks</h2>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">
            View Library <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {COURSES.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-[3rem] border border-slate-100 shadow-md hover:shadow-lg transition-all overflow-hidden group"
            >
              <img src={c.thumbnail} className="w-full aspect-video object-cover" />
              <div className="p-8">
                <h3 className="font-black text-xl text-slate-900 mb-3">{c.title}</h3>
                <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                  <div
                    className="bg-slate-900 h-full rounded-full"
                    style={{ width: `${c.progress}%` }}
                  ></div>
                </div>
                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  Continue <Play className="w-4 h-4" />
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