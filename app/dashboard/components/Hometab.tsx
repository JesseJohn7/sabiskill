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
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon className="w-[17px] h-[17px]" strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">{label}</p>
        <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
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
}: {
  course: (typeof ALL_COURSES)[0];
  status: "completed" | "active" | "locked" | "available";
  progressPct: number;
  onOpen: () => void;
  onAction: (e: React.MouseEvent) => void;
  onCertificate?: (e: React.MouseEvent) => void;
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
          ? "border-slate-100 opacity-55"
          : isActive
          ? "border-blue-200 shadow-md shadow-blue-100/50 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1"
          : isCompleted
          ? "border-emerald-100 hover:shadow-xl hover:shadow-emerald-50/80 hover:-translate-y-1"
          : "border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-slate-100 flex-shrink-0" style={{ aspectRatio: "16/9" }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${!isLocked ? "group-hover:scale-105" : ""}`}
        />
        {isLocked ? (
          <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-[9px] font-bold text-center px-4 leading-snug">
              Complete active track first
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-xl">
              <Play className="w-4 h-4 text-blue-600 fill-current ml-0.5" />
            </div>
          </div>
        )}
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
        <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-lg flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-slate-300" />
          <span className="text-[9px] font-semibold text-white">{totalLessons} lessons</span>
        </div>
        {!isLocked && (
          <div className="absolute bottom-2 right-2 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-lg">
            <span className="text-[9px] font-bold text-white">{progressPct}%</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="font-black text-[13px] sm:text-sm text-slate-800 line-clamp-1 leading-snug mb-0.5">
            {course.title}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">by {course.instructor}</p>
        </div>

        {/* Dynamic lesson count */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500">
              {isCompleted ? "All lessons done" : isActive ? `${lessonsDone} of ${totalLessons}` : "Not started"}
            </span>
            {!isLocked && (
              <span className={`text-[10px] font-bold ${isCompleted ? "text-emerald-600" : isActive ? "text-blue-600" : "text-slate-400"}`}>
                {lessonsDone}/{totalLessons}
              </span>
            )}
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${isCompleted ? "bg-emerald-500" : isActive ? "bg-blue-500" : "bg-slate-200"}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto space-y-1.5 pt-0.5">
          {isLocked ? (
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(); }}
              className="w-full bg-slate-50 text-slate-400 font-semibold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors"
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
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-200/60"
                >
                  <Award className="w-3 h-3" /> Certificate
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onAction}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm shadow-blue-100"
            >
              <Play className="w-3 h-3 fill-current" />
              {isActive ? "Continue" : "Get Started"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
      }
    };
    fetchUser();
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────
  const hasStartedCourse = activeCourseId !== null || completedCourseIds.length > 0;
  const activeCourse = ALL_COURSES.find((c) => c.id === activeCourseId) ?? null;
  const activeProgress = activeCourseId ? (progressMap[activeCourseId]?.progressPct ?? 0) : 0;
  const activeLessonsDone = activeCourse ? Math.round((activeProgress / 100) * activeCourse.lessons) : 0;
  const totalCompleted = completedCourseIds.length;
  const completedCourses = ALL_COURSES.filter((c) => completedCourseIds.includes(c.id));
  const completedLessonsCount =
    completedCourses.reduce((acc, c) => acc + c.lessons, 0) +
    (activeCourse ? Math.round((activeProgress / 100) * activeCourse.lessons) : 0);
  const totalLessonsCount = ALL_COURSES.reduce((acc, c) => acc + c.lessons, 0);
  const overallPct = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

  const getStatus = (id: string): "completed" | "active" | "locked" | "available" => {
    if (completedCourseIds.includes(id)) return "completed";
    if (id === activeCourseId) return "active";
    if (activeCourseId && !completedCourseIds.includes(activeCourseId) && id !== activeCourseId) return "locked";
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
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-7 space-y-5 sm:space-y-7">

        {/* ── GREETING ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-0.5 sm:mb-1">
              {greeting}
            </p>
            <h1 className="text-xl sm:text-2xl md:text-[28px] font-black text-slate-900 leading-tight tracking-tight">
              {firstName}&nbsp;
              <span className="font-normal text-slate-400 text-lg sm:text-xl">👋</span>
            </h1>
            <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1 leading-snug max-w-xs sm:max-w-none">
              {activeCourseId && !completedCourseIds.includes(activeCourseId)
                ? "Complete your active track to unlock more courses."
                : hasStartedCourse
                ? "You're making great progress — keep it up!"
                : "Pick a track and begin your learning journey."}
            </p>
          </div>
          {hasStartedCourse && userId && (
            <div className="flex-shrink-0 mt-0.5">
              <StreakBar userId={userId} />
            </div>
          )}
        </div>

        {/* ── STREAK CARD ── */}
        {hasStartedCourse && userId && <StreakCard userId={userId} />}

        {/* ── ACTIVE COURSE ALERT ── */}
        {activeCourseId && !completedCourseIds.includes(activeCourseId) && activeCourse && (
          <div className="flex items-center gap-3 bg-blue-600 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-lg shadow-blue-200/60">
            <div className="w-0.5 h-7 bg-white/30 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-[11px] sm:text-sm font-semibold truncate">
                Active: <span className="font-black">{activeCourse.title}</span>
              </p>
              <p className="text-blue-200 text-[10px] font-medium mt-0.5">
                {activeLessonsDone} of {activeCourse.lessons} lessons · {activeProgress}% done
              </p>
            </div>
            <button
              onClick={() => handleStartFromGrid(activeCourseId)}
              className="flex-shrink-0 flex items-center gap-1 bg-white text-blue-700 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Resume <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ── STAT CARDS ── */}
        {hasStartedCourse && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="col-span-2 lg:col-span-1 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-5 shadow-lg shadow-blue-200/60 text-white flex items-center gap-3 sm:gap-4">
              <svg className="absolute -right-5 -bottom-5 w-28 h-28 opacity-10" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeWidth="16" />
              </svg>
              <div className="relative flex-shrink-0">
                <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                  <circle
                    cx="24" cy="24" r="18" fill="none" stroke="white" strokeWidth="5"
                    strokeDasharray={`${(overallPct / 100) * 113.1} 113.1`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.9s ease" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black">{overallPct}%</span>
              </div>
              <div className="min-w-0">
                <p className="text-blue-200 text-[9px] font-bold uppercase tracking-widest leading-none">Overall</p>
                <p className="text-2xl sm:text-[26px] font-black leading-none mt-1">
                  {completedLessonsCount}
                  <span className="text-blue-300 text-xs sm:text-sm font-semibold">/{totalLessonsCount}</span>
                </p>
                <p className="text-blue-200 text-[10px] font-medium mt-0.5">lessons done</p>
              </div>
            </div>

            <StatPill icon={CheckCircle2} label="Completed" value={totalCompleted} sub="tracks finished" accent="bg-emerald-50 text-emerald-600" />
            <StatPill icon={Award} label="Certificates" value={totalCompleted} sub="earned" accent="bg-violet-50 text-violet-600" />
            <StatPill icon={BookOpen} label="Lessons" value={completedLessonsCount} sub={`of ${totalLessonsCount} total`} accent="bg-amber-50 text-amber-600" />
          </div>
        )}

        {/* ── CONTINUE LEARNING / HERO ── */}
        {activeCourse && !completedCourseIds.includes(activeCourse.id) ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] sm:text-[15px] font-black text-slate-900">Continue Learning</h2>
              <button
                onClick={() => handleCourseCardClick(activeCourse.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 group"
              >
                View details <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group/card">
              <div className="relative w-full sm:w-52 lg:w-72 h-40 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-900">
                <img
                  src={activeCourse.thumbnail}
                  alt={activeCourse.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover/card:opacity-90 group-hover/card:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />
                <button
                  onClick={() => handleStartFromGrid(activeCourse.id)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/35 border-2 border-white/50 flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110 shadow-2xl">
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </button>
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Active
                </div>
              </div>

              <div className="flex-1 p-4 sm:p-5 lg:p-7 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight mb-1">
                    {activeCourse.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium mb-4">
                    by {activeCourse.instructor}
                  </p>

                  {/* Dynamic lesson progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-600">
                        <span className="font-black text-slate-800">{activeLessonsDone}</span>
                        {" "}<span className="text-slate-400">of</span>{" "}
                        <span className="font-black text-slate-800">{activeCourse.lessons}</span>
                        {" "}<span className="text-slate-400">lessons completed</span>
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
                      <p className="text-[11px] sm:text-xs font-black text-slate-700">
                        Lesson {activeLessonsDone + 1} of {activeCourse.lessons}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleStartFromGrid(activeCourse.id)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all hover:-translate-y-0.5 active:scale-95 shadow-md shadow-blue-200/60"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !hasStartedCourse ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
            <div className="absolute top-0 right-0 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs font-bold mb-4">
                  <Rocket className="w-3 h-3" /> Get started
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight mb-3">
                  Master your next<br /><span className="text-blue-400">Skill Path</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-sm mb-5 leading-relaxed mx-auto sm:mx-0">
                  Sequential learning tracks built for focus. Start one to unlock your progress dashboard.
                </p>
                <button
                  onClick={() => onNavigate?.("explore")}
                  className="inline-flex items-center gap-2 bg-white text-slate-900 font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
                >
                  Browse Tracks <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-2.5 flex-shrink-0">
                {ALL_COURSES.slice(0, 4).map((c, i) => (
                  <div
                    key={c.id}
                    onClick={() => handleCourseCardClick(c.id)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border border-white/20 shadow-lg hover:scale-105 transition-transform cursor-pointer ${i % 2 === 0 ? "translate-y-2" : "-translate-y-2"}`}
                  >
                    <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* ── ALL LEARNING TRACKS ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[14px] sm:text-[15px] font-black text-slate-900">Learning Tracks</h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">{ALL_COURSES.length} tracks available</p>
            </div>
            <button
              onClick={() => onNavigate?.("explore")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 rounded-xl transition-all group"
            >
              View All <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
            {ALL_COURSES.map((c) => {
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
                />
              );
            })}
          </div>

          <button
            onClick={() => onNavigate?.("explore")}
            className="sm:hidden w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 bg-white font-semibold text-sm hover:bg-slate-50 transition-all"
          >
            View All Tracks <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* ── NO STREAK PROMPT ── */}
        {!hasStartedCourse && (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 text-center shadow-sm">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-sm font-black text-slate-900 mb-1">Start Your Learning Streak</h3>
            <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto mb-4">Begin a course to track daily progress and build momentum.</p>
            <button
              onClick={() => onNavigate?.("explore")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm shadow-blue-200"
            >
              Explore Courses <ArrowUpRight className="w-3.5 h-3.5" />
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