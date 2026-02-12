"use client";

import React from "react";

const ExploreTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-black text-slate-900 mb-6">Explore</h2>
      <p className="text-slate-500 mb-8">
        Browse trending courses, tutorials, and topics to expand your skills.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all"
          >
            <div className="h-40 bg-slate-100 rounded-2xl mb-4 flex items-center justify-center text-slate-400 font-bold text-lg">
              Image
            </div>
            <h3 className="font-black text-xl text-slate-900 mb-2">Course Title {i + 1}</h3>
            <p className="text-slate-500 mb-4">Short description of the course goes here.</p>
            <button className="bg-slate-900 text-white py-2.5 px-4 rounded-2xl font-bold hover:bg-blue-600 transition-all">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreTab;