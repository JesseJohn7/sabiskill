"use client";

import React, { useState, useEffect } from "react";
import {
  Rocket,
  ChevronRight,
  Play,
  Lock,
  CheckCircle2,
  Award,
  BookOpen,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Star,
} from "lucide-react";
import { ALL_COURSES, CourseDetail } from "./ExploreTab";
import type { CourseProgressDetail } from "../components/UseCourseProgress";
import { createClient } from "@/app/lib/supabase/client";
import { CertificateModal } from "./Certificatemodal";
import { CourseQuiz, hasPassedQuiz } from "../components/CourseQuiz";
import { StreakCard, StreakBar, recordStreakActivity } from "../components/Learningstreak";

interface HomeTabProps {
  onNavigate?: (tab: string) => void;
  onCourseSelect?: (courseId: string) => void;
  activeCourseId?: string | null;
  completedCourseIds?: string[];
  progressMap?: Record<string, CourseProgressDetail>;
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  bgAccent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
  bgAccent: string;
}) {
  return (
    <div className={`relative overflow-hidden flex items-center gap-3 ${bgAccent} rounded-2xl px-4 py-3.5 shadow-sm`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon className="w-4.5 h-4.5" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-current opacity-60 leading-none mb-0.5">{label}</p>
        <p className="text-xl font-black leading-none">{value}</p>
        {sub && <p className="text-[10px] font-medium opacity-60 mt-0.5 leading-tight">{sub}</p>}
      </div>
    </div>
  );
}

// ── Course card ───────────────────────────────────────────────────────────────
function CourseCard({
  course,
  status,
  progressPct,
  onOpen,
  onAction,
  onCertificate,
  compact = false,
}: {
  course: (typeof ALL_COURSES)[0];
  status: "completed" | "active" | "locked" | "available";
  progressPct: number;
  onOpen: () => void;
  onAction: (e: React.MouseEvent) => void;
  onCertificate?: (e: React.MouseEvent) => void;
  compact?: boolean;
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isActive = status === "active";
  const totalLessons = course.lessons;
  const lessonsDone = isCompleted
    ? totalLessons
    : Math.round((progressPct / 100) * totalLessons);

  return (
    <div
      onClick={onOpen}
      className={`group relative bg-white rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 flex flex-col h-full
        ${isLocked
          ? "border-slate-100 opacity-50"
          : isActive
          ? "border-blue-200 shadow-md shadow-blue-100/60 hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-1"
          : isCompleted
          ? "border-emerald-100 hover:shadow-xl hover:shadow-emerald-50 hover:-translate-y-1"
          : "border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"}`}
    >
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden bg-slate-100 flex-shrink-0"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isLocked ? "group-hover:scale-105" : ""}`}
        />

        {isLocked ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-[10px] font-bold text-center px-4 leading-snug">
              Finish active track first
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
              <Play className="w-4.5 h-4.5 text-blue-600 fill-current ml-0.5" />
            </div>
          </div>
        )}

        {/* Badges */}
        {isActive && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md">
            <CheckCircle2 className="w-2.5 h-2.5" /> Done
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-white/70" />
          <span className="text-[9px] font-semibold text-white">{totalLessons} lessons</span>
        </div>
        {!isLocked && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg">
            <span className="text-[9px] font-bold text-white">{progressPct}%</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`flex flex-col gap-2.5 flex-1 ${compact ? "p-3" : "p-3.5 sm:p-4"}`}>
        <div>
          <h3 className={`font-black text-slate-800 line-clamp-2 leading-snug mb-0.5 ${compact ? "text-[12px]" : "text-[13px] sm:text-[14px]"}`}>
            {course.title}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">by {course.instructor}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">
              {isCompleted ? "Completed" : isActive ? `${lessonsDone}/${totalLessons} done` : "Not started"}
            </span>
            {!isLocked && (
              <span className={`text-[10px] font-bold ${isCompleted ? "text-emerald-600" : isActive ? "text-blue-600" : "text-slate-300"}`}>
                {progressPct}%
              </span>
            )}
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isCompleted ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-200"
              }`}
              style={{ width: `${isLocked ? 0 : progressPct}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-1 space-y-1.5">
          {isLocked ? (
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              className="w-full bg-slate-50 text-slate-400 font-semibold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
            >
              <Play className="w-3 h-3" /> Preview
            </button>
          ) : isCompleted ? (
            <>
              <button
                onClick={onAction}
                className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 font-semibold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3 h-3" /> Review
              </button>
              {onCertificate && (
                <button
                  onClick={onCertificate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-200/60"
                >
                  <Award className="w-3 h-3" /> Get Certificate
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onAction}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm shadow-blue-100"
            >
              <Play className="w-3 h-3 fill-current" />
              {isActive ? "Continue" : "Start"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const COURSES_TO_SHOW = 8;

const HomeTab: React.FC<HomeTabProps> = ({
  onNavigate,
  onCourseSelect,
  activeCourseId = null,
  completedCourseIds = [],
  progressMap = {},
}) => {
  const [detailCourseId, setDetailCourseId] = useState<string | null>(null);
  const [autoPlayOnOpen, setAutoPlayOnOpen] = useState(false);
  const [extraReviews, setExtraReviews] = useState<
    Record<string, { name: string; rating: number; date: string; comment: string }[]>
  >({});
  const [firstName, setFirstName] = useState<string>("there");
  const [userId, setUserId] = useState<string>("");
  const [quizCourse, setQuizCourse] = useState<(typeof ALL_COURSES)[0] | null>(null);
  const [certCourse, setCertCourse] = useState<(typeof ALL_COURSES)[0] | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [greeting, setGreeting] = useState("Hello");
  const [earnedCertCourseIds, setEarnedCertCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
        if (fullName) {
          setFirstName(fullName.split(" ")[0]);
        } else if (user.email) {
          const emailPrefix = user.email.split("@")[0];
          const cleaned = emailPrefix.replace(/[._\-0-9]/g, " ").trim().split(" ")[0];
          setFirstName(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
        }
        const { data: certs } = await supabase
          .from("certificates")
          .select("course_id")
          .eq("user_id", user.id);
        if (certs) {
          setEarnedCertCourseIds(certs.map((c: { course_id: string }) => c.course_id));
        }
      }
    };
    fetchUser();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────
  const hasStartedCourse = activeCourseId !== null || completedCourseIds.length > 0;
  const activeCourse = ALL_COURSES.find((c) => c.id === activeCourseId) ?? null;
  const activeProgress = activeCourseId ? (progressMap[activeCourseId]?.progressPct ?? 0) : 0;
  const activeLessonsDone = activeCourse
    ? Math.round((activeProgress / 100) * activeCourse.lessons)
    : 0;

  const totalCompleted = completedCourseIds.length;
  const completedCourses = ALL_COURSES.filter((c) => completedCourseIds.includes(c.id));
  const earnedCertCount = earnedCertCourseIds.length;

  // Overall: per-active course progress (lessons done out of that course's total)
  const activeCourseTotalLessons = activeCourse?.lessons ?? 0;
  const activeCoursePct = activeCourseTotalLessons > 0
    ? Math.round((activeLessonsDone / activeCourseTotalLessons) * 100)
    : 0;

  const getStatus = (id: string): "completed" | "active" | "locked" | "available" => {
    if (completedCourseIds.includes(id)) return "completed";
    if (id === activeCourseId) return "active";
    if (activeCourseId && !completedCourseIds.includes(activeCourseId) && id !== activeCourseId)
      return "locked";
    return "available";
  };

  const handleCourseCardClick = (id: string) => { setAutoPlayOnOpen(false); setDetailCourseId(id); };
  const handleStartFromGrid = (id: string) => {
    if (getStatus(id) === "locked") return;
    if (getStatus(id) === "active" && userId) recordStreakActivity(userId);
    setAutoPlayOnOpen(true);
    setDetailCourseId(id);
  };
  const handleStartFromDetail = (id: string) => {
    if (getStatus(id) === "locked") return;
    if (onCourseSelect) onCourseSelect(id);
    setDetailCourseId(null);
  };
  const handleReviewSubmit = (id: string, review: { name: string; rating: number; comment: string }) => {
    setExtraReviews((prev) => ({ ...prev, [id]: [{ ...review, date: "Just now" }, ...(prev[id] || [])] }));
  };
  const openCertificate = (course: (typeof ALL_COURSES)[0]) => {
    setJustCompleted(false);
    if (hasPassedQuiz(course.id)) { setCertCourse(course); } else { setQuizCourse(course); }
  };

  // Courses to display in grid — completed first, then active, then rest (up to 8)
  const sortedCourses = [
    ...ALL_COURSES.filter((c) => completedCourseIds.includes(c.id)),
    ...ALL_COURSES.filter((c) => c.id === activeCourseId && !completedCourseIds.includes(c.id)),
    ...ALL_COURSES.filter((c) => !completedCourseIds.includes(c.id) && c.id !== activeCourseId),
  ];
  const visibleCourses = sortedCourses.slice(0, COURSES_TO_SHOW);
  const hasMore = ALL_COURSES.length > COURSES_TO_SHOW;

  // ── Detail view ────────────────────────────────────────────────────────
  if (detailCourseId) {
    const course = ALL_COURSES.find((c) => c.id === detailCourseId)!;
    return (
      <>
        <CourseDetail
          course={course}
          status={getStatus(detailCourseId)}
          reviews={extraReviews[detailCourseId] || []}
          onBack={() => setDetailCourseId(null)}
          onStart={handleStartFromDetail}
          onGetCertificate={openCertificate}
          onReviewSubmit={handleReviewSubmit}
          backLabel="Back to Home"
          autoPlayVideo={autoPlayOnOpen}
        />
        <CourseQuiz
          isOpen={!!quizCourse} courseId={quizCourse?.id ?? ""} courseTitle={quizCourse?.title ?? ""}
          onClose={() => setQuizCourse(null)}
          onPassed={() => { setCertCourse(quizCourse); setQuizCourse(null); }}
        />
        <CertificateModal
          isOpen={!!certCourse} onClose={() => setCertCourse(null)}
          courseTitle={certCourse?.title ?? ""} instructor={certCourse?.instructor ?? ""}
          justCompleted={justCompleted}
        />
      </>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-7 space-y-5 sm:space-y-8">

        {/* ── GREETING ── */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h1
              className="font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontSize: "clamp(22px, 5.5vw, 44px)" }}
            >
              {greeting},{" "}
              <span className="text-blue-600">{firstName}</span> 
            </h1>
            {hasStartedCourse && userId && (
              <div className="flex-shrink-0 pt-1">
                <StreakBar userId={userId} />
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-snug">
            {activeCourseId && !completedCourseIds.includes(activeCourseId)
              ? "Keep going , you're on an active track!"
              : hasStartedCourse
              ? "Great progress — keep the momentum going."
              : "Choose a track and start mastering a new skill today."}
          </p>
        </div>

        {/* ── STREAK CARD ── */}
        {hasStartedCourse && userId && <StreakCard userId={userId} />}

        {/* ── NO COURSE: HERO BANNER ── */}
        {!hasStartedCourse && (
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl text-white shadow-2xl">
            {/* dot grid */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "22px 22px" }}
            />
            {/* glow blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/25 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 p-5 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                {/* Text */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[11px] font-bold mb-4">
                    <Rocket className="w-3 h-3" /> Start your journey
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-3">
                    Choose a course.<br />
                    <span className="text-blue-400">Master a skill.</span>
                  </h2>
                  {/* Decorative line */}
                  <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                    <div className="h-0.5 w-8 bg-blue-400 rounded-full" />
                    <div className="h-0.5 w-4 bg-white/30 rounded-full" />
                    <div className="h-0.5 w-2 bg-white/15 rounded-full" />
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-sm mb-5 leading-relaxed mx-auto sm:mx-0">
                    Sequential, structured learning paths built for real results. Pick one track and build momentum from day one.
                  </p>
                  <button
                    onClick={() => onNavigate?.("explore")}
                    className="inline-flex items-center gap-2 bg-white text-slate-900 font-black px-6 py-3 rounded-full text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
                  >
                    Browse Tracks <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Thumbnail grid — desktop only */}
                <div className="hidden sm:grid grid-cols-2 gap-3 flex-shrink-0">
                  {ALL_COURSES.slice(0, 4).map((c, i) => (
                    <div
                      key={c.id}
                      onClick={() => handleCourseCardClick(c.id)}
                      className={`w-24 h-24 lg:w-28 lg:h-28 rounded-xl overflow-hidden border border-white/20 shadow-lg hover:scale-105 transition-transform cursor-pointer ${i % 2 === 0 ? "translate-y-2" : "-translate-y-2"}`}
                    >
                      <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE COURSE BANNER ── */}
        {activeCourseId && !completedCourseIds.includes(activeCourseId) && activeCourse && (
          <div className="flex items-center gap-3 bg-blue-600 rounded-2xl px-4 sm:px-5 py-3.5 shadow-lg shadow-blue-200/60">
            <div className="w-0.5 h-8 bg-white/30 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm font-semibold line-clamp-1">
                <span className="opacity-70 text-blue-200">Active: </span>
                <span className="font-black">{activeCourse.title}</span>
              </p>
              <p className="text-blue-200 text-[10px] font-medium mt-0.5">
                {activeLessonsDone} of {activeCourse.lessons} lessons · {activeProgress}% complete
              </p>
            </div>
            <button
              onClick={() => handleStartFromGrid(activeCourseId)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-white text-blue-700 text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Resume <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ── STATS GRID (only when course is active/in progress) ── */}
        {activeCourse && !completedCourseIds.includes(activeCourse.id) && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">

            {/* Course progress ring — spans 2 cols on mobile */}
            <div className="col-span-2 sm:col-span-1 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-5 shadow-lg shadow-blue-200/60 text-white flex items-center gap-3.5">
              <svg className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeWidth="14" />
              </svg>
              {/* Ring */}
              <div className="relative flex-shrink-0">
                <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                  <circle
                    cx="26" cy="26" r="20" fill="none" stroke="white" strokeWidth="5"
                    strokeDasharray={`${(activeCoursePct / 100) * 125.7} 125.7`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black">{activeCoursePct}%</span>
              </div>
              {/* Text */}
              <div className="min-w-0">
                <p className="text-blue-200 text-[9px] font-bold uppercase tracking-widest leading-none">My Progress</p>
                <p className="text-2xl font-black leading-none mt-1">
                  {activeLessonsDone}
                  <span className="text-blue-300 text-sm font-semibold">/{activeCourseTotalLessons}</span>
                </p>
                <p className="text-blue-200 text-[10px] font-medium mt-0.5 line-clamp-1">lessons in this course</p>
              </div>
            </div>

            {/* Completed courses */}
            <StatPill
              icon={CheckCircle2}
              label="Completed"
              value={totalCompleted}
              sub={totalCompleted === 1 ? "track done" : "tracks done"}
              accent="bg-emerald-500 text-white"
              bgAccent="bg-emerald-50 text-emerald-800"
            />

            {/* Certificates */}
            <StatPill
              icon={Award}
              label="Certificates"
              value={earnedCertCount}
              sub="earned"
              accent="bg-violet-500 text-white"
              bgAccent="bg-violet-50 text-violet-800"
            />

            {/* Lessons done */}
            <StatPill
              icon={BookOpen}
              label="Lessons"
              value={activeLessonsDone}
              sub={`of ${activeCourseTotalLessons} total`}
              accent="bg-amber-500 text-white"
              bgAccent="bg-amber-50 text-amber-800"
            />
          </div>
        )}

        {/* ── STATS GRID (completed courses only, no active) ── */}
        {!activeCourse && completedCourses.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <StatPill icon={CheckCircle2} label="Completed" value={totalCompleted} sub="tracks done"
              accent="bg-emerald-500 text-white" bgAccent="bg-emerald-50 text-emerald-800" />
            <StatPill icon={Award} label="Certificates" value={earnedCertCount} sub="earned"
              accent="bg-violet-500 text-white" bgAccent="bg-violet-50 text-violet-800" />
            <StatPill icon={BookOpen} label="Lessons" value={completedCourses.reduce((a, c) => a + c.lessons, 0)} sub="completed"
              accent="bg-amber-500 text-white" bgAccent="bg-amber-50 text-amber-800" />
          </div>
        )}

        {/* ── CONTINUE LEARNING (active course hero card) ── */}
        {activeCourse && !completedCourseIds.includes(activeCourse.id) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-black text-slate-900">Continue Learning</h2>
              <button
                onClick={() => handleCourseCardClick(activeCourse.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group"
              >
                Details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div
              className="bg-white border border-blue-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-md shadow-blue-50 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 group/hero cursor-pointer"
              onClick={() => handleCourseCardClick(activeCourse.id)}
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-hidden bg-slate-900" style={{ aspectRatio: "16/9" }}>
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/hero:opacity-95 group-hover/hero:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent sm:bg-gradient-to-r" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartFromGrid(activeCourse.id); }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-13 h-13 rounded-full bg-white/20 hover:bg-white/40 border-2 border-white/50 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 shadow-2xl w-12 h-12">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </button>
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Active
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-4 sm:p-5 lg:p-7 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight mb-1">
                    {activeCourse.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mb-4">by {activeCourse.instructor}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-600">
                        <span className="font-black text-slate-800">{activeLessonsDone}</span>
                        {" "}<span className="text-slate-400">of</span>{" "}
                        <span className="font-black text-slate-800">{activeCourse.lessons}</span>
                        {" "}<span className="text-slate-400">lessons</span>
                      </span>
                      <span className="text-xs font-black text-blue-600">{activeProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
                        style={{ width: `${activeProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Up next</p>
                      <p className="text-[11px] font-black text-slate-700">
                        Lesson {activeLessonsDone + 1} of {activeCourse.lessons}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartFromGrid(activeCourse.id); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:scale-95 shadow-md shadow-blue-200/60"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Resume Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPLETED COURSES (horizontal scroll on mobile) ── */}
        {completedCourses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900">Completed</h2>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {completedCourses.length} course{completedCourses.length !== 1 ? "s" : ""} finished
                </p>
              </div>
            </div>
            {/* Mobile: horizontal scroll; sm+: grid */}
            <div className="flex gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory -mx-3 px-3 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:overflow-visible sm:gap-4">
              {completedCourses.map((c) => (
                <div key={c.id} className="flex-shrink-0 w-[72vw] max-w-[260px] sm:w-auto sm:max-w-none snap-start">
                  <CourseCard
                    course={c}
                    status="completed"
                    progressPct={100}
                    onOpen={() => handleCourseCardClick(c.id)}
                    onAction={(e) => { e.stopPropagation(); handleStartFromGrid(c.id); }}
                    onCertificate={(e) => { e.stopPropagation(); openCertificate(c); }}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALL LEARNING TRACKS (8 shown) ── */}
        <div>run dev
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">Learning Tracks</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {ALL_COURSES.length} tracks available
              </p>
            </div>
            {hasMore && (
              <button
                onClick={() => onNavigate?.("explore")}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
            {visibleCourses.map((c) => {
              const status = getStatus(c.id);
              const progressPct = status === "completed" ? 100 : (progressMap[c.id]?.progressPct ?? 0);
              return (
                <CourseCard
                  key={c.id}
                  course={c}
                  status={status}
                  progressPct={progressPct}
                  onOpen={() => handleCourseCardClick(c.id)}
                  onAction={(e) => { e.stopPropagation(); handleStartFromGrid(c.id); }}
                  onCertificate={(e) => { e.stopPropagation(); openCertificate(c); }}
                  compact
                />
              );
            })}
          </div>

          {/* View All button — visible on mobile below grid */}
          {hasMore && (
            <button
              onClick={() => onNavigate?.("explore")}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 bg-white font-bold text-sm hover:bg-slate-50 transition-all active:scale-95 sm:hidden"
            >
              View All Courses <ChevronRight className="w-4 h-4" />
            </button>
          )}
          {/* sm+ view all link */}
          {hasMore && (
            <div className="hidden sm:flex justify-center mt-5">
              <button
                onClick={() => onNavigate?.("explore")}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group"
              >
                View all Courses  
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* ── START STREAK PROMPT (no courses started) ── */}
        {!hasStartedCourse && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 text-center shadow-sm">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-slate-900 mb-1.5">Start Your Learning Streak</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mb-4 leading-relaxed">
              Pick a track above and build a daily habit. Your streak and progress will appear right here.
            </p>
            <button
              onClick={() => onNavigate?.("explore")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm shadow-blue-200 active:scale-95"
            >
              Explore All Courses <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* ── MODALS ── */}
      <CourseQuiz
        isOpen={!!quizCourse} courseId={quizCourse?.id ?? ""} courseTitle={quizCourse?.title ?? ""}
        onClose={() => setQuizCourse(null)}
        onPassed={() => { setCertCourse(quizCourse); setQuizCourse(null); }}
      />
      <CertificateModal
        isOpen={!!certCourse} onClose={() => setCertCourse(null)}
        courseTitle={certCourse?.title ?? ""} instructor={certCourse?.instructor ?? ""}
        justCompleted={justCompleted}
      />
    </div>
  );
};

export default HomeTab;