"use client";

import React, { useState, useEffect } from "react";
import { Search, User, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  lessons: number;
}

interface Props {
  toggleSidebar: () => void;
  onCourseSelect?: (courseId: string) => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}
const COURSES: Course[] = [
  {
    id: "webdev",
    title: "Complete Web Development",
    thumbnail: "https://i.ytimg.com/vi/HGTJBPNC-Gw/maxresdefault.jpg",
    lessons: 37,
  },
  {
    id: "design",
    title: "UI/UX Design Fundamentals",
    thumbnail: "https://i.ytimg.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg",
    lessons: 14,
  },
  {
    id: "crypto",
    title: "Cryptocurrency & Blockchain",
    thumbnail: "https://i.ytimg.com/vi/SSo_EIwHSd4/maxresdefault.jpg",
    lessons: 8,
  },
  {
    id: "speaking",
    title: "Public Speaking Mastery",
    thumbnail: "https://i.ytimg.com/vi/w82a1FT5o88/maxresdefault.jpg",
    lessons: 15,
  },
  {
    id: "personal",
    title: "Personal Development & Growth",
    thumbnail: "https://i.ytimg.com/vi/75d_29QWELk/maxresdefault.jpg",
    lessons: 10,
  },
];

const Header: React.FC<Props> = ({
  toggleSidebar,
  onCourseSelect,
  onNotificationClick,
  onSettingsClick, // <-- add this
}) =>  {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filtered = COURSES.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
    setShowResults(true);
  }, [searchQuery]);

  const handleCourseClick = (courseId: string) => {
    if (onCourseSelect) {
      onCourseSelect(courseId);
    }

    setSearchQuery("");
    setShowResults(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
      <div className="h-16 sm:h-18 lg:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          
          {/* Mobile Menu */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative w-full max-w-full sm:max-w-md lg:max-w-2xl">
            
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />

            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm sm:text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600/20 focus:bg-white dark:focus:bg-slate-800 focus:border-blue-600/40 transition-all outline-none"
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              </button>
            )}

            {/* Dropdown */}
            {showResults && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowResults(false)}
                />

                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 max-h-[420px] overflow-y-auto">
                  
                  {searchResults.length > 0 ? (
                    <>
                      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                          Courses ({searchResults.length})
                        </p>
                      </div>

                      {searchResults.map((course) => (
                        <button
                          key={course.id}
                          onClick={() => handleCourseClick(course.id)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0 text-left"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-16 h-10 object-cover rounded-lg"
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50 truncate">
                              {course.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {course.lessons} lessons
                            </p>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        No courses found
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Try another keyword
                      </p>
                    </div>
                  )}

                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          <button
            onClick={onSettingsClick}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
          >
            <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;