# 🚀 Section 22 — Bonus / Advanced Topics

---

## JavaScript Engine (V8 Basics)
```
Source Code
    ↓
Tokenizer / Lexer  →  Tokens
    ↓
Parser             →  AST (Abstract Syntax Tree)
    ↓
Ignition (Interpreter)  →  Bytecode (fast startup)
    ↓
TurboFan (JIT Compiler) →  Optimised Machine Code (hot paths)
```
- **V8** parses and runs JS in Chrome and Node.js
- **JIT (Just-In-Time) compilation** — code that runs repeatedly gets optimised
- **Inline caches** — V8 remembers types of object properties for faster access
- **Deoptimisation** — if assumptions break (type changes), V8 falls back

## Event Loop
```
Call Stack         Web APIs / Node APIs        Task Queues
──────────         ─────────────────────       ──────────────────────────
  [main()]             setTimeout(fn, 0)       Macrotask: [fn, ...]
  [foo()]              fetch(url)              Microtask: [Promise.then, ...]
  [bar()]              addEventListener        Animation: [requestAnimationFrame]

Event Loop algorithm:
1. Execute all synchronous code (call stack)
2. Process ALL microtasks (Promise callbacks, queueMicrotask)
3. Process ONE macrotask (setTimeout, setInterval, I/O)
4. Process ALL new microtasks
5. Render (if browser)
6. Repeat
```

```js
console.log("1");                           // sync
setTimeout(() => console.log("2"), 0);     // macrotask
Promise.resolve().then(() => console.log("3")); // microtask
console.log("4");                           // sync
// Output: 1 4 3 2
```

## Memory Management
```js
// JS uses Garbage Collection (GC) — automatic memory management
// V8 uses Mark-and-Sweep + Generational GC

// Memory leaks to avoid:
// 1. Uncleared event listeners
el.addEventListener("click", fn);
// later:
el.removeEventListener("click", fn);  // clean up!

// 2. Global variables
window.leakyVar = largeObject;  // lives forever

// 3. Closures holding references
function createLeak() {
  const huge = new Array(1000000).fill("data");
  return () => huge.length;   // closure keeps huge alive!
}

// 4. Uncleared timers
const id = setInterval(() => { ... }, 1000);
clearInterval(id);  // always clear when done!

// WeakRef and FinalizationRegistry for weak references
const wr = new WeakRef(bigObject);
wr.deref()?.method();  // use if still alive
```

## Clean Code Practices
```js
// 1. Meaningful names
const d = new Date();           // ❌
const currentDate = new Date(); // ✅

// 2. Single responsibility
function processAndSaveAndEmail() { }  // ❌ too much
function processOrder() { }           // ✅
function saveOrder() { }
function sendConfirmation() { }

// 3. Pure functions (no side effects)
let total = 0;
function addToTotal(n) { total += n; }   // ❌ impure — side effect
function add(a, b) { return a + b; }     // ✅ pure

// 4. Early returns over nested ifs
function getDiscount(user) {  // ❌ deeply nested
  if (user) {
    if (user.isPremium) {
      if (user.yearsActive > 2) return 0.3;
      else return 0.2;
    } else return 0.1;
  }
  return 0;
}
function getDiscountClean(user) {  // ✅ early returns
  if (!user) return 0;
  if (!user.isPremium) return 0.1;
  if (user.yearsActive > 2) return 0.3;
  return 0.2;
}

// 5. Avoid magic numbers
if (status === 3) { }            // ❌
const STATUS_APPROVED = 3;
if (status === STATUS_APPROVED) { }  // ✅

// 6. Use const by default
// 7. Destructure for clarity
// 8. Use optional chaining and nullish coalescing
// 9. Write small, focused functions
// 10. Comment WHY, not WHAT
```
