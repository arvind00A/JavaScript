// ============================================================
// Section 1 — Introduction & Setup
// Practice Exercises: Easy → Moderate → Hard
// Run: node 01-introduction-setup.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Print to console using different methods
console.log("=== E1: Console Methods ===");
console.log("Hello, JavaScript!");
console.warn("This is a warning");
console.error("This is an error");
console.info("Node.js version:", process.version);

// E2: Basic arithmetic output
console.log("\n=== E2: Arithmetic ===");
console.log("5 + 3 =", 5 + 3);
console.log("10 - 4 =", 10 - 4);
console.log("6 * 7 =", 6 * 7);
console.log("15 / 4 =", 15 / 4);
console.log("15 % 4 =", 15 % 4);  // remainder
console.log("2 ** 8 =", 2 ** 8);  // power

// E3: console.table with array of objects
console.log("\n=== E3: console.table ===");
const students = [
  { name: "Alice", grade: "A", score: 95 },
  { name: "Bob",   grade: "B", score: 82 },
  { name: "Carol", grade: "A", score: 91 },
];
console.table(students);

// E4: Timer usage
console.log("\n=== E4: Console Timer ===");
console.time("loop-timer");
let sum = 0;
for (let i = 1; i <= 1_000_000; i++) sum += i;
console.timeEnd("loop-timer");
console.log("Sum of 1 to 1,000,000 =", sum);

// ── MODERATE ──────────────────────────────────────────────

// M1: Detect environment (browser vs Node.js)
console.log("\n=== M1: Environment Detection ===");
const isNode = typeof process !== "undefined" && process.versions?.node;
const isBrowser = typeof window !== "undefined";
if (isNode) {
  console.log("Running in Node.js:", process.version);
  console.log("Platform:", process.platform);
  console.log("Architecture:", process.arch);
} else if (isBrowser) {
  console.log("Running in browser:", navigator.userAgent);
} else {
  console.log("Unknown environment");
}

// M2: Grouped console output
console.log("\n=== M2: Grouped Output ===");
console.group("📦 Project Info");
  console.log("Name: JS Roadmap");
  console.log("Version: 1.0.0");
  console.group("📁 Structure");
    console.log("cheatsheets/");
    console.log("projects/");
  console.groupEnd();
console.groupEnd();

// M3: Build a simple greeting function and log it
console.log("\n=== M3: Greeting Function ===");
function greet(name, timeOfDay = "day") {
  const greetings = {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    day: "Hello",
  };
  const greeting = greetings[timeOfDay] || greetings.day;
  return `${greeting}, ${name}! Welcome to JavaScript.`;
}
console.log(greet("Alice", "morning"));
console.log(greet("Bob", "evening"));
console.log(greet("Carol"));

// M4: Process arguments from command line
console.log("\n=== M4: Command Line Args ===");
// Run: node 01-introduction-setup.js Alice 25
const args = process.argv.slice(2); // skip 'node' and filename
if (args.length > 0) {
  console.log("Arguments passed:", args);
  console.log(`Hello, ${args[0]}!`);
} else {
  console.log("No arguments passed. Try: node file.js YourName");
  console.log("All process.argv:", process.argv);
}

// ── HARD ──────────────────────────────────────────────────

// H1: Build a simple debugging utility
console.log("\n=== H1: Debug Utility ===");
const DEBUG = true; // toggle this to enable/disable debug output

const logger = {
  levels: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 },
  currentLevel: 0,

  log(level, ...args) {
    if (this.levels[level] >= this.currentLevel) {
      const timestamp = new Date().toISOString();
      const prefix = `[${timestamp}] [${level}]`;
      if (level === "ERROR") console.error(prefix, ...args);
      else if (level === "WARN")  console.warn(prefix, ...args);
      else console.log(prefix, ...args);
    }
  },

  debug(...args) { this.log("DEBUG", ...args); },
  info(...args)  { this.log("INFO",  ...args); },
  warn(...args)  { this.log("WARN",  ...args); },
  error(...args) { this.log("ERROR", ...args); },
};

logger.debug("Starting application...");
logger.info("Server initialised on port 3000");
logger.warn("Config file not found, using defaults");
logger.error("Database connection failed");

// H2: Performance measurement utility
console.log("\n=== H2: Performance Measurement ===");
function measurePerformance(label, fn) {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`⏱  ${label}: ${(end - start).toFixed(4)}ms`);
  return result;
}

// Compare two approaches
measurePerformance("for loop sum", () => {
  let s = 0;
  for (let i = 1; i <= 100000; i++) s += i;
  return s;
});

measurePerformance("math formula sum", () => {
  const n = 100000;
  return (n * (n + 1)) / 2;
});

measurePerformance("Array.from + reduce", () => {
  return Array.from({ length: 100000 }, (_, i) => i + 1)
    .reduce((acc, n) => acc + n, 0);
});

// H3: JS version / feature detection utility
console.log("\n=== H3: Feature Detection ===");
const features = {
  "Optional chaining (?.)":   (() => { try { return ({})?._?.x === undefined; } catch { return false; } })(),
  "Nullish coalescing (??)":   (() => { try { return (null ?? "y") === "y"; }           catch { return false; } })(),
  "BigInt":                    typeof BigInt !== "undefined",
  "Promise":                   typeof Promise !== "undefined",
  "async/await":               (async () => {})() instanceof Promise,
  "Destructuring":             (() => { try { const [a] = [1]; return a === 1; }        catch { return false; } })(),
  "Arrow functions":           (() => { try { return (() => true)(); }                  catch { return false; } })(),
  "Template literals":         (() => { try { return `${"ok"}` === "ok"; }              catch { return false; } })(),
  "Spread operator":           (() => { try { return [...[1,2]].length === 2; }         catch { return false; } })(),
  "Modules (ESM)":             typeof import !== "undefined",
};

console.log("\nSupported JS Features:");
for (const [feature, supported] of Object.entries(features)) {
  console.log(`  ${supported ? "✅" : "❌"} ${feature}`);
}

// H4: Simple Node.js environment report
console.log("\n=== H4: Environment Report ===");
if (typeof process !== "undefined") {
  const report = {
    "Node Version":    process.version,
    "Platform":        process.platform,
    "Architecture":    process.arch,
    "Working Dir":     process.cwd(),
    "Script Path":     __filename,
    "Uptime (sec)":    process.uptime().toFixed(2),
    "Memory (MB)":     (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
  };
  console.table(Object.entries(report).map(([k, v]) => ({ Property: k, Value: v })));
}
