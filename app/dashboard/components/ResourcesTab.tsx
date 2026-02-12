"use client";

import React from "react";

const ResourcesTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-black text-slate-900 mb-6">Resources</h2>
      <p className="text-slate-500 mb-8">
        Access your saved materials, tutorials, and assets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="font-black text-lg text-slate-900 mb-2">Resource {i + 1}</h3>
            <p className="text-slate-500 mb-4">Short description of resource goes here.</p>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-xl font-bold hover:bg-blue-700 transition-all">
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesTab;