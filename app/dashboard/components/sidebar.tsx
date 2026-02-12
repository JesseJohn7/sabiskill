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

const Sidebar: React.FC<Props> = ({
  currentTab,
  setCurrentTab,
  isOpen,
  setIsOpen,
}) => {
  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "resources", label: "Assets", icon: FileText },
    { id: "settings", label: "Setup", icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[120] bg-white border-r border-slate-100 flex flex-col transition-all duration-300 ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-24"
      }`}
    >
      <div className="p-6 flex items-center justify-center lg:mb-4">
        <div className="bg-slate-900 p-2.5 rounded-2xl shadow-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        {isOpen && (
          <span className="ml-3 font-black text-xl text-slate-900">EduFlow</span>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-4 mt-8">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentTab(item.id);
              setIsOpen(false);
            }}
            className={`w-full group relative flex items-center ${
              isOpen ? "px-4 justify-start" : "justify-center"
            } py-4 rounded-3xl transition-all ${
              currentTab === item.id
                ? "bg-slate-900 text-white shadow-xl"
                : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {isOpen && (
              <span className="ml-4 font-bold text-[15px] tracking-tight">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-5 mt-auto pb-10">
        <button className="w-full flex items-center justify-center lg:justify-center py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-3xl font-bold">
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="ml-4">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;