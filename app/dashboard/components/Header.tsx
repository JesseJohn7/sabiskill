"use client";

import React from "react";
import { Bell, Search, User, Menu } from "lucide-react";

interface Props {
  toggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ toggleSidebar }) => {
  return (
    <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, resources..."
            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:border-blue-600/50 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <button className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
              Alex Walker
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;