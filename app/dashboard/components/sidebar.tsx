"use client";

import React from "react";
import {
  Home,
  Compass,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ currentTab, setCurrentTab, isOpen, setIsOpen }) => {
  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "resources", label: "Assets", icon: FileText },
    { id: "settings", label: "Setup", icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[120] bg-white border-r border-slate-100 flex flex-col transition-all duration-300
        ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-center lg:mb-4">
        <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {isOpen && (
          <span className="ml-3 font-black text-xl text-slate-900">EduFlow</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-8 flex flex-col items-center space-y-4 px-1 lg:px-0">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentTab(item.id);
              setIsOpen(false);
            }}
            className={`group relative flex items-center justify-center lg:justify-center w-12 lg:w-full py-4 rounded-3xl transition-all duration-200
              ${currentTab === item.id
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
          >
            <item.icon className="w-6 h-6" />
            
            {/* Show label on hover only when sidebar is collapsed */}
            {!isOpen && (
              <span className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
                {item.label}
              </span>
            )}

            {/* Show label normally when sidebar is open */}
            {isOpen && (
              <span className="ml-4 font-bold text-[15px] tracking-tight">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-5 mt-auto pb-10 flex justify-center lg:justify-start">
        <button className="group relative flex items-center justify-center lg:justify-start w-12 lg:w-full py-4 rounded-3xl text-slate-400 hover:text-red-500 hover:bg-red-50 font-bold">
          <LogOut className="w-6 h-6" />
          
          {/* Tooltip for collapsed sidebar */}
          {!isOpen && (
            <span className="absolute left-full ml-3 px-2 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
              Sign Out
            </span>
          )}

          {/* Label for open sidebar */}
          {isOpen && <span className="ml-4">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;