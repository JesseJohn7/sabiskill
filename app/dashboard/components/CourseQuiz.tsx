"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Brain, CheckCircle2, XCircle, ChevronRight, Loader2,
  Trophy, RotateCcw, ArrowRight, RefreshCw, X, Lock, Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
}

interface QuizResult {
  passed: boolean;
  score: number;
  total: number;
  weakTopics: string[];
}

export interface CourseQuizProps {
  isOpen: boolean;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  /** Called when student passes — open CertificateModal here */
  onPassed: () => void;
}

// ─── Per-course Claude prompt seeds ──────────────────────────────────────────
const COURSE_CONFIG: Record<string, string> = {
  "react-js":           "You are a React JS expert examiner. Generate ONE practical quiz question testing genuine understanding of React. Topics: JSX, functional components, useState, useEffect, props, React Router, CRUD with Fetch, Context API, Easy Peasy Redux. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "javascript":         "You are a JavaScript expert examiner. Generate ONE practical quiz question testing modern JS understanding. Topics: closures, scope, async/await, promises, event loop, ES6+, DOM, error handling. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "web-dev":            "You are a web dev expert examiner. Generate ONE practical quiz question on HTML, CSS, JavaScript, responsive design, APIs, or Git. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "python-ai":          "You are a Python expert examiner. Generate ONE practical quiz question on Python for AI/dev: syntax, data structures, OOP, virtual environments, APIs, Git. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "ui-ux":              "You are a UI/UX expert examiner. Generate ONE practical quiz question about design thinking, user research, wireframing, color theory, or typography. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "crypto":             "You are a blockchain/crypto expert examiner. Generate ONE practical quiz question about blockchain, Bitcoin, Ethereum, DeFi, wallets, or NFTs. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "solidity-web3":      "You are a Solidity/Web3 expert examiner. Generate ONE practical quiz question about Solidity, smart contracts, Hardhat, Ethers.js, or building dApps. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "digital-marketing":  "You are a digital marketing expert examiner. Generate ONE practical quiz question about marketing strategy, organic vs paid, direct response, B2B/B2C, or search vs discovery. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
  "social-media-mgmt":  "You are a social media management expert examiner. Generate ONE practical quiz question about client onboarding, pricing, content calendars, audits, or discovery calls. Return ONLY valid JSON, no markdown: {\"text\":\"...\",\"options\":[\"A\",\"B\",\"C\",\"D\"],\"correctIndex\":0,\"topic\":\"...\",\"explanation\":\"...\"}",
};

const PASS_THRESHOLD = 8;
const TOTAL = 10;

const FALLBACK: Question = {
  id: "fallback",
  text: "What is the primary purpose of the useEffect hook in React?",
  options: ["To create component state", "To perform side effects after rendering", "To pass data between components", "To memoize expensive calculations"],
  correctIndex: 1,
  topic: "useEffect Hook",
  explanation: "useEffect runs after renders and is the correct place for side effects like data fetching, subscriptions, or DOM updates.",
};

// ─── API call ─────────────────────────────────────────────────────────────────
async function fetchQuestion(seed: string, coveredTopics: string[], wrongTopic?: string): Promise<Question | null> {
  try {
    const hint = wrongTopic
      ? `The student just got a question wrong about "${wrongTopic}". Focus on "${wrongTopic}" to reinforce it.`
      : `Topics already used: ${coveredTopics.join(", ") || "none"}. Pick a DIFFERENT topic.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: `${seed}\n\n${hint}` }],
      }),
    });
    const data = await res.json();
    const raw = data.content?.find((b: any) => b.type === "text")?.text ?? "";
    const obj = JSON.parse(raw.replace(/```json|```/g, "").trim());
    if (!obj.text || !Array.isArray(obj.options) || obj.options.length !== 4) return null;
    return { id: Math.random().toString(36).slice(2), ...obj };
  } catch {
    return null;
  }
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ total, current, answers }: { total: number; current: number; answers: { correct: boolean }[] }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all duration-300 ${
          i < answers.length
            ? answers[i].correct ? "w-2.5 h-2.5 bg-emerald-400" : "w-2.5 h-2.5 bg-rose-400"
            : i === current ? "w-4 h-2.5 bg-blue-500" : "w-2.5 h-2.5 bg-slate-200"
        }`} />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CourseQuiz({ isOpen, courseId, courseTitle, onClose, onPassed }: CourseQuizProps) {
  const seed = COURSE_CONFIG[courseId] ?? COURSE_CONFIG["react-js"];

  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; topic: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  const coveredTopics = useRef<string[]>([]);
  const lastWrongTopic = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setQuestions([]);
      setCurrentIdx(0);
      setSelected(null);
      setRevealed(false);
      setAnswers([]);
      setResult(null);
      setIsFollowUp(false);
      coveredTopics.current = [];
      lastWrongTopic.current = undefined;
    }
  }, [isOpen, quizKey]);

  const loadQuestion = useCallback(async (wrongTopic?: string) => {
    setLoading(true);
    setSelected(null);
    setRevealed(false);
    const q = await fetchQuestion(seed, coveredTopics.current, wrongTopic);
    const question = q ?? FALLBACK;
    coveredTopics.current.push(question.topic);
    setQuestions((prev) => [...prev, question]);
    setLoading(false);
  }, [seed]);

  const startQuiz = async () => {
    setPhase("quiz");
    await loadQuestion();
  };

  const handleSelect = (idx: number) => { if (!revealed) setSelected(idx); };

  const handleConfirm = () => {
    if (selected === null || !questions[currentIdx]) return;
    const q = questions[currentIdx];
    const correct = selected === q.correctIndex;
    setRevealed(true);
    setAnswers((prev) => [...prev, { correct, topic: q.topic }]);
    lastWrongTopic.current = correct ? undefined : q.topic;
  };

  const handleNext = async () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= TOTAL) {
      const score = answers.filter((a) => a.correct).length;
      const topicMap: Record<string, { c: number; t: number }> = {};
      answers.forEach((a) => {
        if (!topicMap[a.topic]) topicMap[a.topic] = { c: 0, t: 0 };
        topicMap[a.topic].t++;
        if (a.correct) topicMap[a.topic].c++;
      });
      const weakTopics = Object.entries(topicMap).filter(([, v]) => v.c / v.t < 0.6).map(([k]) => k);
      setResult({ passed: score >= PASS_THRESHOLD, score, total: TOTAL, weakTopics });
      setPhase("result");
      return;
    }
    setCurrentIdx(nextIdx);
    const wrongTopic = lastWrongTopic.current;
    setIsFollowUp(!!wrongTopic);
    lastWrongTopic.current = undefined;
    if (questions[nextIdx]) { setSelected(null); setRevealed(false); }
    else await loadQuestion(wrongTopic);
  };

  if (!isOpen) return null;
  const q = questions[currentIdx];
  const progressPct = Math.round(((currentIdx + (revealed ? 1 : 0)) / TOTAL) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        .quiz-root { font-family: 'Sora', sans-serif; }
        @keyframes quiz-up { from{opacity:0;transform:translateY(20px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes quiz-fade { from{opacity:0} to{opacity:1} }
        @keyframes quiz-pop { 0%{transform:scale(.8);opacity:0} 70%{transform:scale(1.05);opacity:1} 100%{transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .quiz-modal { animation: quiz-up 0.4s cubic-bezier(.22,1,.36,1) both; }
        .quiz-fade  { animation: quiz-fade 0.25s ease both; }
        .quiz-pop   { animation: quiz-pop 0.5s cubic-bezier(.34,1.56,.64,1) both; }
        .float-icon { animation: float 2.8s ease-in-out infinite; }
        .q-opt { transition: border-color .15s, background .15s; }
        .q-opt:active:not([disabled]) { transform: scale(0.98); }
      `}</style>

      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={phase === "intro" ? onClose : undefined} />

      <div className="quiz-root quiz-modal relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mb-0.5">Knowledge Check</p>
            <p className="text-sm font-black text-slate-800 truncate">{courseTitle}</p>
          </div>
          {phase === "intro" && (
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
          {phase === "quiz" && <ProgressDots total={TOTAL} current={currentIdx} answers={answers} />}
        </div>

        <div className="overflow-y-auto max-h-[75vh] flex-1">

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <div className="flex flex-col items-center text-center px-6 py-8 gap-5">
              <div className="float-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-400/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Before your certificate</p>
                <h2 className="text-xl font-black text-slate-900">Quick knowledge check</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  Answer <strong>10 questions</strong> about what you just learned. Score <strong>8/10 or higher</strong> to unlock your certificate.
                </p>
              </div>
              <div className="w-full space-y-2 text-left">
                {[
                  { icon: "🎯", text: "Adaptive — get one wrong and the next question targets that topic" },
                  { icon: "⚡", text: "No time limit — read carefully and take your time" },
                  { icon: "🏆", text: "Pass once and your certificate unlocks permanently" },
                ].map((tip) => (
                  <div key={tip.icon} className="flex items-start gap-3 bg-slate-50 rounded-2xl px-4 py-3">
                    <span className="text-base flex-shrink-0">{tip.icon}</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={startQuiz}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-300/30 transition-all active:scale-95 text-sm"
              >
                Start Quiz <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── QUIZ ── */}
          {phase === "quiz" && (
            <div className="px-5 py-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                  <span>Question {Math.min(currentIdx + 1, TOTAL)} of {TOTAL}</span>
                  <span>{answers.filter((a) => a.correct).length} correct</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                </div>
              </div>

              {isFollowUp && !loading && q && (
                <div className="quiz-fade flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <p className="text-[11px] text-amber-700 font-semibold">
                    Follow-up on: <span className="font-black">{q.topic}</span>
                  </p>
                </div>
              )}

              {loading ? (
                <div className="flex flex-col items-center gap-3 py-14">
                  <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                  <p className="text-sm text-slate-400 font-medium">Generating question…</p>
                </div>
              ) : q && (
                <div className="quiz-fade space-y-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 font-black text-[10px]">{currentIdx + 1}</span>
                      </div>
                      <p className="text-slate-800 font-semibold text-sm leading-relaxed">{q.text}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      let cls = "border-2 border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer";
                      if (revealed) {
                        if (i === q.correctIndex) cls = "border-2 border-emerald-400 bg-emerald-50 cursor-default";
                        else if (i === selected) cls = "border-2 border-rose-400 bg-rose-50 cursor-default";
                        else cls = "border-2 border-slate-100 bg-slate-50 opacity-40 cursor-default";
                      } else if (selected === i) cls = "border-2 border-blue-500 bg-blue-50 cursor-pointer";
                      return (
                        <button key={i} onClick={() => handleSelect(i)} disabled={revealed}
                          className={`q-opt w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left ${cls}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black border-2 transition-colors
                            ${revealed && i === q.correctIndex ? "border-emerald-500 bg-emerald-500 text-white"
                              : revealed && i === selected ? "border-rose-500 bg-rose-500 text-white"
                              : selected === i ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-300 text-slate-400"}`}>
                            {revealed && i === q.correctIndex ? <CheckCircle2 className="w-3.5 h-3.5" />
                              : revealed && i === selected ? <XCircle className="w-3.5 h-3.5" />
                              : ["A","B","C","D"][i]}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {revealed && (
                    <div className={`quiz-fade rounded-xl border px-4 py-3 ${answers[answers.length-1]?.correct ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                      <p className="font-bold text-[11px] mb-1">{answers[answers.length-1]?.correct ? "✓ Correct!" : "✗ Not quite —"}</p>
                      <p className="text-[12px] opacity-90 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    {!revealed ? (
                      <button onClick={handleConfirm} disabled={selected === null}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95">
                        Confirm <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={handleNext}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95">
                        {currentIdx + 1 >= TOTAL ? "See Results" : "Next"} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && result && (
            <div className="flex flex-col items-center text-center px-6 py-8 gap-5">
              <div className={`quiz-pop w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl
                ${result.passed ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-300/40" : "bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-300/40"}`}>
                {result.passed ? <Trophy className="w-8 h-8 text-white" /> : <RotateCcw className="w-8 h-8 text-white" />}
              </div>

              <div className="space-y-1">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${result.passed ? "text-emerald-500" : "text-rose-500"}`}>
                  {result.passed ? "Quiz Passed!" : "Not quite there"}
                </p>
                <h2 className="text-3xl font-black text-slate-900">
                  {result.score}<span className="text-slate-300">/{result.total}</span>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {result.passed
                    ? "You nailed it! Your certificate is now unlocked. 🎉"
                    : `You scored ${Math.round((result.score/result.total)*100)}% — need 80% to pass. Review the topics below and try again.`}
                </p>
              </div>

              <div className="w-full max-w-xs space-y-1">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${result.passed ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-rose-400 to-rose-500"}`}
                    style={{ width: `${Math.round((result.score/result.total)*100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>0%</span><span className="text-blue-400 font-bold">80% needed</span><span>100%</span>
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap justify-center">
                {answers.map((a, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white ${a.correct ? "bg-emerald-400" : "bg-rose-400"}`}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {result.weakTopics.length > 0 && (
                <div className="w-full text-left space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revisit these topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.weakTopics.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <XCircle className="w-3 h-3" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.passed ? (
                <button onClick={onPassed}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-300/30 transition-all active:scale-95 text-sm">
                  Claim My Certificate 🎓 <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-2xl px-4 py-3">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-500 font-semibold">Retake to unlock your certificate</p>
                  </div>
                  <button onClick={() => setQuizKey((k) => k + 1)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition-all active:scale-95 text-sm">
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseQuiz;