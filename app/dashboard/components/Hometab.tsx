"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  ChevronRight,
  Play,
  Clock,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { ALL_COURSES, CourseDetail } from "./ExploreTab";
import { createClient } from "@/app/lib/supabase/client";

interface HomeTabProps {
  onNavigate?: (tab: string) => void;
  /** Called when user starts/continues a course — lifts courseId up */
  onCourseSelect?: (courseId: string) => void;
  activeCourseId?: string | null;
  completedCourseIds?: string[];
}

const HomeTab: React.FC<HomeTabProps> = ({
  onNavigate,
  onCourseSelect,
  activeCourseId = null,
  completedCourseIds = [],
}) => {
  const [detailCourseId, setDetailCourseId] = useState<string | null>(null);
  const [autoPlayOnOpen, setAutoPlayOnOpen] = useState(false);
  const [extraReviews, setExtraReviews] = useState<
    Record<string, { name: string; rating: number; date: string; comment: string }[]>
  >({});
  const [firstName, setFirstName] = useState<string>("there");

  // ── Fetch logged-in user's first name from Supabase ──────────────────
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "";

        if (fullName) {
          setFirstName(fullName.split(" ")[0]);
        } else if (user.email) {
          const emailPrefix = user.email.split("@")[0];
          const cleaned = emailPrefix
            .replace(/[._\-0-9]/g, " ")
            .trim()
            .split(" ")[0];
          setFirstName(
            cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
          );
        }
      }
    };

    fetchUser();
  }, []);

  const handleExploreClick = () => {
    if (onNavigate) onNavigate("explore");
  };

  const getStatus = (
    id: string
  ): "completed" | "active" | "locked" | "available" => {
    if (completedCourseIds.includes(id)) return "completed";
    if (id === activeCourseId) return "active";
    if (
      activeCourseId &&
      !completedCourseIds.includes(activeCourseId) &&
      id !== activeCourseId
    )
      return "locked";
    return "available";
  };

  const handleCourseCardClick = (courseId: string) => {
    setAutoPlayOnOpen(false);
    setDetailCourseId(courseId);
  };

  const handleStartFromGrid = (courseId: string) => {
    const status = getStatus(courseId);
    if (status === "locked") return;
    setAutoPlayOnOpen(true);
    setDetailCourseId(courseId);
  };

  // ── Write course progress to Supabase when user starts/continues ──────
  // ── Tell the parent (DashboardPage) to handle saving + navigation ──────
  const handleStartFromDetail = (courseId: string) => {
    const status = getStatus(courseId);
    if (status === "locked") return;
    if (onCourseSelect) onCourseSelect(courseId); // DashboardPage saves to Supabase
    setDetailCourseId(null);
  };


  const handleReviewSubmit = (
    courseId: string,
    review: { name: string; rating: number; comment: string }
  ) => {
    setExtraReviews((prev) => ({
      ...prev,
      [courseId]: [{ ...review, date: "Just now" }, ...(prev[courseId] || [])],
    }));
  };

  // ── Course Detail View ─────────────────────────────────────────────────
  if (detailCourseId) {
    const course = ALL_COURSES.find((c) => c.id === detailCourseId)!;
    const userReviews = extraReviews[detailCourseId] || [];
    return (
      <CourseDetail
        course={course}
        status={getStatus(detailCourseId)}
        reviews={userReviews}
        onBack={() => setDetailCourseId(null)}
        onStart={handleStartFromDetail}
        onReviewSubmit={handleReviewSubmit}
        backLabel="Back to Home"
        autoPlayVideo={autoPlayOnOpen}
      />
    );
  }

  const recentCourses = [
    ...ALL_COURSES.filter((c) => c.id === activeCourseId),
    ...ALL_COURSES.filter((c) => completedCourseIds.includes(c.id)),
  ];
  const hasRecents = recentCourses.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-4 sm:mb-6 md:mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl md:text-2xl lg:text-4xl font-black text-black leading-tight">
            Hello, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            {activeCourseId && !completedCourseIds.includes(activeCourseId)
              ? "You have an active course — finish it to unlock more tracks."
              : "Continue mastering your next skill today"}
          </p>
        </div>
      </div>

      {/* Active course warning banner */}
      {activeCourseId &&
        !completedCourseIds.includes(activeCourseId) &&
        (() => {
          const active = ALL_COURSES.find((c) => c.id === activeCourseId);
          return active ? (
            <div className="max-w-7xl mx-auto mb-5 sm:mb-6">
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <p className="text-xs sm:text-sm text-blue-700 font-semibold">
                  You're currently on{" "}
                  <span className="font-black">{active.title}</span>. Complete
                  it to unlock other tracks.
                </p>
                <button
                  onClick={() => handleStartFromGrid(activeCourseId)}
                  className="ml-auto flex-shrink-0 flex items-center gap-1 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : null;
        })()}

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto mb-5 sm:mb-6 md:mb-8">
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-blue-100/50 transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></div>
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(37, 99, 235) 1px, transparent 0)`,
                backgroundSize: "32px 32px",
              }}
            ></div>
          </div>
          <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-6 lg:gap-8">
              <div className="flex-1 text-center lg:text-left space-y-3 sm:space-y-4 md:space-y-5 w-full">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-blue-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm">
                  <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Get Started</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-slate-900 leading-tight">
                  Master your next{" "}
                  <span className="text-blue-600 relative inline-block">
                    Skill Path
                    <svg
                      className="absolute -bottom-1 left-0 w-full h-2 sm:h-3"
                      viewBox="0 0 200 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,5 Q50,0 100,5 T200,5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        opacity="0.3"
                      />
                    </svg>
                  </span>
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-md lg:max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Curated tutorials in linear learning paths. Start one to
                  unlock your progress.
                </p>
                <div className="pt-1 sm:pt-2">
                  <button
                    onClick={handleExploreClick}
                    className="group w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Find Your First Track</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-2.5 sm:gap-3 flex-shrink-0">
                {ALL_COURSES.slice(0, 4).map((c, i) => (
                  <div
                    key={i}
                    onClick={() => handleCourseCardClick(c.id)}
                    className={`relative w-20 h-20 xl:w-24 xl:h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer ${
                      i % 2 === 0 ? "translate-y-2" : "-translate-y-2"
                    }`}
                  >
                    <img
                      src={c.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recently Started Section ── */}
      {hasRecents && (
        <div className="max-w-7xl mx-auto mb-7 sm:mb-8">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-slate-800">
              Recently Started
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {recentCourses.map((c) => {
              const isCompleted = completedCourseIds.includes(c.id);
              const isActive = c.id === activeCourseId;
              const progress = isCompleted ? 100 : isActive ? 40 : 0;

              return (
                <div
                  key={c.id}
                  onClick={() => handleCourseCardClick(c.id)}
                  className={`group bg-white rounded-xl sm:rounded-2xl border shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer
                    ${
                      isActive
                        ? "border-blue-300 ring-2 ring-blue-400 ring-offset-1"
                        : "border-emerald-200 hover:border-emerald-300"
                    }`}
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-video">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
                        <Play className="w-4 h-4 text-blue-600 fill-current ml-0.5" />
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1 shadow">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                        In Progress
                      </div>
                    )}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-emerald-900/20 flex items-end justify-end p-2">
                        <div className="bg-white rounded-full p-1 shadow">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-[10px] font-semibold text-white">
                        {c.lessons} lessons
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="font-black text-sm sm:text-base text-slate-800 line-clamp-1">
                      {c.title}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="text-slate-600 font-semibold">
                          {isCompleted ? "Completed" : "In progress"}
                        </span>
                        <span className="text-slate-500 font-bold">
                          {progress}% complete
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartFromGrid(c.id);
                      }}
                      className={`w-full font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs
                        ${
                          isCompleted
                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Review
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />{" "}
                          Continue
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Learning Tracks Section ── */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-slate-800">
            Learning Tracks
          </h2>
          <button
            onClick={handleExploreClick}
            className="group hidden sm:flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-semibold text-[10px] sm:text-xs transition-all"
          >
            View All
            <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {ALL_COURSES.map((c) => {
            const status = getStatus(c.id);
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            const isActive = status === "active";
            const progress = isCompleted ? 100 : isActive ? 40 : 0;

            return (
              <div
                key={c.id}
                onClick={() => handleCourseCardClick(c.id)}
                className={`group bg-white rounded-xl sm:rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col cursor-pointer
                  ${
                    isLocked
                      ? "border-slate-200 opacity-60"
                      : isActive
                      ? "border-blue-300 ring-2 ring-blue-400 ring-offset-1 hover:shadow-xl"
                      : isCompleted
                      ? "border-emerald-200 hover:border-emerald-300 hover:shadow-xl"
                      : "border-slate-200 hover:border-blue-200 hover:shadow-xl"
                  }`}
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-video">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        !isLocked ? "group-hover:scale-105" : ""
                      }`}
                    />
                  </div>

                  {!isLocked && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
                        <Play className="w-4 h-4 text-blue-600 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {isLocked && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                      <Lock className="w-6 h-6 text-white" />
                      <span className="text-white text-[10px] font-bold text-center px-2">
                        Finish active track first
                      </span>
                    </div>
                  )}

                  {isActive && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-1 rounded-full flex items-center gap-1 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                      In Progress
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg shadow-md">
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        isCompleted
                          ? "bg-emerald-500"
                          : isActive
                          ? "bg-blue-500"
                          : "bg-slate-300"
                      }`}
                    ></div>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700">
                      {progress}%
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                    <span className="text-[10px] sm:text-xs font-semibold text-white">
                      {c.lessons} lessons
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3 sm:space-y-4 flex flex-col flex-1">
                  <h3 className="font-black text-sm sm:text-base md:text-lg text-slate-800 line-clamp-1">
                    {c.title}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                      <span className="text-slate-600 font-semibold">
                        {isCompleted
                          ? "Completed"
                          : isActive
                          ? "In progress"
                          : "Not started"}
                      </span>
                      <span className="text-slate-500 font-bold">
                        {progress}% complete
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isActive
                            ? "bg-blue-500"
                            : "bg-slate-300"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-auto">
                    {isLocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseCardClick(c.id);
                        }}
                        className="w-full bg-slate-100 text-slate-500 font-semibold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" /> Preview Course
                      </button>
                    ) : isCompleted ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartFromGrid(c.id);
                        }}
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold py-2.5 sm:py-3 rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{" "}
                        Review Course
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartFromGrid(c.id);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm"
                      >
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                        {isActive ? "Continue" : "Get Started"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleExploreClick}
          className="sm:hidden w-full mt-3 sm:mt-4 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all"
        >
          View All Tracks
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default HomeTab;