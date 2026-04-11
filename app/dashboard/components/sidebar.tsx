"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Compass,
  FileText,
  Settings,
  LogOut,
  Users,
  X,
} from "lucide-react";
import { createClient } from "../../lib/supabase/client";

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ currentTab, setCurrentTab, isOpen, setIsOpen }) => {
  const router = useRouter();

  const sidebarItems = [
    { id: "home",      label: "Home",        icon: Home      },
    { id: "explore",   label: "Explore",     icon: Compass   },
    { id: "community", label: "Communities", icon: Users     },
    { id: "resources", label: "Resources",   icon: FileText  },
    { id: "settings",  label: "Settings",    icon: Settings  },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[120] bg-white dark:bg-slate-950 border-r border-blue-100 dark:border-slate-800 flex flex-col
          transition-all duration-300 ease-out shadow-xl lg:shadow-none
          ${isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20"}
        `}
      >
        <div className="p-5 lg:p-6 flex items-center justify-between lg:justify-center border-b border-blue-50 dark:border-slate-800 lg:border-0">
          <div className="flex items-center gap-3">
            {isOpen && (
              <span className="font-black text-xl text-blue-900 dark:text-blue-400 tracking-tight lg:hidden">
                Sabiskill
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-400 dark:text-blue-500 hover:text-blue-900 dark:hover:text-blue-400 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`group relative flex items-center w-full rounded-xl
                  transition-all duration-200 ease-out
                  ${isOpen ? "px-4 py-3.5 justify-start" : "px-0 py-3.5 justify-center lg:mx-auto lg:w-14"}
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 dark:bg-blue-600 dark:shadow-blue-600/30"
                    : "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-800 active:bg-blue-100 dark:active:bg-slate-700"
                  }`}
              >
                <item.icon
                  className={`transition-all duration-200 flex-shrink-0 ${isOpen ? "w-5 h-5" : "w-6 h-6"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {isOpen && (
                  <span className="ml-3.5 font-semibold text-[15px] tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white
                    text-xs font-semibold rounded-lg opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    whitespace-nowrap transition-all duration-200 pointer-events-none
                    shadow-lg hidden lg:block z-50">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-4px] border-4 border-transparent border-r-slate-900 dark:border-r-slate-800" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-3 border-t border-blue-100 dark:border-slate-800">
          <button
            onClick={handleSignOut}
            className={`group relative flex items-center w-full rounded-xl
              text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/30
              font-semibold transition-all duration-200 ease-out
              ${isOpen ? "px-4 py-3.5 justify-start" : "px-0 py-3.5 justify-center lg:mx-auto lg:w-14"}`}
          >
            <LogOut
              className={`transition-all duration-200 flex-shrink-0 ${isOpen ? "w-5 h-5" : "w-6 h-6"}`}
              strokeWidth={2}
            />
            {isOpen && (
              <span className="ml-3.5 text-[15px] tracking-tight whitespace-nowrap">
                Sign Out
              </span>
            )}
            {!isOpen && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white
                text-xs font-semibold rounded-lg opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                whitespace-nowrap transition-all duration-200 pointer-events-none
                shadow-lg hidden lg:block z-50">
                Sign Out
                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-4px] border-4 border-transparent border-r-slate-900 dark:border-r-slate-800" />
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;