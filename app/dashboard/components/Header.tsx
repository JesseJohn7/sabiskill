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

const Header: React.FC<Props> = ({ toggleSidebar, onCourseSelect, onNotificationClick }) => {
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
    <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 sm:p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-2xl">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            className="w-full pl-9 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 lg:py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:bg-white focus:border-blue-600/50 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showResults && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowResults(false)}
              ></div>

              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        Courses ({searchResults.length})
                      </p>
                    </div>
                    {searchResults.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleCourseClick(course.id)}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 text-left"
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-10 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {course.title}
                          </p>
                          <p className="text-xs text-slate-600">
                            {course.lessons} lessons
                          </p>
                        </div>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-slate-600 font-medium">
                      No courses found for "{searchQuery}"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        <button
          onClick={() => router.push("/settings")}
          className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
          aria-label="Go to settings"
        >
          <User className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;