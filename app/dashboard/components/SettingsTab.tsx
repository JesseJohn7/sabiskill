"use client";

import React from "react";

const SettingsTab: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-4xl font-black text-slate-900 mb-6">Settings</h2>
      <p className="text-slate-500 mb-8">
        Customize your account, preferences, and app settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          "Profile",
          "Account",
          "Notifications",
          "Appearance",
          "Privacy",
          "Security",
        ].map((setting, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all flex justify-between items-center"
          >
            <span className="font-bold text-slate-900">{setting}</span>
            <button className="bg-slate-900 text-white py-1.5 px-3 rounded-xl text-sm font-bold hover:bg-blue-600 transition-all">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsTab;