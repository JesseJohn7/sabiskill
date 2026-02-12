"use client";

import React from "react";
import { Bell, Search, User, Menu } from "lucide-react";

interface Props {
  toggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ toggleSidebar }) => {
  return (
    <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-50 sticky top-0 z-50 px-8 sm:px-12 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-3 text-slate-600 hover:bg-slate-100 rounded-2xl"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative max-w-md w-full hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-64 xl:w-80 pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-slate-900/5 focus:bg-white focus:border-slate-200 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-8">
        <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-2xl relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-400" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-black text-slate-900 leading-none">
              Alex Walker
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              Free Plan
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;