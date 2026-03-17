"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Brain, CheckCircle2, XCircle, ChevronRight, Loader2,
  Trophy, RotateCcw, ArrowRight, RefreshCw, X, Lock, Zap, Timer,
} from "lucide-react";

const LOCKOUT_MS = 60 * 60 * 1000; // 1 hour in milliseconds

/** Returns the localStorage key for a given courseId's fail timestamp */
function lockKey(courseId: string) {
  return `sabiskill_quiz_fail_${courseId}`;
}

/** Returns ms remaining in lockout, or 0 if unlocked */
function getLockoutRemaining(courseId: string): number {
  try {
    const raw = localStorage.getItem(lockKey(courseId));
    if (!raw) return 0;
    const failedAt = parseInt(raw, 10);
    if (isNaN(failedAt)) return 0;
    const remaining = failedAt + LOCKOUT_MS - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
}

/** Saves current timestamp as fail time */
function saveLockout(courseId: string) {
  try {
    localStorage.setItem(lockKey(courseId), String(Date.now()));
  } catch {}
}

/** localStorage key for a passed course */
function passKey(courseId: string) {
  return `sabiskill_quiz_passed_${courseId}`;
}

/** Returns true if this course quiz has already been passed */
export function hasPassedQuiz(courseId: string): boolean {
  try {
    return localStorage.getItem(passKey(courseId)) === "1";
  } catch {
    return false;
  }
}

/** Saves a pass — called once when the student passes */
function savePass(courseId: string) {
  try {
    localStorage.setItem(passKey(courseId), "1");
  } catch {}
}

/** Formats ms into mm:ss */
function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

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
  onPassed: () => void;
}

// ─── Per-course config ────────────────────────────────────────────────────────
// Each entry has: a seed prompt AND per-course fallback questions
// so the quiz works even if the API is down or returns bad JSON.
const COURSE_CONFIG: Record<string, {
  seed: string;
  fallbacks: Omit<Question, "id">[];
}> = {
  "react-js": {
    seed: `You are a React JS expert examiner. Generate ONE unique, practical quiz question testing genuine understanding of React.
Topics to choose from: JSX syntax, functional components, useState hook, useEffect hook, props & prop drilling, React Router, CRUD with Fetch API, Context API, Easy Peasy Redux, controlled inputs, event handling.
IMPORTANT: Be creative — vary question style (code snippet, scenario, conceptual). Do NOT repeat common textbook questions.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown, no preamble:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What will happen if you call setState inside a useEffect without a dependency array?", options: ["It runs once on mount", "It creates an infinite re-render loop", "It throws a runtime error", "Nothing — setState is ignored inside effects"], correctIndex: 1, topic: "useEffect Hook", explanation: "Without a dependency array, useEffect runs after every render. Calling setState triggers a re-render, which triggers the effect again — creating an infinite loop." },
      { text: "Which hook lets you share state across multiple components without prop drilling?", options: ["useState", "useRef", "useContext", "useReducer"], correctIndex: 2, topic: "Context API", explanation: "useContext reads from a React Context, allowing any component in the tree to access shared state without passing props down manually." },
      { text: "In React Router v6, which component renders only the first matching route?", options: ["<Router>", "<Switch>", "<Routes>", "<Navigate>"], correctIndex: 2, topic: "React Router", explanation: "<Routes> replaces <Switch> in v6 and renders only the first route that matches the current URL." },
      { text: "What is the correct way to update an object in state without mutating it?", options: ["state.key = value", "setState(state)", "setState({ ...state, key: value })", "setState(Object.assign(state, { key: value }))"], correctIndex: 2, topic: "useState Hook", explanation: "You must create a new object using spread syntax. Mutating state directly won't trigger a re-render." },
      { text: "When does useEffect with an empty dependency array [] run?", options: ["After every render", "Only when a prop changes", "Only once after the initial mount", "Before the component renders"], correctIndex: 2, topic: "useEffect Hook", explanation: "An empty dependency array tells React to run the effect only once — after the first render — mimicking componentDidMount." },
      { text: "What does the 'key' prop do in a list of React elements?", options: ["Sets the element's CSS class", "Helps React identify which items changed, were added, or removed", "Forces the element to re-render", "Sets accessibility labels"], correctIndex: 1, topic: "Lists & Keys", explanation: "Keys give React a stable identity for each list item so it can efficiently update the DOM by only re-rendering what changed." },
      { text: "Which of the following correctly describes a controlled input in React?", options: ["An input whose value is managed by the DOM", "An input that uses a ref to track its value", "An input whose value is driven by React state", "An input with a defaultValue prop"], correctIndex: 2, topic: "Controlled Inputs", explanation: "A controlled input's value is set by React state, and changes are handled by an onChange handler that updates that state." },
      { text: "What does React.memo do?", options: ["Memoizes the return value of an expensive function", "Prevents a component from re-rendering if its props haven't changed", "Stores the previous state value", "Caches API responses"], correctIndex: 1, topic: "Performance", explanation: "React.memo is a higher-order component that skips re-rendering a component if its props are shallowly equal to the previous render." },
      { text: "In Easy Peasy Redux, what is an 'action' used for?", options: ["Fetching data from an API", "Defining the initial state shape", "Updating the store state", "Creating a new store"], correctIndex: 2, topic: "Redux (Easy Peasy)", explanation: "Actions in Easy Peasy are functions that directly update the model's state. They receive the current state and a payload." },
      { text: "What is prop drilling and why is it a problem?", options: ["Passing props directly to a child — no problem", "Passing props through many intermediate components that don't use them", "A technique to deeply clone props", "Using default props as fallbacks"], correctIndex: 1, topic: "Props", explanation: "Prop drilling means passing data through many component layers just to reach a deeply nested child. It makes code harder to maintain and is solved by Context or a state manager." },
    ],
  },

  "javascript": {
    seed: `You are a JavaScript expert examiner. Generate ONE unique, practical quiz question testing modern JavaScript understanding.
Topics: closures, scope (let/const/var), async/await, promises, the event loop, ES6+ features (arrow functions, destructuring, spread, optional chaining), DOM manipulation, error handling, prototypes.
Be creative — mix code snippets, output prediction, and conceptual questions.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What will this log? `console.log(typeof null)`", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correctIndex: 2, topic: "JS Quirks", explanation: "typeof null returns 'object' — this is a long-standing bug in JavaScript that was kept for backwards compatibility." },
      { text: "What does the spread operator (...) do when used with an array?", options: ["Creates a deep clone of the array", "Merges two arrays into a nested array", "Expands the array into individual elements", "Converts the array to a string"], correctIndex: 2, topic: "ES6+", explanation: "The spread operator unpacks elements of an iterable, allowing you to copy or combine arrays: [...arr1, ...arr2]." },
      { text: "Which statement about 'let' vs 'var' is correct?", options: ["Both are function-scoped", "'let' is block-scoped, 'var' is function-scoped", "'var' is block-scoped, 'let' is function-scoped", "Both are block-scoped"], correctIndex: 1, topic: "Scope", explanation: "'let' is block-scoped (limited to the nearest {}), while 'var' is function-scoped (available throughout the entire function)." },
      { text: "What is a closure in JavaScript?", options: ["A function with no return value", "A function that has access to its outer scope's variables even after the outer function returns", "A way to close or terminate a function early", "A function called immediately after definition"], correctIndex: 1, topic: "Closures", explanation: "A closure is created when a function remembers its lexical scope even when executed outside that scope." },
      { text: "What is the output of: `Promise.resolve(1).then(v => v + 1).then(console.log)`?", options: ["1", "2", "undefined", "Promise{2}"], correctIndex: 1, topic: "Promises", explanation: "Each .then receives the return value of the previous handler. 1 + 1 = 2, which is then passed to console.log." },
      { text: "What does 'async' before a function declaration do?", options: ["Makes the function run on a separate thread", "Always makes the function return a Promise", "Pauses execution at every line", "Prevents the function from throwing errors"], correctIndex: 1, topic: "Async/Await", explanation: "An async function always returns a Promise. If you return a non-Promise value, it's automatically wrapped in Promise.resolve()." },
      { text: "What is the event loop's main job in JavaScript?", options: ["Managing memory allocation", "Executing synchronous code faster", "Moving tasks from the callback queue to the call stack when the stack is empty", "Running Web Workers in parallel"], correctIndex: 2, topic: "Event Loop", explanation: "The event loop continuously checks if the call stack is empty, and if so, pushes the next task from the callback queue onto the stack." },
      { text: "What does optional chaining (?.) do?", options: ["Throws an error if a property is null", "Returns undefined instead of throwing an error when accessing a null or undefined property", "Checks if a value is truthy before assigning", "Creates optional function parameters"], correctIndex: 1, topic: "ES6+", explanation: "Optional chaining short-circuits and returns undefined if the object is null or undefined, preventing TypeError crashes." },
      { text: "Which array method returns a new array and does NOT mutate the original?", options: [".push()", ".splice()", ".map()", ".sort()"], correctIndex: 2, topic: "Array Methods", explanation: ".map() returns a new array with the results of calling the callback on each element. The original array is untouched." },
      { text: "What is the difference between == and === in JavaScript?", options: ["No difference", "== checks type and value, === checks only value", "=== checks type and value, == does type coercion first", "=== is only for objects"], correctIndex: 2, topic: "Equality", explanation: "=== is strict equality — it checks both value AND type without coercion. == performs type coercion before comparing, which can lead to unexpected results." },
    ],
  },

  "web-dev": {
    seed: `You are a web development expert examiner. Generate ONE unique, practical quiz question about HTML, CSS, JavaScript, responsive design, web APIs, or Git.
Topics: semantic HTML, CSS flexbox/grid, responsive design, media queries, DOM manipulation, Fetch API, Git commands, deployment basics.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is the purpose of semantic HTML elements like <article>, <nav>, and <section>?", options: ["They add default CSS styling", "They improve SEO and accessibility by giving meaning to content", "They replace <div> with no other benefit", "They are required for HTML5 validation"], correctIndex: 1, topic: "HTML5", explanation: "Semantic elements describe the meaning of content to browsers and screen readers, improving SEO and accessibility." },
      { text: "Which CSS property controls the order of items along the main axis in a flex container?", options: ["align-items", "flex-direction", "justify-content", "flex-wrap"], correctIndex: 2, topic: "CSS Flexbox", explanation: "justify-content aligns flex items along the main axis (horizontal by default) — values include flex-start, center, space-between, space-around." },
      { text: "What does a media query like `@media (max-width: 768px)` do?", options: ["Applies styles only on screens wider than 768px", "Applies styles only on screens 768px wide or narrower", "Sets the viewport width to 768px", "Hides elements larger than 768px"], correctIndex: 1, topic: "Responsive Design", explanation: "max-width: 768px means the styles inside the media query apply when the screen is AT MOST 768px wide — a common mobile breakpoint." },
      { text: "What does `git pull` do?", options: ["Uploads local commits to the remote", "Downloads remote changes and merges them into your current branch", "Creates a new branch", "Reverts the last commit"], correctIndex: 1, topic: "Git", explanation: "git pull fetches changes from the remote repository and automatically merges them into your current local branch." },
      { text: "Which HTTP method is typically used to submit a form and create a new resource?", options: ["GET", "PUT", "POST", "DELETE"], correctIndex: 2, topic: "APIs", explanation: "POST is used to send data to a server to create a new resource. GET retrieves data, PUT updates, DELETE removes." },
      { text: "What is the box model in CSS?", options: ["A 3D model for CSS animations", "The concept that every element is a rectangular box with content, padding, border, and margin", "A CSS framework for layout", "The way browsers parse CSS files"], correctIndex: 1, topic: "CSS", explanation: "The CSS box model describes every HTML element as a box with four layers: content → padding → border → margin." },
      { text: "What does `display: grid` do?", options: ["Makes an element float", "Turns an element into a block-level grid container", "Makes all children invisible", "Applies a 12-column Bootstrap grid"], correctIndex: 1, topic: "CSS Grid", explanation: "display: grid creates a grid formatting context where you can define rows and columns using grid-template-columns and grid-template-rows." },
      { text: "What does the Fetch API return?", options: ["The raw response body as text", "A Promise that resolves to a Response object", "An XMLHttpRequest object", "The parsed JSON directly"], correctIndex: 1, topic: "Fetch API", explanation: "fetch() returns a Promise. You then call .json() or .text() on the Response, which also return Promises." },
      { text: "What is the purpose of the <meta name='viewport'> tag?", options: ["Sets the page title", "Controls how the page is scaled on mobile devices", "Links to a CSS file", "Defines the page language"], correctIndex: 1, topic: "Responsive Design", explanation: "The viewport meta tag tells mobile browsers to set the viewport width to the device width and control initial zoom, essential for responsive layouts." },
      { text: "What does CSS `position: absolute` do?", options: ["Positions an element relative to the browser window", "Removes an element from the document flow and positions it relative to its nearest positioned ancestor", "Makes an element stick when scrolling", "Centers an element horizontally"], correctIndex: 1, topic: "CSS Positioning", explanation: "position: absolute takes the element out of the normal document flow and places it relative to the nearest ancestor with a non-static position." },
    ],
  },

  "python-ai": {
    seed: `You are a Python expert examiner. Generate ONE unique, practical quiz question testing Python for AI/development.
Topics: Python syntax, lists/dicts/tuples/sets, control flow, functions, OOP (classes/inheritance), virtual environments, modules, working with APIs, Git, modern tooling.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is the difference between a list and a tuple in Python?", options: ["Lists are ordered, tuples are not", "Tuples are mutable, lists are not", "Lists are mutable, tuples are immutable", "No difference — they are interchangeable"], correctIndex: 2, topic: "Data Structures", explanation: "Lists are mutable (you can change them after creation). Tuples are immutable — once created, their contents cannot be changed." },
      { text: "What does a virtual environment do in Python?", options: ["Speeds up Python execution", "Creates an isolated environment with its own packages separate from the global Python", "Connects to a remote Python server", "Runs Python in a sandbox for security"], correctIndex: 1, topic: "Virtual Environments", explanation: "Virtual environments isolate project dependencies so different projects can use different package versions without conflicts." },
      { text: "What is the output of: `print(type({}))`?", options: ["<class 'set'>", "<class 'list'>", "<class 'dict'>", "<class 'tuple'>"], correctIndex: 2, topic: "Data Structures", explanation: "{} creates an empty dictionary, not a set. To create an empty set, use set()." },
      { text: "What does 'self' refer to in a Python class method?", options: ["The class itself", "The instance of the class calling the method", "The parent class", "A global variable"], correctIndex: 1, topic: "OOP", explanation: "self refers to the specific instance of the class that is calling the method, giving access to instance attributes and other methods." },
      { text: "Which of these correctly opens a file for reading in Python?", options: ["open('file.txt', 'w')", "open('file.txt', 'a')", "open('file.txt', 'r')", "open('file.txt', 'x')"], correctIndex: 2, topic: "File I/O", explanation: "'r' mode opens a file for reading. 'w' writes (and overwrites), 'a' appends, 'x' creates a new file failing if it exists." },
      { text: "What does a list comprehension `[x*2 for x in range(5)]` produce?", options: ["[0, 2, 4, 6, 8]", "[2, 4, 6, 8, 10]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4]"], correctIndex: 0, topic: "Python Syntax", explanation: "range(5) produces 0,1,2,3,4. Multiplying each by 2 gives [0, 2, 4, 6, 8]." },
      { text: "What is the purpose of __init__ in a Python class?", options: ["It deletes the object", "It's the constructor — called automatically when a new instance is created", "It defines class-level variables only", "It's required for inheritance to work"], correctIndex: 1, topic: "OOP", explanation: "__init__ is the initializer method called automatically when you create a new instance. It sets up the object's initial state." },
      { text: "What does `pip install -r requirements.txt` do?", options: ["Creates a new requirements file", "Installs all packages listed in requirements.txt", "Updates all installed packages", "Removes listed packages"], correctIndex: 1, topic: "Tooling", explanation: "-r flag tells pip to read a requirements file and install all packages listed in it — standard for sharing project dependencies." },
      { text: "How do you make a class B inherit from class A in Python?", options: ["class B extends A:", "class B(A):", "class B inherits A:", "class B -> A:"], correctIndex: 1, topic: "OOP", explanation: "Python uses parentheses for inheritance: class B(A): — this makes B a subclass of A, inheriting all its methods and attributes." },
      { text: "What is the difference between a set and a list in Python?", options: ["Sets are ordered, lists are not", "Lists allow duplicate values, sets do not", "Sets are mutable, lists are not", "No difference"], correctIndex: 1, topic: "Data Structures", explanation: "Sets store unique values only and are unordered. Lists maintain insertion order and can contain duplicates." },
    ],
  },

  "ui-ux": {
    seed: `You are a UI/UX design expert examiner. Generate ONE unique, practical quiz question about UI/UX design principles.
Topics: design thinking process, user research methods, wireframing vs prototyping, information architecture, gestalt principles, color theory (contrast, harmony), typography (hierarchy, readability), usability heuristics, accessibility (WCAG), user personas, A/B testing.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is the purpose of a user persona in UX design?", options: ["To define the visual style of the product", "To represent a fictional but realistic user type based on research, guiding design decisions", "To document technical requirements", "To create the sitemap for a website"], correctIndex: 1, topic: "User Research", explanation: "Personas are fictional characters that represent real user segments based on research. They help designers empathize with users and make decisions that serve real needs." },
      { text: "What is the key difference between a wireframe and a prototype?", options: ["Wireframes are digital, prototypes are on paper", "Wireframes show layout and structure without interactions; prototypes simulate user flows and interactions", "Prototypes are lower fidelity than wireframes", "There is no difference — the terms are interchangeable"], correctIndex: 1, topic: "Wireframing & Prototyping", explanation: "Wireframes are static blueprints showing structure and layout. Prototypes are interactive simulations used to test user flows and gather feedback." },
      { text: "According to WCAG, what is the minimum contrast ratio for normal body text to be considered accessible?", options: ["2:1", "3:1", "4.5:1", "7:1"], correctIndex: 2, topic: "Accessibility", explanation: "WCAG AA requires a contrast ratio of at least 4.5:1 for normal text to ensure readability for users with low vision or color blindness." },
      { text: "What is 'visual hierarchy' in UI design?", options: ["The order in which code renders elements", "The arrangement of elements to guide the user's eye toward the most important information first", "A CSS property for stacking elements", "The file structure of a design system"], correctIndex: 1, topic: "Typography", explanation: "Visual hierarchy uses size, weight, color, and spacing to signal importance, guiding users to read and interact with content in a deliberate order." },
      { text: "What does Nielsen's heuristic 'visibility of system status' mean?", options: ["The system should be fast", "The system should always inform users about what is happening through feedback", "Users should see all features at once", "The interface should use bright colors"], correctIndex: 1, topic: "Usability Heuristics", explanation: "This heuristic means users should always know what the system is doing — e.g., loading spinners, progress bars, confirmation messages after actions." },
      { text: "What is the Gestalt principle of 'proximity'?", options: ["Elements that look similar are perceived as related", "Elements close together are perceived as a group", "The eye is drawn to the largest element first", "Symmetrical designs feel more stable"], correctIndex: 1, topic: "Gestalt Principles", explanation: "Proximity groups nearby elements together in the user's perception, helping organise information without explicit borders or lines." },
      { text: "What is the main goal of the 'Empathize' stage in Design Thinking?", options: ["To build a working prototype quickly", "To deeply understand users' needs, motivations, and pain points", "To define success metrics", "To brainstorm as many solutions as possible"], correctIndex: 1, topic: "Design Thinking", explanation: "The Empathize stage focuses on understanding users through interviews, observation, and research — setting the foundation for designing solutions that truly meet their needs." },
      { text: "What is 'information architecture' in UX?", options: ["The back-end database structure", "The organisation and labelling of content to help users find and understand information", "The visual layout of a page", "The server infrastructure for a web app"], correctIndex: 1, topic: "Information Architecture", explanation: "IA defines how content is structured, organised, and labelled — including navigation, categorisation, and search — to make a product intuitive to use." },
      { text: "Why is using more than 2-3 typefaces in a design generally discouraged?", options: ["It slows down page loading", "It creates visual noise and weakens typographic hierarchy", "Browsers can't render many fonts", "It violates copyright law"], correctIndex: 1, topic: "Typography", explanation: "Too many typefaces create visual clutter and inconsistency. A strong design typically uses one display font and one body font, relying on size, weight, and spacing for variety." },
      { text: "What is A/B testing in UX?", options: ["Comparing two design tools to see which is faster", "Testing two versions of a design with real users to see which performs better", "Writing tests for front-end code", "Getting feedback from two different designers"], correctIndex: 1, topic: "User Research", explanation: "A/B testing shows two variants to different user groups and measures which achieves better outcomes (clicks, conversions, task completion), making decisions data-driven." },
    ],
  },

  "crypto": {
    seed: `You are a blockchain and cryptocurrency expert examiner. Generate ONE unique, practical quiz question about blockchain and crypto.
Topics: how blockchain works, consensus mechanisms (PoW vs PoS), Bitcoin basics, Ethereum and smart contracts, crypto wallets (hot/cold), DeFi protocols, yield farming, NFTs and digital ownership, evaluating crypto projects, risk management.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is a blockchain?", options: ["A type of cryptocurrency", "A distributed ledger of transactions grouped into blocks linked cryptographically", "A centralised database for financial records", "A cloud storage service for crypto keys"], correctIndex: 1, topic: "Blockchain", explanation: "A blockchain is an append-only distributed ledger where transactions are grouped into blocks. Each block contains the hash of the previous block, creating a tamper-evident chain." },
      { text: "What is the key difference between Proof of Work and Proof of Stake?", options: ["PoW uses validators, PoS uses miners", "PoW requires computing power to validate; PoS requires locking up crypto as collateral", "PoS is less secure than PoW", "They are the same thing with different names"], correctIndex: 1, topic: "Consensus Mechanisms", explanation: "PoW (Bitcoin) uses miners competing with computing power. PoS (Ethereum post-merge) selects validators based on how much crypto they 'stake' as collateral — far more energy-efficient." },
      { text: "What is a 'cold wallet'?", options: ["A wallet for storing small amounts of crypto for daily use", "A crypto wallet not connected to the internet, used for secure long-term storage", "A wallet provided by an exchange", "A wallet that only holds stablecoins"], correctIndex: 1, topic: "Wallets & Security", explanation: "Cold wallets (hardware wallets like Ledger, Trezor) are offline, making them immune to remote hacking. Hot wallets are connected to the internet and more convenient but less secure." },
      { text: "What are smart contracts?", options: ["Legal contracts signed digitally", "Self-executing programs stored on a blockchain that run when predefined conditions are met", "Contracts between crypto exchanges", "Insurance products for crypto holders"], correctIndex: 1, topic: "Ethereum", explanation: "Smart contracts are code deployed on a blockchain (like Ethereum). They automatically execute when conditions are met, enabling trustless transactions without intermediaries." },
      { text: "What is DeFi?", options: ["A type of NFT", "Decentralised Finance — financial services built on blockchain without traditional intermediaries like banks", "A centralised crypto exchange", "A hardware wallet brand"], correctIndex: 1, topic: "DeFi", explanation: "DeFi recreates financial services (lending, borrowing, trading, earning yield) using smart contracts on public blockchains, removing the need for banks or brokers." },
      { text: "What does 'yield farming' in DeFi mean?", options: ["Mining new cryptocurrency", "Providing liquidity to DeFi protocols in exchange for rewards/interest", "Staking for a fixed APY on a centralised exchange", "Creating new NFTs"], correctIndex: 1, topic: "DeFi", explanation: "Yield farming involves depositing crypto into DeFi protocols (like Uniswap or Aave) to provide liquidity and earn returns in the form of trading fees and governance tokens." },
      { text: "What gives an NFT its uniqueness?", options: ["It's stored on a private server", "Each NFT has a unique token ID on the blockchain that cannot be replicated", "NFTs are printed as physical certificates", "They use a different blockchain than other crypto"], correctIndex: 1, topic: "NFTs", explanation: "Each NFT is a unique token on a blockchain with a distinct token ID. The metadata and ownership record are verifiable and cannot be duplicated." },
      { text: "What is a seed phrase (recovery phrase)?", options: ["The password for your exchange account", "A sequence of 12-24 words that can fully restore access to a crypto wallet", "A unique transaction ID", "A QR code for receiving crypto"], correctIndex: 1, topic: "Wallets & Security", explanation: "A seed phrase is the master backup for a crypto wallet. Anyone with these words can access the wallet — it must be stored securely offline and never shared." },
      { text: "What is a 'rug pull' in crypto?", options: ["A failed smart contract audit", "When developers abandon a project and run off with investor funds", "A bear market crash", "When a wallet is hacked"], correctIndex: 1, topic: "Risk & Security", explanation: "A rug pull is a scam where developers create a project, attract investment, then suddenly withdraw all liquidity or abandon it — leaving investors with worthless tokens." },
      { text: "What does 'DYOR' mean in the crypto community?", options: ["Deploy Your Own Repository", "Do Your Own Research — evaluate projects independently before investing", "Diversify Your Own Returns", "Don't Yield On Risk"], correctIndex: 1, topic: "Risk Management", explanation: "DYOR is a reminder that investors should independently research projects — reading whitepapers, checking team backgrounds, and understanding tokenomics — rather than following hype." },
    ],
  },

  "solidity-web3": {
    seed: `You are a Solidity and Web3 expert examiner. Generate ONE unique, practical quiz question about Solidity and dApp development.
Topics: Solidity syntax, state variables vs local variables, mappings, structs, events, modifiers, payable functions, smart contract security (reentrancy, overflow), Hardhat testing, Ethers.js, connecting wallet to dApp, deploying contracts.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is the difference between 'memory' and 'storage' in Solidity?", options: ["They are the same", "Storage is persistent on the blockchain; memory is temporary during function execution", "Memory is persistent, storage is temporary", "Storage is for arrays only"], correctIndex: 1, topic: "Solidity Basics", explanation: "Storage is permanent state saved on the blockchain (expensive). Memory is temporary data that exists only during a function call (cheaper) and is discarded afterwards." },
      { text: "What does the 'payable' modifier do in Solidity?", options: ["Allows the function to call other contracts", "Allows the function to receive Ether", "Marks a function as paid/premium", "Prevents a function from being called externally"], correctIndex: 1, topic: "Smart Contracts", explanation: "Functions marked 'payable' can receive Ether. Without this modifier, sending Ether to a function causes the transaction to revert." },
      { text: "What is a mapping in Solidity?", options: ["A function that transforms arrays", "A key-value data structure similar to a hash map", "A way to import other contracts", "An ordered list of elements"], correctIndex: 1, topic: "Solidity Basics", explanation: "Mappings are key-value stores: mapping(address => uint) balance. They're efficient for looking up values by key but can't be iterated over." },
      { text: "What is a reentrancy attack?", options: ["Calling the same function twice in one transaction", "An exploit where an external contract calls back into the vulnerable contract before the first execution finishes", "A bug caused by integer overflow", "Deploying the same contract twice"], correctIndex: 1, topic: "Security", explanation: "Reentrancy happens when a malicious contract calls back into the victim before state is updated. The fix: update state BEFORE sending Ether (checks-effects-interactions pattern)." },
      { text: "What do Solidity events do?", options: ["Trigger automatic contract execution", "Emit logs stored on the blockchain that front-end apps can listen to", "Send Ether to an address", "Call functions in other contracts"], correctIndex: 1, topic: "Events", explanation: "Events emit logs that are stored cheaply on the blockchain. Front-end apps (using Ethers.js/Web3.js) can subscribe to these events to react to on-chain state changes." },
      { text: "What is Hardhat used for in Web3 development?", options: ["A front-end UI framework for dApps", "A development environment for compiling, testing, and deploying Solidity contracts", "A blockchain explorer", "A hardware wallet manager"], correctIndex: 1, topic: "Hardhat", explanation: "Hardhat is a development toolchain for Ethereum: it compiles Solidity, runs a local blockchain for testing, runs tests, and scripts contract deployment." },
      { text: "In Ethers.js, what does `provider.getSigner()` return?", options: ["The user's public address", "A Signer object that can sign and send transactions on behalf of the connected wallet", "The current gas price", "A list of all accounts"], correctIndex: 1, topic: "Ethers.js", explanation: "getSigner() returns a Signer — an abstraction of the connected wallet that can sign messages and send transactions. It's used to interact with contracts on behalf of the user." },
      { text: "What does 'msg.sender' refer to in Solidity?", options: ["The contract's own address", "The address of the account or contract that called the current function", "The contract owner's address", "The address that deployed the contract"], correctIndex: 1, topic: "Solidity Basics", explanation: "msg.sender is a global variable in Solidity that always holds the address of whoever called the current function — used for access control and tracking ownership." },
      { text: "What is an ABI in the context of smart contracts?", options: ["A type of token standard", "The Application Binary Interface — a JSON description of a contract's functions and events used by front-end apps", "A security audit report", "The bytecode of a compiled contract"], correctIndex: 1, topic: "Deployment", explanation: "The ABI defines how to call a contract's functions — their names, input types, and return types. Ethers.js uses the ABI to encode/decode interactions with the contract." },
      { text: "What is a modifier in Solidity?", options: ["A way to change the Solidity version", "Reusable code that can be attached to functions to add pre or post conditions", "A type of variable", "A function that modifies arrays"], correctIndex: 1, topic: "Solidity Basics", explanation: "Modifiers like onlyOwner wrap function logic with preconditions. The _ symbol shows where the function body executes. They reduce code duplication for access control." },
    ],
  },

  "digital-marketing": {
    seed: `You are a digital marketing expert examiner. Generate ONE unique, practical quiz question about digital marketing.
Topics: the 5-step marketing master plan (Model/Market/Message/Media/Machine), organic vs paid marketing, direct response vs brand awareness, search vs discovery marketing, marketing products vs services, B2B vs B2C differences, marketing funnels, content marketing.
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is the core difference between 'search' and 'discovery' marketing channels?", options: ["Search is free, discovery is paid", "Search targets people actively looking for something; discovery interrupts people who aren't looking yet", "Discovery marketing uses SEO; search uses social media", "They are the same thing"], correctIndex: 1, topic: "Search vs Discovery", explanation: "Search channels (Google, YouTube search) capture existing demand from people already looking. Discovery channels (Instagram, TikTok, display ads) create demand by reaching people not actively searching." },
      { text: "What distinguishes direct response marketing from brand awareness marketing?", options: ["Brand awareness uses social media, direct response uses email", "Direct response aims for an immediate measurable action (click, purchase); brand awareness builds recognition over time", "Direct response is always cheaper", "Brand awareness only works for large companies"], correctIndex: 1, topic: "Direct Response vs Brand Awareness", explanation: "Direct response marketing asks for a specific action now and is measurable (CPA, ROAS). Brand awareness builds familiarity and trust over time — harder to measure directly." },
      { text: "In B2B marketing, buying decisions are typically made by:", options: ["A single impulsive consumer", "Multiple stakeholders with longer sales cycles and more rational decision-making", "Anyone who sees the ad first", "Only the CEO"], correctIndex: 1, topic: "B2B vs B2C", explanation: "B2B sales involve committees, procurement processes, and longer cycles. Marketing must address different stakeholders (users, managers, finance) with rational ROI-focused arguments." },
      { text: "What is 'organic marketing'?", options: ["Marketing products grown without pesticides", "Earning traffic and visibility without paying for ads — through SEO, content, and social media", "Email marketing campaigns", "Influencer marketing"], correctIndex: 1, topic: "Organic vs Paid", explanation: "Organic marketing generates visibility without direct ad spend — through SEO-optimised content, social media, word-of-mouth, and PR. It's slower to build but more sustainable long-term." },
      { text: "What does the 'Message' step in the 5-step marketing master plan focus on?", options: ["Which media channels to advertise on", "Crafting the right offer and copy that resonates with your target market", "Building the technical marketing infrastructure", "Choosing your business model"], correctIndex: 1, topic: "Marketing Master Plan", explanation: "The Message step is about what you say and how you say it — developing compelling offers, headlines, and copy that speak directly to your target market's needs and desires." },
      { text: "Why is marketing a service typically harder than marketing a product?", options: ["Services are always more expensive", "Services are intangible — customers can't evaluate them before purchase, making trust the critical factor", "There are more service businesses competing", "Services have lower profit margins"], correctIndex: 1, topic: "Products vs Services", explanation: "Services lack a physical product to evaluate. Buyers rely on testimonials, case studies, reviews, and the marketer's credibility to reduce perceived risk before buying." },
      { text: "What is a marketing funnel?", options: ["A tool for filtering email lists", "A model showing the stages customers go through from awareness to purchase", "A type of paid advertising format", "A social media algorithm"], correctIndex: 1, topic: "Marketing Funnel", explanation: "A funnel maps the customer journey: Awareness → Interest → Consideration → Intent → Purchase. Marketing strategies differ at each stage." },
      { text: "What is 'content marketing'?", options: ["Paying for sponsored content on news sites", "Creating and distributing valuable, relevant content to attract and retain a target audience", "Writing product descriptions for e-commerce", "A/B testing ad copy"], correctIndex: 1, topic: "Organic vs Paid", explanation: "Content marketing provides genuine value (blogs, videos, podcasts, guides) to build trust and attract an audience organically — positioning the brand as an authority." },
      { text: "What does ROAS stand for and why does it matter?", options: ["Return On Ad Spend — measures revenue generated per dollar spent on ads", "Rate Of Ad Success — measures click-through rates", "Reach Of Advertising System — measures impressions", "Risk Of Ad Spend — measures wasted budget"], correctIndex: 0, topic: "Paid Marketing", explanation: "ROAS = Revenue / Ad Spend. A ROAS of 4 means you earn $4 for every $1 spent. It's the primary metric for evaluating paid advertising efficiency." },
      { text: "What is the main advantage of paid marketing over organic marketing?", options: ["It's always cheaper in the long run", "It delivers faster, scalable, and more predictable results", "It builds more trust with audiences", "It doesn't require a budget"], correctIndex: 1, topic: "Organic vs Paid", explanation: "Paid marketing can deliver immediate results at scale and be dialled up or down quickly. Organic growth is slower and less predictable, though more cost-effective long-term." },
    ],
  },

  "social-media-mgmt": {
    seed: `You are a social media management expert examiner. Generate ONE unique, practical quiz question about professional social media management.
Topics: defining the SMM role, client onboarding process, contract essentials, finding a niche, pricing strategies (retainer vs project), building service packages, social media audits, competitor analysis, content calendars, discovery calls, client communication, tools (Airtable, Trello, Buffer, Hootsuite).
Random seed for variety: SEED_TOKEN
Return ONLY valid JSON, no markdown:
{"text":"...","options":["A","B","C","D"],"correctIndex":0,"topic":"...","explanation":"..."}`,
    fallbacks: [
      { text: "What is the primary purpose of a social media audit for a new client?", options: ["To immediately fix their social media accounts", "To assess the current state of their social presence — performance, branding, audience, and gaps", "To create a content calendar", "To decide which platforms to delete"], correctIndex: 1, topic: "Social Media Audits", explanation: "An audit gives you a baseline: current follower counts, engagement rates, brand consistency, posting frequency, and competitor comparison — informing your strategy." },
      { text: "Why is a discovery call important before signing a client?", options: ["It's a legal requirement", "It helps you understand their goals, challenges, and whether they're a good fit before committing", "It replaces the need for a contract", "It's used to negotiate the lowest possible price"], correctIndex: 1, topic: "Discovery Calls", explanation: "A discovery call lets you understand what the client needs, set expectations, identify red flags, and determine if you can genuinely help them — saving both parties time." },
      { text: "What is a retainer pricing model in social media management?", options: ["Charging per post published", "Charging a fixed monthly fee for an ongoing scope of work", "Taking a percentage of the client's revenue", "Charging only when results are achieved"], correctIndex: 1, topic: "Pricing Strategies", explanation: "A retainer means the client pays a fixed monthly amount for agreed services (e.g., X posts/week, community management, reporting). It provides income stability for the SMM and budget predictability for the client." },
      { text: "What should a social media management contract always include?", options: ["Only the monthly price and start date", "Scope of work, deliverables, payment terms, revision policy, and termination clause", "The client's login credentials", "A non-disclosure agreement only"], correctIndex: 1, topic: "Contracts", explanation: "A solid contract protects both parties. It must define exactly what you'll deliver, when you'll be paid, how many revisions are included, and how either party can end the agreement." },
      { text: "Why is niching down as a social media manager beneficial?", options: ["It limits the number of clients you can work with", "It makes you a specialist, allowing you to charge more and attract better-fit clients", "It's required to get clients on freelance platforms", "It makes audits easier to automate"], correctIndex: 1, topic: "Finding Your Niche", explanation: "Specialists command higher rates than generalists. When you focus on a niche (e.g., restaurants, fitness coaches, SaaS), you develop deep expertise and become the obvious choice for that market." },
      { text: "What is a content calendar and why is it important?", options: ["A scheduling tool that only posts content automatically", "A planned schedule of content topics, formats, and posting times to maintain consistency", "A list of trending hashtags", "A tool for measuring engagement metrics"], correctIndex: 1, topic: "Content Calendars", explanation: "A content calendar keeps you organised and consistent — planning content in advance prevents last-minute scrambling and ensures a balanced content mix aligned with client goals." },
      { text: "During client onboarding, why should you collect brand assets and guidelines?", options: ["To post immediately without approval", "To ensure all content is visually consistent with the client's existing brand identity", "To charge for additional design work", "It's not necessary for social media"], correctIndex: 1, topic: "Client Onboarding", explanation: "Brand assets (logos, colours, fonts, voice guidelines) ensure everything you create looks and sounds like the client, not a generic social media account. Consistency builds brand recognition." },
      { text: "What is competitor analysis in social media strategy?", options: ["Copying competitor content directly", "Studying competitors' social presence to identify gaps, opportunities, and benchmarks", "Reporting competitors for copyright violations", "Following competitors to steal their followers"], correctIndex: 1, topic: "Social Media Audits", explanation: "Competitor analysis reveals what's working in the industry, where gaps exist, and what benchmarks are realistic — informing a differentiated strategy for your client." },
      { text: "What is the most important thing to establish with a client before starting work?", options: ["Their social media passwords", "Clear goals, KPIs, and expectations for what success looks like", "A list of all their competitors", "Their preferred posting times"], correctIndex: 1, topic: "Client Onboarding", explanation: "Without agreed-upon goals and success metrics upfront, you can't demonstrate value or know when you've succeeded. This also protects you from scope creep." },
      { text: "What is scope creep and how do you prevent it?", options: ["When a client asks for fewer deliverables over time", "When a client requests more work than agreed without additional payment — prevented by a detailed contract and clear communication", "When your content strategy expands to new platforms naturally", "A bug in scheduling software"], correctIndex: 1, topic: "Contracts", explanation: "Scope creep is when the work keeps expanding beyond what was agreed. A detailed contract with specific deliverables, plus clear communication when extra requests arise, is how you manage it." },
    ],
  },
};

// Generic fallback for any unmapped courseId
const GENERIC_FALLBACKS: Omit<Question, "id">[] = [
  { text: "What is the most effective way to learn a new skill?", options: ["Passive reading only", "Active practice combined with spaced repetition", "Watching videos without taking notes", "Memorising definitions"], correctIndex: 1, topic: "Learning", explanation: "Active practice with spaced repetition (reviewing material at increasing intervals) is backed by research as the most effective learning method." },
];

const PASS_THRESHOLD = 8;
const TOTAL = 10;

// ─── API call ─────────────────────────────────────────────────────────────────
async function fetchQuestion(
  courseId: string,
  coveredTopics: string[],
  wrongTopic?: string
): Promise<Question | null> {
  const config = COURSE_CONFIG[courseId];
  if (!config) return null;

  try {
    // Inject a random seed token so Claude gives different questions each time
    const entropy = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const seededPrompt = config.seed.replace("SEED_TOKEN", entropy);

    const hint = wrongTopic
      ? `\n\nThe student just answered a question about "${wrongTopic}" INCORRECTLY. Generate a DIFFERENT question specifically targeting "${wrongTopic}" to reinforce that concept.`
      : `\n\nTopics already covered this session: [${coveredTopics.join(", ") || "none"}]. You MUST pick a topic NOT in that list.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [{ role: "user", content: seededPrompt + hint }],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.content?.find((b: any) => b.type === "text")?.text ?? "";
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    // Extract JSON even if there's surrounding text
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const obj = JSON.parse(jsonMatch[0]);
    if (
      typeof obj.text !== "string" ||
      !Array.isArray(obj.options) ||
      obj.options.length !== 4 ||
      typeof obj.correctIndex !== "number" ||
      obj.correctIndex < 0 ||
      obj.correctIndex > 3
    ) return null;
    return { id: Math.random().toString(36).slice(2), ...obj };
  } catch {
    return null;
  }
}

// Get a fallback question for this course that hasn't been used yet
function getFallback(courseId: string, usedIds: Set<string>): Question {
  const config = COURSE_CONFIG[courseId];
  const pool = config ? config.fallbacks : GENERIC_FALLBACKS;
  // Find one not used yet
  const unused = pool.filter((_, i) => !usedIds.has(`fb-${courseId}-${i}`));
  const item = unused.length > 0
    ? unused[Math.floor(Math.random() * unused.length)]
    : pool[Math.floor(Math.random() * pool.length)];
  const idx = pool.indexOf(item);
  return { id: `fb-${courseId}-${idx}`, ...item };
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function ProgressDots({ total, current, answers }: {
  total: number; current: number; answers: { correct: boolean }[]
}) {
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

  // If already passed, skip the quiz entirely and call onPassed immediately
  const [alreadyPassed] = useState(() => hasPassedQuiz(courseId));
  useEffect(() => {
    if (isOpen && alreadyPassed) {
      // Tiny delay so parent state settles before the cert modal opens
      const t = setTimeout(() => onPassed(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen, alreadyPassed, onPassed]);

  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  // BUG FIX: store answers in a ref as well so handleNext can read the
  // fully-up-to-date value without depending on stale state closure
  const [answers, setAnswers] = useState<{ correct: boolean; topic: string }[]>([]);
  const answersRef = useRef<{ correct: boolean; topic: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizKey, setQuizKey] = useState(0);

  // ── 1-hour lockout after failing ──────────────────────────────────────
  const [lockoutMs, setLockoutMs] = useState<number>(0);

  // Check lockout on open and tick every second while locked
  useEffect(() => {
    if (!isOpen) return;
    const remaining = getLockoutRemaining(courseId);
    setLockoutMs(remaining);
    if (remaining <= 0) return;
    const interval = setInterval(() => {
      const r = getLockoutRemaining(courseId);
      setLockoutMs(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, courseId, quizKey]);

  const coveredTopics = useRef<string[]>([]);
  const lastWrongTopic = useRef<string | undefined>(undefined);
  const usedFallbackIds = useRef<Set<string>>(new Set());
  // BUG FIX: store courseId in a ref so loadQuestion always reads current value
  const courseIdRef = useRef(courseId);

  // Keep courseIdRef in sync
  useEffect(() => { courseIdRef.current = courseId; }, [courseId]);

  // Reset everything when modal opens or quiz is retried
  useEffect(() => {
    if (isOpen) {
      setPhase("intro");
      setQuestions([]);
      setCurrentIdx(0);
      setSelected(null);
      setRevealed(false);
      setAnswers([]);
      answersRef.current = [];
      setResult(null);
      setIsFollowUp(false);
      coveredTopics.current = [];
      lastWrongTopic.current = undefined;
      usedFallbackIds.current = new Set();
    }
  }, [isOpen, quizKey]);

  const loadQuestion = async (wrongTopic?: string) => {
    setLoading(true);
    setSelected(null);
    setRevealed(false);

    const cid = courseIdRef.current;
    const q = await fetchQuestion(cid, coveredTopics.current, wrongTopic);
    const question = q ?? getFallback(cid, usedFallbackIds.current);

    // Track used fallback ids
    if (question.id.startsWith("fb-")) usedFallbackIds.current.add(question.id);
    coveredTopics.current.push(question.topic);
    setQuestions((prev) => [...prev, question]);
    setLoading(false);
  };

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
    // BUG FIX: update both state AND ref together
    const newAnswers = [...answersRef.current, { correct, topic: q.topic }];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);
    lastWrongTopic.current = correct ? undefined : q.topic;
  };

  const handleNext = async () => {
    const nextIdx = currentIdx + 1;

    if (nextIdx >= TOTAL) {
      // BUG FIX: use answersRef.current (always up to date) not answers (stale closure)
      const finalAnswers = answersRef.current;
      const score = finalAnswers.filter((a) => a.correct).length;
      const topicMap: Record<string, { c: number; t: number }> = {};
      finalAnswers.forEach((a) => {
        if (!topicMap[a.topic]) topicMap[a.topic] = { c: 0, t: 0 };
        topicMap[a.topic].t++;
        if (a.correct) topicMap[a.topic].c++;
      });
      const weakTopics = Object.entries(topicMap)
        .filter(([, v]) => v.c / v.t < 0.6)
        .map(([k]) => k);
      setResult({ passed: score >= PASS_THRESHOLD, score, total: TOTAL, weakTopics });
      // Persist the outcome
      if (score >= PASS_THRESHOLD) {
        savePass(courseIdRef.current);
      } else {
        // If failed, record the timestamp so the 1-hour lockout starts
        saveLockout(courseIdRef.current);
        setLockoutMs(LOCKOUT_MS);
      }
      setPhase("result");
      return;
    }

    setCurrentIdx(nextIdx);
    const wrongTopic = lastWrongTopic.current;
    setIsFollowUp(!!wrongTopic);
    lastWrongTopic.current = undefined;

    if (questions[nextIdx]) {
      setSelected(null);
      setRevealed(false);
    } else {
      await loadQuestion(wrongTopic);
    }
  };

  const handleRetry = () => setQuizKey((k) => k + 1);

  if (!isOpen || alreadyPassed) return null;

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

      {/* Backdrop — only closes on intro phase */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={phase === "intro" ? onClose : undefined}
      />

      <div className="quiz-root quiz-modal relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 flex-shrink-0" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md flex-shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none mb-0.5">
              Knowledge Check
            </p>
            <p className="text-sm font-black text-slate-800 truncate">{courseTitle}</p>
          </div>
          {phase === "intro" && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          )}
          {phase === "quiz" && (
            <ProgressDots total={TOTAL} current={currentIdx} answers={answers} />
          )}
        </div>

        <div className="overflow-y-auto max-h-[75vh] flex-1">

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <div className="flex flex-col items-center text-center px-6 py-8 gap-5">
              {lockoutMs > 0 ? (
                /* Already locked when they try to open — show countdown */
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-xl shadow-rose-300/40">
                    <Timer className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">
                      Retake locked
                    </p>
                    <h2 className="text-xl font-black text-slate-900">Come back later</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                      You failed the quiz. Review the course material and retake in:
                    </p>
                    <p className="text-4xl font-black text-rose-500 tabular-nums tracking-widest pt-2">
                      {formatCountdown(lockoutMs)}
                    </p>
                  </div>
                  <div className="w-full max-w-xs">
                    <div className="w-full h-2 bg-rose-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400 transition-all duration-1000"
                        style={{ width: `${Math.round((lockoutMs / LOCKOUT_MS) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 text-center">
                      1 hour cooldown · review your weak topics in the meantime
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-3 rounded-2xl transition-all text-sm"
                  >
                    <X className="w-4 h-4" /> Close
                  </button>
                </>
              ) : (
                /* Normal intro */
                <>
                  <div className="float-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl shadow-blue-400/30">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                      Before your certificate
                    </p>
                    <h2 className="text-xl font-black text-slate-900">Quick knowledge check</h2>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Answer <strong>10 questions</strong> about what you just learned.
                      Score <strong>8/10 or higher</strong> to unlock your certificate.
                    </p>
                  </div>
                  <div className="w-full space-y-2 text-left">
                    {[
                      { icon: "🎯", text: "Adaptive — get one wrong and the next question targets that topic" },
                      { icon: "⚡", text: "No time limit — read carefully and take your time" },
                      { icon: "🏆", text: "Pass once and your certificate unlocks permanently" },
                      { icon: "⏳", text: "Fail and you must wait 1 hour before retaking" },
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
                </>
              )}
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
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
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
                      } else if (selected === i) {
                        cls = "border-2 border-blue-500 bg-blue-50 cursor-pointer";
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleSelect(i)}
                          disabled={revealed}
                          className={`q-opt w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left ${cls}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black border-2 transition-colors
                            ${revealed && i === q.correctIndex ? "border-emerald-500 bg-emerald-500 text-white"
                              : revealed && i === selected ? "border-rose-500 bg-rose-500 text-white"
                              : selected === i ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-300 text-slate-400"}`}>
                            {revealed && i === q.correctIndex
                              ? <CheckCircle2 className="w-3.5 h-3.5" />
                              : revealed && i === selected
                              ? <XCircle className="w-3.5 h-3.5" />
                              : ["A", "B", "C", "D"][i]}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {revealed && (
                    <div className={`quiz-fade rounded-xl border px-4 py-3
                      ${answers[answers.length - 1]?.correct
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"}`}>
                      <p className="font-bold text-[11px] mb-1">
                        {answers[answers.length - 1]?.correct ? "✓ Correct!" : "✗ Not quite —"}
                      </p>
                      <p className="text-[12px] opacity-90 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    {!revealed ? (
                      <button
                        onClick={handleConfirm}
                        disabled={selected === null}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95"
                      >
                        Confirm <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95"
                      >
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
                ${result.passed
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-300/40"
                  : "bg-gradient-to-br from-rose-400 to-rose-600 shadow-rose-300/40"}`}>
                {result.passed
                  ? <Trophy className="w-8 h-8 text-white" />
                  : <RotateCcw className="w-8 h-8 text-white" />}
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
                    : `You scored ${Math.round((result.score / result.total) * 100)}% — need 80% to pass. Review the topics below and try again.`}
                </p>
              </div>

              <div className="w-full max-w-xs space-y-1">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${result.passed ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-gradient-to-r from-rose-400 to-rose-500"}`}
                    style={{ width: `${Math.round((result.score / result.total) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>0%</span>
                  <span className="text-blue-400 font-bold">80% needed</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap justify-center">
                {answers.map((a, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white ${a.correct ? "bg-emerald-400" : "bg-rose-400"}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {result.weakTopics.length > 0 && (
                <div className="w-full text-left space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Revisit these topics
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.weakTopics.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full"
                      >
                        <XCircle className="w-3 h-3" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.passed ? (
                <button
                  onClick={onPassed}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-300/30 transition-all active:scale-95 text-sm"
                >
                  Claim My Certificate 🎓 <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="w-full space-y-3">
                  {lockoutMs > 0 ? (
                    /* ── Locked: show countdown ── */
                    <div className="w-full rounded-2xl overflow-hidden border border-rose-200 bg-rose-50">
                      <div className="px-4 py-3 flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-rose-500" />
                          <p className="text-xs font-black text-rose-600 uppercase tracking-wide">
                            Retake locked
                          </p>
                        </div>
                        <p className="text-3xl font-black text-rose-600 tabular-nums tracking-widest">
                          {formatCountdown(lockoutMs)}
                        </p>
                        <p className="text-[11px] text-rose-500 leading-relaxed">
                          Review your weak topics above, then come back in 1 hour to retake.
                        </p>
                      </div>
                      {/* Drain bar showing time passing */}
                      <div className="h-1.5 bg-rose-200 w-full">
                        <div
                          className="h-full bg-rose-500 transition-all duration-1000"
                          style={{ width: `${Math.round((lockoutMs / LOCKOUT_MS) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    /* ── Unlocked: show retry button ── */
                    <>
                      <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-2xl px-4 py-3">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <p className="text-xs text-slate-500 font-semibold">
                          Retake to unlock your certificate
                        </p>
                      </div>
                      <button
                        onClick={handleRetry}
                        className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition-all active:scale-95 text-sm"
                      >
                        <RotateCcw className="w-4 h-4" /> Try Again
                      </button>
                    </>
                  )}
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