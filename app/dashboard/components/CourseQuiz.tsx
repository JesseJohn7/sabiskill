"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Icons (inline SVGs to avoid import issues) ────────────────────────────
const Icons = {
  Brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.66z"/>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.66z"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Trophy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
      <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
    </svg>
  ),
  RefreshCw: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full animate-spin">
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Timer: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="10" y1="2" x2="14" y2="2"/><circle cx="12" cy="14" r="8"/>
      <polyline points="12 10 12 14 14 16"/>
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/>
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
};

// ─── Types ─────────────────────────────────────────────────────────────────
interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface QuizResult {
  passed: boolean;
  score: number;
  total: number;
  weakTopics: string[];
  timeMs: number;
}

export interface CourseQuizProps {
  isOpen: boolean;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onPassed: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────
const LOCKOUT_MS = 60 * 60 * 1000;
const PASS_THRESHOLD = 8;
const TOTAL = 10;

// ─── Storage helpers ──────────────────────────────────────────────────────
function lockKey(id: string) { return `cq_lock_${id}`; }
function passKey(id: string) { return `cq_pass_${id}`; }

function getLockoutRemaining(id: string): number {
  try {
    const raw = localStorage.getItem(lockKey(id));
    if (!raw) return 0;
    const t = parseInt(raw, 10);
    if (isNaN(t)) return 0;
    const r = t + LOCKOUT_MS - Date.now();
    return r > 0 ? r : 0;
  } catch { return 0; }
}

function saveLockout(id: string) {
  try { localStorage.setItem(lockKey(id), String(Date.now())); } catch {}
}

export function hasPassedQuiz(id: string): boolean {
  try { return localStorage.getItem(passKey(id)) === "1"; } catch { return false; }
}

function savePass(id: string) {
  try { localStorage.setItem(passKey(id), "1"); } catch {}
}

function formatTime(ms: number): string {
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Course configs ────────────────────────────────────────────────────────
const COURSE_CONFIGS: Record<string, {
  emoji: string;
  color: string;
  accentDark: string;
  accentLight: string;
  topics: string[];
  systemPrompt: string;
}> = {
  "react-js": {
    emoji: "⚛️", color: "#61DAFB", accentDark: "#0ea5e9", accentLight: "#e0f7ff",
    topics: ["JSX", "useState", "useEffect", "useContext", "Props", "React Router", "Easy Peasy Redux", "Controlled Inputs", "React.memo", "Custom Hooks", "useRef", "Event Handling", "CRUD with Fetch"],
    systemPrompt: `You are a React JS senior engineer creating a quiz question. You must generate a completely UNIQUE, UNPREDICTABLE question every time.

STRICT RULES:
- Vary the FORMAT each time: code output prediction, "what's wrong with this code?", conceptual, scenario-based, "which is correct?", fill-in-the-blank
- Use code snippets in at least 50% of questions — real-world code, not trivial examples
- Topics: JSX, hooks (useState/useEffect/useRef/useCallback/useMemo), Context API, React Router v6, prop drilling, Easy Peasy Redux, controlled vs uncontrolled, React.memo, key prop, error boundaries, custom hooks, performance
- Make distractors plausible — wrong answers should reflect COMMON MISCONCEPTIONS
- Include a "gotcha" — something that trips up even experienced devs
- DO NOT generate the same question twice — use the entropy seed for randomness

Return ONLY minified JSON (no markdown, no preamble, no explanation):
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
  },
  "javascript": {
    emoji: "🟨", color: "#F7DF1E", accentDark: "#ca8a04", accentLight: "#fef9c3",
    topics: ["Closures", "Scope", "Async/Await", "Promises", "Event Loop", "Destructuring", "Spread/Rest", "Optional Chaining", "Array Methods", "Prototype Chain", "this keyword", "ES Modules"],
    systemPrompt: `You are a JavaScript engine internals expert creating a quiz question. Generate SURPRISING, CHALLENGING questions.

STRICT RULES:
- Favor "what does this output?" questions with tricky edge cases
- Cover: closures, hoisting, the event loop, prototype chain, type coercion, promise chaining, async/await quirks, 'this' binding, generators, WeakMap/WeakSet, Proxy, Symbol
- Wrong answers should be the MOST COMMON incorrect answers developers give
- At least 30% of questions should involve code snippets with subtle bugs or surprising behavior
- Mix difficulty: some should be genuinely hard (interview-level)

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"hard"}`
  },
  "web-dev": {
    emoji: "🌐", color: "#e34c26", accentDark: "#dc2626", accentLight: "#fee2e2",
    topics: ["Semantic HTML", "CSS Flexbox", "CSS Grid", "Responsive Design", "DOM API", "Fetch API", "Git", "HTTP Methods", "CSS Box Model", "CSS Positioning", "Web Performance", "Accessibility"],
    systemPrompt: `You are a full-stack web developer and interviewer creating a quiz question. Generate PRACTICAL, JOB-RELEVANT questions.

STRICT RULES:
- Mix HTML, CSS, JS, and Git questions randomly
- Include browser devtools knowledge, performance concepts, accessibility (WCAG)
- Vary formats: "which CSS achieves X?", "what does this Git command do?", "what's the output?", scenario debugging
- Cover: semantic HTML5, flexbox/grid layouts, media queries, CSS specificity, DOM manipulation, fetch + async, HTTP verbs, Git workflows, web vitals
- Distractors must be believable — e.g., mix up similar CSS properties

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
  },
  "python-ai": {
    emoji: "🐍", color: "#3776AB", accentDark: "#2563eb", accentLight: "#dbeafe",
    topics: ["Data Types", "List Comprehensions", "Decorators", "Generators", "OOP", "Virtual Environments", "File I/O", "Error Handling", "Modules", "Closures", "Type Hints"],
    systemPrompt: `You are a Python expert and senior engineer creating a quiz question. Generate REAL-WORLD Python questions.

STRICT RULES:
- Include output-prediction questions with Python's quirky behaviors (mutable defaults, GIL, etc.)
- Cover: list/dict/set comprehensions, generators, decorators, context managers, dataclasses, type hints, walrus operator, f-strings, *args/**kwargs, dunder methods, slicing tricks
- Mix scripting, OOP, and tooling questions
- Use Python 3.10+ features in some questions
- Make distractors reflect real beginner/intermediate mistakes

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
  },
  "ui-ux": {
    emoji: "🎨", color: "#8B5CF6", accentDark: "#7c3aed", accentLight: "#ede9fe",
    topics: ["Design Thinking", "User Research", "Wireframing", "Prototyping", "Typography", "Color Theory", "Gestalt Principles", "Usability Heuristics", "Accessibility", "Information Architecture", "A/B Testing"],
    systemPrompt: `You are a senior UX designer and researcher creating a quiz question. Generate NUANCED design questions.

STRICT RULES:
- Vary between principles, practical application, and research methodology
- Cover: design thinking stages, Gestalt laws, Nielsen's heuristics, WCAG 2.1, typography hierarchy, color contrast ratios, user interview techniques, card sorting, tree testing, jobs-to-be-done, mental models, affordances
- Include scenario-based questions: "A user is struggling with X, which principle applies?"
- Test DEPTH not surface knowledge — avoid questions answerable by guessing
- Include some questions where multiple answers seem correct but one is clearly better

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
  },
  "crypto": {
    emoji: "₿", color: "#F7931A", accentDark: "#d97706", accentLight: "#fef3c7",
    topics: ["Blockchain Basics", "Consensus Mechanisms", "Wallets & Security", "Smart Contracts", "DeFi", "NFTs", "Tokenomics", "Risk Management", "On-chain Analysis", "Layer 2"],
    systemPrompt: `You are a blockchain architect and crypto trader creating a quiz question. Generate TECHNICAL, PRACTICAL questions.

STRICT RULES:
- Mix technical (how things work) with practical (how to use/evaluate)
- Cover: UTXO vs account model, Merkle trees, mempool, gas mechanics, AMM math (x*y=k), impermanent loss, liquidation in lending protocols, bridges, L2 scaling (optimistic vs ZK rollups), MEV, oracles, multisig
- Include questions about red flags and scam patterns
- Some questions should test crypto-economic reasoning, not just facts
- Avoid overly basic questions — assume the learner has completed the course

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"hard"}`
  },
  "solidity-web3": {
    emoji: "🔷", color: "#627EEA", accentDark: "#4f46e5", accentLight: "#e0e7ff",
    topics: ["Solidity Syntax", "Data Locations", "Mappings & Structs", "Events", "Modifiers", "Security", "Gas Optimization", "Ethers.js", "Hardhat", "ERC Standards", "Upgradeable Contracts"],
    systemPrompt: `You are an Ethereum smart contract auditor creating a quiz question. Generate SECURITY-AWARE, EXPERT-LEVEL questions.

STRICT RULES:
- Heavy focus on security: reentrancy, integer overflow, front-running, selfdestruct, delegatecall, access control
- Include code snippets with subtle vulnerabilities — "what's wrong here?"
- Cover: storage vs memory vs calldata, assembly basics, gas optimization patterns, ERC-20/721/1155 edge cases, proxy patterns, ABI encoding, event indexing, CREATE2
- Questions should distinguish intermediate from advanced Solidity devs
- Include Ethers.js/Hardhat/Foundry tooling questions

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"hard"}`
  },
  "digital-marketing": {
    emoji: "📈", color: "#10B981", accentDark: "#059669", accentLight: "#d1fae5",
    topics: ["Marketing Funnel", "SEO", "Paid Ads", "Content Marketing", "Email Marketing", "Analytics", "Copywriting", "Brand Strategy", "B2B vs B2C", "Conversion Rate Optimization"],
    systemPrompt: `You are a CMO and growth marketer creating a quiz question. Generate STRATEGIC, RESULTS-FOCUSED questions.

STRICT RULES:
- Mix strategy (why) with tactics (how) and measurement (did it work)
- Cover: CAC vs LTV, attribution models, bidding strategies (tROAS, tCPA), landing page CRO, copywriting frameworks (AIDA, PAS, BAB), SEO (E-E-A-T, Core Web Vitals), email deliverability, audience segmentation, funnel optimization, brand positioning
- Include scenario questions: "Campaign X has high CTR but low conversion, likely cause?"
- Some questions about analytics interpretation (reading GA4 data, interpreting A/B test results)
- Test reasoning, not just definitions

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
  },
  "social-media-mgmt": {
    emoji: "📱", color: "#EC4899", accentDark: "#db2777", accentLight: "#fce7f3",
    topics: ["Client Onboarding", "Content Strategy", "Pricing & Packages", "Analytics & Reporting", "Platform Algorithms", "Community Management", "Brand Voice", "Content Calendar", "Contracts", "Discovery Calls"],
    systemPrompt: `You are a seasoned social media agency owner creating a quiz question. Generate BUSINESS-PRACTICAL questions.

STRICT RULES:
- Mix client management, content strategy, and business operations questions
- Cover: retainer vs project pricing, scope creep handling, KPI setting, algorithm updates (Reels vs carousels vs stories engagement), hashtag strategy, community management scripts, audit frameworks, contract clauses, upselling, client retention
- Include scenario-based questions: "A client is unhappy with engagement after 2 months, what do you do?"
- Test business judgment, not just tactics
- Some questions about tools (Metricool, Later, Hootsuite, Sprout Social)

Return ONLY minified JSON:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
  },
};

const GENERIC_CONFIG = {
  emoji: "🧠", color: "#6366F1", accentDark: "#4f46e5", accentLight: "#e0e7ff",
  topics: ["Core Concepts", "Best Practices", "Applied Knowledge"],
  systemPrompt: `Generate a practical quiz question to test understanding of what was just learned.
Return ONLY minified JSON: {"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"...","difficulty":"medium"}`
};

// ─── Fallback bank (used if API fails) ────────────────────────────────────
const FALLBACK_BANK: Record<string, Omit<Question, "id">[]> = {
  "react-js": [
    { text: "What will this render? `const [n, setN] = useState(0); useEffect(() => { setN(n => n+1); }, []);`", options: ["Infinite loop", "Renders once with n=1", "Renders once with n=0", "Throws error"], correctIndex: 1, topic: "useEffect", explanation: "With an empty dependency array, useEffect runs once after mount. The functional updater form (n => n+1) is safe here and results in n=1 after one render.", difficulty: "medium" },
    { text: "Which hook should you use to avoid recreating a function on every render?", options: ["useEffect", "useMemo", "useCallback", "useRef"], correctIndex: 2, topic: "Performance", explanation: "useCallback memoizes the function itself. useMemo memoizes a computed value. Use useCallback when passing callbacks to optimized child components.", difficulty: "medium" },
    { text: "In React Router v6, how do you access URL params like /users/:id?", options: ["this.props.match.params", "useParams()", "props.params", "getParams()"], correctIndex: 1, topic: "React Router", explanation: "The useParams() hook in React Router v6 returns an object of key-value pairs matching the dynamic segments in the current route.", difficulty: "easy" },
    { text: "What is wrong? `useEffect(async () => { const data = await fetch(url); }, [])`", options: ["Nothing is wrong", "async effect functions are not allowed directly — they return a Promise not a cleanup function", "fetch cannot be used in effects", "The dependency array is wrong"], correctIndex: 1, topic: "useEffect", explanation: "useEffect callbacks must return either nothing or a cleanup function. Async functions return Promises, which React ignores but flags. Fix: define async function inside the effect and call it.", difficulty: "hard" },
    { text: "What does React.StrictMode do?", options: ["Prevents all console warnings", "Intentionally double-invokes renders to detect side effects in development", "Enables TypeScript type checking", "Adds performance monitoring"], correctIndex: 1, topic: "React Internals", explanation: "StrictMode double-invokes renders, state updates, and effects in dev mode to surface impure functions and side effects. This only happens in development.", difficulty: "medium" },
  ],
  "javascript": [
    { text: "What does this output? `console.log(0.1 + 0.2 === 0.3)`", options: ["true", "false", "NaN", "TypeError"], correctIndex: 1, topic: "JS Quirks", explanation: "Floating point arithmetic: 0.1 + 0.2 = 0.30000000000000004 in JavaScript. Use Number.EPSILON for comparisons: Math.abs(0.1+0.2-0.3) < Number.EPSILON", difficulty: "medium" },
    { text: "What is the output? `typeof NaN`", options: ["'NaN'", "'undefined'", "'number'", "'null'"], correctIndex: 2, topic: "Types", explanation: "NaN (Not a Number) paradoxically has type 'number'. It's the result of invalid numeric operations like parseInt('hello') or 0/0.", difficulty: "easy" },
    { text: "What logs? `const fn = () => { return { key: 'value' } }; console.log(fn())`", options: ["undefined", "SyntaxError", "{key: 'value'}", "null"], correctIndex: 2, topic: "Arrow Functions", explanation: "Arrow functions with curly braces need an explicit return statement. The curly braces here start a block, not an object literal — but return is present, so {key:'value'} is returned.", difficulty: "medium" },
    { text: "Which correctly creates a private-like variable using a closure?", options: ["var x = private 0;", "function counter() { let c = 0; return () => ++c; }", "const x = #private 0;", "let x = Symbol('private')"], correctIndex: 1, topic: "Closures", explanation: "The inner arrow function closes over 'c'. Each call to counter() creates a new independent 'c'. This is the classic closure-based private variable pattern.", difficulty: "medium" },
  ],
  "ui-ux": [
    { text: "A user completes a task in 4 steps but the original design had 7. What UX principle did the redesign improve?", options: ["Visibility", "Learnability", "Efficiency", "Error prevention"], correctIndex: 2, topic: "Usability", explanation: "Efficiency refers to how quickly experienced users can accomplish tasks. Reducing steps directly improves task efficiency, one of Nielsen's usability goals.", difficulty: "medium" },
    { text: "What's the difference between an affordance and a signifier?", options: ["They mean the same thing", "Affordance is what an object can do; signifier communicates how to do it", "Signifier is what an object can do; affordance communicates how", "Affordances are digital, signifiers are physical"], correctIndex: 1, topic: "Design Principles", explanation: "Don Norman distinguishes: affordance = the actual property/capability (a button can be clicked). Signifier = the perceived cue that communicates that capability (the button LOOKS clickable).", difficulty: "hard" },
  ],
};

// ─── AI Question Fetcher ───────────────────────────────────────────────────
async function generateQuestion(
  courseId: string,
  coveredTopics: string[],
  isRetry: boolean,
  wrongTopic?: string
): Promise<Question | null> {
  const config = COURSE_CONFIGS[courseId] || GENERIC_CONFIG;
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${Math.random().toString(36).slice(2, 9)}`;

  const avoid = coveredTopics.length
    ? `\n\nTOPICS ALREADY COVERED (DO NOT repeat): [${coveredTopics.join(", ")}]`
    : "";
  const retry = wrongTopic
    ? `\n\nThe student got "${wrongTopic}" WRONG. Ask a DIFFERENT question that reinforces "${wrongTopic}" from a completely different angle.`
    : "";
  const freshness = `\n\nEntropy seed (use for uniqueness): ${seed}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        temperature: 1,
        system: config.systemPrompt,
        messages: [{
          role: "user",
          content: `Generate ONE quiz question now.${avoid}${retry}${freshness}\n\nReturn ONLY the JSON object — no markdown, no backticks, no preamble.`
        }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.content?.find((b: any) => b.type === "text")?.text ?? "";
    const clean = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    if (
      typeof obj.text !== "string" ||
      !Array.isArray(obj.options) || obj.options.length !== 4 ||
      typeof obj.correctIndex !== "number" || obj.correctIndex < 0 || obj.correctIndex > 3
    ) return null;
    return { id: `ai-${seed}`, ...obj };
  } catch {
    return null;
  }
}

function getFallback(courseId: string, used: Set<string>): Question {
  const pool = FALLBACK_BANK[courseId] || FALLBACK_BANK["react-js"] || [];
  const unused = pool.filter((_, i) => !used.has(`fb-${courseId}-${i}`));
  const base = unused.length ? unused[Math.floor(Math.random() * unused.length)] : pool[Math.floor(Math.random() * pool.length)];
  const idx = pool.indexOf(base);
  const id = `fb-${courseId}-${idx}-${Date.now()}`;
  used.add(`fb-${courseId}-${idx}`);
  return { id, ...base };
}

// ─── Sub-components ────────────────────────────────────────────────────────
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="relative w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function AnswerDots({ total, current, answers, color }: {
  total: number; current: number; answers: { correct: boolean }[]; color: string;
}) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current && i >= answers.length ? 14 : 8,
            height: 8,
            backgroundColor: i < answers.length
              ? answers[i].correct ? "#22c55e" : "#ef4444"
              : i === current ? color : "#e2e8f0",
            opacity: i > current && i >= answers.length ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Quiz Component ───────────────────────────────────────────────────
export function CourseQuiz({ isOpen, courseId, courseTitle, onClose, onPassed }: CourseQuizProps) {
  const cfg = COURSE_CONFIGS[courseId] || GENERIC_CONFIG;

  const [alreadyPassed] = useState(() => hasPassedQuiz(courseId));
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; topic: string }[]>([]);
  const answersRef = useRef<{ correct: boolean; topic: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState(1);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizKey, setQuizKey] = useState(0);
  const [lockoutMs, setLockoutMs] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [questionEnterTime, setQuestionEnterTime] = useState(0);
  const [showExplanationFull, setShowExplanationFull] = useState(false);

  const coveredTopics = useRef<string[]>([]);
  const lastWrongTopic = useRef<string | undefined>(undefined);
  const usedFallbackIds = useRef(new Set<string>());
  const courseIdRef = useRef(courseId);

  useEffect(() => { courseIdRef.current = courseId; }, [courseId]);

  useEffect(() => {
    if (!isOpen) return;
    if (alreadyPassed) { onPassed(); return; }
    const r = getLockoutRemaining(courseId);
    setLockoutMs(r);
    if (r <= 0) return;
    const iv = setInterval(() => {
      const rem = getLockoutRemaining(courseId);
      setLockoutMs(rem);
      if (rem <= 0) clearInterval(iv);
    }, 1000);
    return () => clearInterval(iv);
  }, [isOpen, courseId, quizKey, alreadyPassed]);

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setLoadingDots(d => d % 3 + 1), 400);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (isOpen) {
      setPhase("intro"); setQuestions([]); setCurrentIdx(0);
      setSelected(null); setRevealed(false); setAnswers([]);
      answersRef.current = []; setResult(null);
      setIsFollowUp(false); setShowExplanationFull(false);
      coveredTopics.current = []; lastWrongTopic.current = undefined;
      usedFallbackIds.current = new Set();
    }
  }, [isOpen, quizKey]);

  const loadQuestion = async (wrongTopic?: string) => {
    setLoading(true); setSelected(null); setRevealed(false); setShowExplanationFull(false);
    const cid = courseIdRef.current;
    const q = await generateQuestion(cid, coveredTopics.current, false, wrongTopic)
      ?? getFallback(cid, usedFallbackIds.current);
    coveredTopics.current = [...coveredTopics.current, q.topic];
    setQuestions(prev => [...prev, q]);
    setLoading(false);
    setQuestionEnterTime(Date.now());
  };

  const startQuiz = async () => {
    setPhase("quiz"); setStartTime(Date.now());
    await loadQuestion();
  };

  const handleConfirm = () => {
    if (selected === null || !questions[currentIdx]) return;
    const q = questions[currentIdx];
    const correct = selected === q.correctIndex;
    setRevealed(true);
    const newAnswers = [...answersRef.current, { correct, topic: q.topic }];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    lastWrongTopic.current = correct ? undefined : q.topic;
  };

  const handleNext = async () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= TOTAL) {
      const fa = answersRef.current;
      const score = fa.filter(a => a.correct).length;
      const topicMap: Record<string, { c: number; t: number }> = {};
      fa.forEach(a => {
        if (!topicMap[a.topic]) topicMap[a.topic] = { c: 0, t: 0 };
        topicMap[a.topic].t++;
        if (a.correct) topicMap[a.topic].c++;
      });
      const weakTopics = Object.entries(topicMap).filter(([, v]) => v.c / v.t < 0.6).map(([k]) => k);
      const timeMs = Date.now() - startTime;
      setResult({ passed: score >= PASS_THRESHOLD, score, total: TOTAL, weakTopics, timeMs });
      if (score >= PASS_THRESHOLD) savePass(courseIdRef.current);
      else { saveLockout(courseIdRef.current); setLockoutMs(LOCKOUT_MS); }
      setPhase("result");
      return;
    }
    setCurrentIdx(nextIdx);
    const wrongTopic = lastWrongTopic.current;
    setIsFollowUp(!!wrongTopic);
    lastWrongTopic.current = undefined;
    if (questions[nextIdx]) { setSelected(null); setRevealed(false); setShowExplanationFull(false); setQuestionEnterTime(Date.now()); }
    else await loadQuestion(wrongTopic);
  };

  if (!isOpen || alreadyPassed) return null;

  const q = questions[currentIdx];
  const correctCount = answers.filter(a => a.correct).length;
  const progress = Math.round(((currentIdx + (revealed ? 1 : 0)) / TOTAL) * 100);
  const accent = cfg.accentDark;
  const light = cfg.accentLight;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .qz-root * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        @keyframes qz-slide-up { from { opacity:0; transform:translateY(24px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes qz-fade { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes qz-pop { 0% { transform:scale(.7); opacity:0 } 70% { transform:scale(1.08) } 100% { transform:scale(1); opacity:1 } }
        @keyframes qz-pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes qz-float { 0%,100% { transform:translateY(0) rotate(0deg) } 25% { transform:translateY(-6px) rotate(-1deg) } 75% { transform:translateY(-3px) rotate(1deg) } }
        @keyframes qz-shimmer { from { background-position: -200% 0 } to { background-position: 200% 0 } }
        @keyframes qz-reveal { from { opacity:0; max-height:0; transform:translateY(-4px) } to { opacity:1; max-height:300px; transform:translateY(0) } }
        @keyframes qz-confetti { 0% { transform:translateY(-10px) rotate(0deg); opacity:1 } 100% { transform:translateY(60px) rotate(720deg); opacity:0 } }
        .qz-modal { animation: qz-slide-up 0.45s cubic-bezier(.22,1,.36,1) both; }
        .qz-fade { animation: qz-fade 0.3s ease both; }
        .qz-pop { animation: qz-pop 0.5s cubic-bezier(.34,1.56,.64,1) both; }
        .qz-float { animation: qz-float 3s ease-in-out infinite; }
        .qz-reveal { animation: qz-reveal 0.35s cubic-bezier(.22,1,.36,1) both; overflow:hidden; }
        .qz-shimmer { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: qz-shimmer 1.5s infinite; }
        .qz-opt { transition: all .15s ease; outline:none; }
        .qz-opt:not([disabled]):hover { transform: translateX(3px); }
        .qz-opt:not([disabled]):active { transform: scale(0.985); }
        .qz-btn { transition: all .15s ease; }
        .qz-btn:not([disabled]):hover { filter: brightness(1.08); }
        .qz-btn:not([disabled]):active { transform: scale(0.96); }
        .qz-score-bar { transition: width 1s cubic-bezier(.22,1,.36,1); }
        .confetti { position:absolute; width:6px; height:6px; border-radius:1px; animation: qz-confetti 1.2s ease-out forwards; }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm dark:backdrop-blur"
        style={{ background: "rgba(15,15,20,0.75)" }}
        onClick={phase === "intro" ? onClose : undefined}
      />

      <div className="qz-root qz-modal relative z-10 w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}>

        {/* Top accent bar */}
        <div className="h-1 flex-shrink-0" style={{ background: `linear-gradient(90deg, ${accent}, ${cfg.color}, ${accent})` }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: light }}>
            <span>{cfg.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: accent }}>
              Knowledge Check
            </p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-100 truncate leading-tight">{courseTitle}</p>
          </div>
          {phase === "intro" && (
            <button onClick={onClose}
              className="qz-btn w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <span className="w-4 h-4 text-slate-500 dark:text-slate-400"><Icons.X /></span>
            </button>
          )}
          {phase === "quiz" && (
            <AnswerDots total={TOTAL} current={currentIdx} answers={answers} color={accent} />
          )}
        </div>

        <div className="overflow-y-auto flex-1" style={{ overscrollBehavior: "contain" }}>

          {/* ══════ INTRO ══════ */}
          {phase === "intro" && (
            <div className="flex flex-col items-center text-center px-6 py-8 gap-5">
              {lockoutMs > 0 ? (
                <>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", boxShadow: "0 8px 32px rgba(239,68,68,0.35)" }}>
                    <span className="w-7 h-7"><Icons.Timer /></span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Locked — come back later</p>
                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-50 mb-2">1-Hour Cooldown Active</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Review the course material, then retake in:</p>
                    <p className="text-5xl font-black text-red-500 mt-3 tabular-nums tracking-wider">{formatTime(lockoutMs)}</p>
                  </div>
                  <div className="w-full max-w-xs">
                    <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full qz-score-bar" style={{ width: `${(lockoutMs / LOCKOUT_MS) * 100}%` }} />
                    </div>
                  </div>
                  <button onClick={onClose} className="qz-btn w-full border-2 border-slate-200 rounded-2xl py-3 text-sm font-bold text-slate-600">
                    Close
                  </button>
                </>
              ) : (
                <>
                  <div className="qz-float w-18 h-18 w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-white text-3xl"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${cfg.color})`, boxShadow: `0 12px 40px ${accent}40` }}>
                    {cfg.emoji}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: accent }}>
                      AI-Powered • Adaptive Quiz
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-3">Ready to prove it?</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                      Answer <strong className="text-slate-700 dark:text-slate-300">10 unique questions</strong> generated just for you.
                      Score <strong className="text-slate-700 dark:text-slate-300">8 or higher</strong> to unlock your certificate.
                    </p>
                  </div>
                  <div className="w-full space-y-2">
                    {[
                      { icon: "🤖", title: "AI-Generated", desc: "Every session gets fresh, unique questions — no two quizzes are the same" },
                      { icon: "🎯", title: "Adaptive", desc: "Get one wrong? The next question targets that exact weak spot" },
                      { icon: "⏱️", title: "No Time Limit", desc: "Take your time — but fail and you wait 1 hour before retrying" },
                      { icon: "🏆", title: "Pass Once, Certified Forever", desc: "Your certificate unlocks permanently across all devices" },
                    ].map(tip => (
                      <div key={tip.icon} className="flex items-start gap-3 rounded-2xl px-4 py-3 text-left"
                        style={{ background: light }}>
                        <span className="text-lg flex-shrink-0 mt-0.5">{tip.icon}</span>
                        <div>
                          <p className="text-[11px] font-black text-slate-700">{tip.title}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{tip.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={startQuiz}
                    className="qz-btn w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${accent}, ${cfg.color})`, boxShadow: `0 8px 24px ${accent}35` }}>
                    <span className="w-4 h-4"><Icons.Zap /></span>
                    Start Quiz — 10 Questions
                  </button>
                </>
              )}
            </div>
          )}

          {/* ══════ QUIZ ══════ */}
          {phase === "quiz" && (
            <div className="px-5 py-5 space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    Question {Math.min(currentIdx + 1, TOTAL)}<span className="text-slate-300 dark:text-slate-600"> / {TOTAL}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">{correctCount} correct</span>
                  </div>
                </div>
                <ProgressBar value={progress} color={accent} />
              </div>

              {/* Follow-up badge */}
              {isFollowUp && !loading && q && (
                <div className="qz-fade flex items-center gap-2 rounded-xl px-3 py-2 border"
                  style={{ background: "#fffbeb", borderColor: "#fde68a" }}>
                  <span className="text-sm flex-shrink-0">🎯</span>
                  <p className="text-[11px] font-semibold text-amber-700">
                    Reinforcing: <strong>{q.topic}</strong>
                  </p>
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-16">
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-2xl opacity-20"
                      style={{ background: light }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6" style={{ color: accent }}><Icons.Loader /></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Generating your question</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      AI is crafting something fresh{"".padEnd(loadingDots, ".")}
                    </p>
                  </div>
                  {/* Skeleton */}
                  <div className="w-full space-y-3 mt-2">
                    <div className="h-16 rounded-2xl qz-shimmer dark:opacity-20" />
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-12 rounded-xl qz-shimmer dark:opacity-20" style={{ opacity: 1 - i * 0.15 }} />
                    ))}
                  </div>
                </div>
              ) : q && (
                <div className="qz-fade space-y-3">
                  {/* Difficulty badge */}
                  {q.difficulty && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
                        style={{
                          background: q.difficulty === "hard" ? "#fee2e2" : q.difficulty === "easy" ? "#d1fae5" : "#fef3c7",
                          color: q.difficulty === "hard" ? "#dc2626" : q.difficulty === "easy" ? "#059669" : "#d97706",
                        }}>
                        {q.difficulty === "hard" ? "⚡ Hard" : q.difficulty === "easy" ? "✓ Easy" : "◎ Medium"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{q.topic}</span>
                    </div>
                  )}

                  {/* Question card */}
                  <div className="rounded-2xl p-4 border-2 border-slate-100"
                    style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}>
                    <div className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black text-white mt-0.5"
                        style={{ background: accent }}>
                        {currentIdx + 1}
                      </div>
                      <p className="text-slate-800 font-semibold text-sm leading-relaxed flex-1"
                        style={{ fontFamily: "'Plus Jakarta Sans', monospace" }}>
                        {q.text}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, i) => {
                      const isSelected = selected === i;
                      const isCorrect = i === q.correctIndex;
                      const isWrong = revealed && isSelected && !isCorrect;

                      let bg = "white", border = "#e2e8f0", textColor = "#334155";
                      let iconBg = "#e2e8f0", iconColor = "#94a3b8";

                      if (!revealed && isSelected) {
                        bg = light; border = accent; textColor = "#1e293b"; iconBg = accent; iconColor = "white";
                      } else if (revealed && isCorrect) {
                        bg = "#f0fdf4"; border = "#22c55e"; textColor = "#166534"; iconBg = "#22c55e"; iconColor = "white";
                      } else if (isWrong) {
                        bg = "#fef2f2"; border = "#ef4444"; textColor = "#991b1b"; iconBg = "#ef4444"; iconColor = "white";
                      } else if (revealed) {
                        bg = "#f8fafc"; border = "#f1f5f9"; textColor = "#94a3b8";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => !revealed && setSelected(i)}
                          disabled={revealed}
                          className="qz-opt w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left border-2 cursor-pointer disabled:cursor-default"
                          style={{ background: bg, borderColor: border, color: textColor }}>
                          <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-black transition-all"
                            style={{ background: iconBg, color: iconColor }}>
                            {revealed && isCorrect ? <span className="w-3.5 h-3.5"><Icons.Check /></span>
                              : isWrong ? <span className="w-3.5 h-3.5"><Icons.X /></span>
                              : ["A", "B", "C", "D"][i]}
                          </div>
                          <span className="text-sm font-medium flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {revealed && (
                    <div className="qz-reveal rounded-2xl border p-4"
                      style={{
                        background: answers[answers.length - 1]?.correct ? "#f0fdf4" : "#fef2f2",
                        borderColor: answers[answers.length - 1]?.correct ? "#bbf7d0" : "#fecaca",
                      }}>
                      <div className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0 mt-0.5">
                          {answers[answers.length - 1]?.correct ? "✅" : "❌"}
                        </span>
                        <div className="flex-1">
                          <p className="text-[11px] font-black mb-1"
                            style={{ color: answers[answers.length - 1]?.correct ? "#166534" : "#991b1b" }}>
                            {answers[answers.length - 1]?.correct ? "Correct!" : "Not quite —"}
                          </p>
                          <p className="text-[12px] leading-relaxed"
                            style={{ color: answers[answers.length - 1]?.correct ? "#166534" : "#991b1b", opacity: 0.85 }}>
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="flex justify-end pt-1">
                    {!revealed ? (
                      <button onClick={handleConfirm} disabled={selected === null}
                        className="qz-btn flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                        style={{ background: selected !== null ? accent : "#cbd5e1" }}>
                        Confirm Answer
                        <span className="w-4 h-4"><Icons.ArrowRight /></span>
                      </button>
                    ) : (
                      <button onClick={handleNext}
                        className="qz-btn flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white"
                        style={{ background: "#0f172a", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                        {currentIdx + 1 >= TOTAL ? "See Results" : "Next Question"}
                        <span className="w-4 h-4"><Icons.ArrowRight /></span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════ RESULT ══════ */}
          {phase === "result" && result && (
            <div className="flex flex-col items-center text-center px-6 py-8 gap-5">
              {/* Confetti on pass */}
              {result.passed && (
                <div className="absolute top-20 inset-x-0 flex justify-around pointer-events-none overflow-hidden h-24">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="confetti"
                      style={{
                        left: `${5 + (i * 4.7) % 90}%`,
                        background: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"][i % 5],
                        animationDelay: `${(i * 0.07) % 0.8}s`,
                        animationDuration: `${0.8 + (i * 0.09) % 0.7}s`,
                        transform: `rotate(${i * 37}deg)`,
                      }} />
                  ))}
                </div>
              )}

              <div className="qz-pop w-20 h-20 rounded-3xl flex items-center justify-center text-white text-4xl"
                style={{
                  background: result.passed
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "linear-gradient(135deg, #f43f5e, #dc2626)",
                  boxShadow: result.passed ? "0 12px 40px rgba(34,197,94,0.35)" : "0 12px 40px rgba(239,68,68,0.35)",
                }}>
                {result.passed ? <span className="w-10 h-10"><Icons.Trophy /></span> : <span className="w-10 h-10"><Icons.RefreshCw /></span>}
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2"
                  style={{ color: result.passed ? "#22c55e" : "#ef4444" }}>
                  {result.passed ? "🎉 Quiz Passed!" : "Almost there"}
                </p>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-black text-slate-900 dark:text-slate-50">{result.score}</span>
                  <span className="text-2xl font-black text-slate-300">/{result.total}</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {result.passed
                    ? "Excellent work! Your certificate is now permanently unlocked. 🎓"
                    : `You scored ${Math.round((result.score / result.total) * 100)}%. You need 80% to pass. Review the material and try again.`}
                </p>
                <p className="text-[10px] text-slate-400 mt-2">
                  Completed in {Math.floor(result.timeMs / 60000)}m {Math.floor((result.timeMs % 60000) / 1000)}s
                </p>
              </div>

              {/* Score bar */}
              <div className="w-full max-w-xs space-y-1">
                <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full rounded-full qz-score-bar"
                    style={{
                      width: `${(result.score / result.total) * 100}%`,
                      background: result.passed ? "linear-gradient(90deg, #22c55e, #16a34a)" : "linear-gradient(90deg, #f43f5e, #ef4444)",
                    }} />
                  {/* 80% marker */}
                  <div className="absolute top-0 h-full w-0.5 bg-slate-400 opacity-50" style={{ left: "80%" }} />
                </div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                  <span>0%</span>
                  <span className="font-bold" style={{ color: accent }}>80% pass mark</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Answer dots */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {answers.map((a, i) => (
                  <div key={i} title={`Q${i+1}: ${a.topic}`}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{ background: a.correct ? "#22c55e" : "#ef4444" }}>
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Weak topics */}
              {result.weakTopics.length > 0 && (
                <div className="w-full text-left space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Review these topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.weakTopics.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ✗ {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              {result.passed ? (
                <button onClick={onPassed}
                  className="qz-btn w-full py-4 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${cfg.color})`, boxShadow: `0 8px 24px ${accent}35` }}>
                  <span className="w-4 h-4"><Icons.Trophy /></span>
                  Claim My Certificate
                </button>
              ) : (
                <div className="w-full space-y-3">
                  {lockoutMs > 0 ? (
                    <div className="rounded-2xl overflow-hidden border-2 border-red-200 bg-red-50">
                      <div className="px-4 py-4 text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 text-red-500"><Icons.Timer /></span>
                          <p className="text-xs font-black text-red-600 uppercase tracking-wide">Retake Locked</p>
                        </div>
                        <p className="text-3xl font-black text-red-600 tabular-nums">{formatTime(lockoutMs)}</p>
                        <p className="text-[11px] text-red-500">Use this time to review the weak topics above</p>
                      </div>
                      <div className="h-1.5 bg-red-200">
                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(lockoutMs / LOCKOUT_MS) * 100}%` }} />
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setQuizKey(k => k + 1)}
                      className="qz-btn w-full py-3.5 rounded-2xl text-sm font-black text-white flex items-center justify-center gap-2"
                      style={{ background: "#0f172a" }}>
                      <span className="w-4 h-4"><Icons.RefreshCw /></span>
                      Retake Quiz
                    </button>
                  )}
                  <button onClick={onClose}
                    className="qz-btn w-full py-3 rounded-2xl text-sm font-bold border-2 border-slate-200 text-slate-600">
                    Review Course Material
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