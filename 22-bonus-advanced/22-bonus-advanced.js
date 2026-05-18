// ============================================================
// Section 22 — Bonus / Advanced Topics
// JS Engine · Event Loop · Memory Management · Clean Code
// Run: node 22-bonus-advanced.js
// ============================================================

// ═══════════════════════════════════════════════════════════
// TOPIC 1: Event Loop — understand execution order
// ═══════════════════════════════════════════════════════════
console.log("═".repeat(55));
console.log("  TOPIC 1: Event Loop");
console.log("═".repeat(55));

// Execution order: sync → microtasks → macrotasks
console.log("\n--- Order Demo ---");
console.log("1 sync");

setTimeout(() => console.log("5 macrotask  (setTimeout 0ms)"), 0);
setTimeout(() => console.log("6 macrotask  (setTimeout 10ms)"), 10);

Promise.resolve()
  .then(() => console.log("3 microtask  (Promise.resolve)"))
  .then(() => console.log("4 microtask  (chained .then)"));

queueMicrotask(() => console.log("2 microtask  (queueMicrotask — before Promise.then... actually same queue)"));

console.log("note: queueMicrotask runs before Promise.then in Node");

// Visual event loop simulation
console.log("\n--- Event Loop Simulation ---");
function simulateEventLoop() {
  const callStack  = [];
  const microtasks = [];
  const macrotasks = [];
  const log        = [];

  const api = {
    push(fn, label)         { callStack.push({ fn, label }); },
    queueMicro(fn, label)   { microtasks.push({ fn, label }); },
    queueMacro(fn, label)   { macrotasks.push({ fn, label }); },
    run() {
      let tick = 0;
      while (callStack.length || microtasks.length || macrotasks.length) {
        if (++tick > 20) break; // safety

        // 1. Execute all synchronous code in call stack
        while (callStack.length) {
          const { fn, label } = callStack.shift();
          log.push(`[SYNC]   ${label}`);
          fn();
        }

        // 2. Drain ALL microtasks
        while (microtasks.length) {
          const { fn, label } = microtasks.shift();
          log.push(`[MICRO]  ${label}`);
          fn();
        }

        // 3. ONE macrotask
        if (macrotasks.length) {
          const { fn, label } = macrotasks.shift();
          log.push(`[MACRO]  ${label}`);
          fn();
        }
      }
      return log;
    }
  };

  // Set up the scenario
  api.push(() => {}, "console.log('start')");
  api.queueMacro(() => {
    api.queueMicro(() => {}, "Promise inside setTimeout");
  }, "setTimeout callback");
  api.queueMicro(() => {
    api.queueMicro(() => {}, "chained microtask");
  }, "Promise.resolve().then");
  api.push(() => {}, "console.log('end')");

  api.run().forEach(l => console.log(" ", l));
}
simulateEventLoop();

// ═══════════════════════════════════════════════════════════
// TOPIC 2: Performance measurement & optimization
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  TOPIC 2: Performance & Optimization");
console.log("═".repeat(55));

function benchmark(label, fn, iterations = 1) {
  const start  = performance.now();
  let result;
  for (let i = 0; i < iterations; i++) result = fn();
  const elapsed = performance.now() - start;
  console.log(`  ${label.padEnd(35)} ${elapsed.toFixed(3)}ms`);
  return result;
}

// A: String concatenation — += vs join vs template
const N = 10000;
benchmark("String +=  (slow)",            () => { let s=""; for(let i=0;i<N;i++) s+=i; return s.length; });
benchmark("Array.join (fast)",            () => { const a=[]; for(let i=0;i<N;i++) a.push(i); return a.join("").length; });
benchmark("Template literal accumulate",  () => { let s=""; for(let i=0;i<N;i++) s=`${s}${i}`; return s.length; });

// B: Object creation patterns
benchmark("Object literal   x10k",        () => { const a=[]; for(let i=0;i<N;i++) a.push({x:i,y:i}); return a.length; });
benchmark("Class instances  x10k",        () => {
  class P { constructor(x,y){ this.x=x; this.y=y; } }
  const a=[]; for(let i=0;i<N;i++) a.push(new P(i,i)); return a.length;
});

// C: Loop styles
const arr = Array.from({length:N}, (_,i) => i);
benchmark("for loop         x10k",        () => { let s=0; for(let i=0;i<arr.length;i++) s+=arr[i]; return s; });
benchmark("for...of         x10k",        () => { let s=0; for(const n of arr) s+=n; return s; });
benchmark("reduce()         x10k",        () => arr.reduce((a,b)=>a+b,0));
benchmark("forEach()        x10k",        () => { let s=0; arr.forEach(n=>s+=n); return s; });

// D: Lookup — Array.includes vs Set.has vs Object lookup
const ids   = Array.from({length:1000},(_,i)=>i);
const idSet = new Set(ids);
const idMap = Object.fromEntries(ids.map(id=>[id,true]));
const RUNS  = 10000;
benchmark("Array.includes   x10k",        () => { let c=0; for(let i=0;i<RUNS;i++) if(ids.includes(500)) c++; return c; });
benchmark("Set.has          x10k",        () => { let c=0; for(let i=0;i<RUNS;i++) if(idSet.has(500)) c++; return c; });
benchmark("Object key lookup x10k",       () => { let c=0; for(let i=0;i<RUNS;i++) if(idMap[500]) c++; return c; });

// ═══════════════════════════════════════════════════════════
// TOPIC 3: Memory management & leak detection
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  TOPIC 3: Memory Management");
console.log("═".repeat(55));

function getMemory() {
  const mem = process.memoryUsage();
  return {
    heap:     (mem.heapUsed  / 1024 / 1024).toFixed(2) + " MB",
    rss:      (mem.rss       / 1024 / 1024).toFixed(2) + " MB",
    external: (mem.external  / 1024 / 1024).toFixed(2) + " MB",
  };
}
console.log("Initial memory:", getMemory());

// Common leak patterns and their fixes
console.log("\n--- Leak Pattern 1: Accumulating references ---");
// ❌ Leak — array grows without bound
class LeakyCache {
  #data = [];
  add(item) { this.#data.push(item); }       // never evicted!
  size()    { return this.#data.length; }
}

// ✅ Fix — bounded cache (LRU-style)
class BoundedCache {
  #data = new Map();
  #max;

  constructor(max = 100) { this.#max = max; }

  set(key, value) {
    if (this.#data.size >= this.#max) {
      // Delete oldest entry (first inserted in Map)
      this.#data.delete(this.#data.keys().next().value);
    }
    this.#data.set(key, { value, hits: 0, ts: Date.now() });
    return this;
  }

  get(key) {
    const entry = this.#data.get(key);
    if (!entry) return undefined;
    entry.hits++;
    // Move to end (most recently used)
    this.#data.delete(key);
    this.#data.set(key, entry);
    return entry.value;
  }

  has(key)   { return this.#data.has(key); }
  get size() { return this.#data.size; }
  stats()    { return { size: this.#data.size, max: this.#max }; }
}

const cache = new BoundedCache(5);
for (let i = 1; i <= 8; i++) cache.set(`key-${i}`, `value-${i}`);
console.log("Cache size (max 5):", cache.size);   // 5 — oldest evicted
console.log("key-1 evicted:",      !cache.has("key-1"));  // true
console.log("key-8 present:",       cache.has("key-8"));   // true

console.log("\n--- Leak Pattern 2: Event listener accumulation ---");
class SafeEventEmitter {
  #listeners  = new Map();
  #maxListeners;

  constructor(max = 10) { this.#maxListeners = max; }

  on(event, fn) {
    const list = this.#listeners.get(event) ?? [];
    if (list.length >= this.#maxListeners) {
      console.warn(`  ⚠️  MaxListeners (${this.#maxListeners}) exceeded for "${event}"`);
    }
    list.push(fn);
    this.#listeners.set(event, list);
    // Return cleanup function automatically
    return () => this.off(event, fn);
  }

  off(event, fn) {
    this.#listeners.set(event,
      (this.#listeners.get(event) ?? []).filter(l => l !== fn));
  }

  emit(event, ...args) {
    (this.#listeners.get(event) ?? []).forEach(fn => fn(...args));
  }

  listenerCount(event) { return (this.#listeners.get(event) ?? []).length; }
}

const emitter = new SafeEventEmitter(3);
const cleanups = [];
for (let i = 0; i < 4; i++) {  // 4th will warn
  cleanups.push(emitter.on("data", d => {}));
}
console.log("Listeners:", emitter.listenerCount("data"));  // 4
cleanups.forEach(fn => fn());   // clean up all
console.log("After cleanup:", emitter.listenerCount("data"));  // 0

console.log("\n--- WeakMap for private data (no leak) ---");
const _private = new WeakMap();
class Resource {
  constructor(id) {
    _private.set(this, { id, data: new Array(100).fill(id) });
    this.name = `Resource-${id}`;
  }
  getData() { return _private.get(this); }
}
let r = new Resource(42);
console.log("Resource id:", r.getData().id);
r = null;  // WeakMap entry is GC-eligible (no strong reference keeps it alive)
console.log("Resource released (GC eligible)");

// ═══════════════════════════════════════════════════════════
// TOPIC 4: Clean Code Practices
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  TOPIC 4: Clean Code Practices");
console.log("═".repeat(55));

// --- 1. Meaningful names ---
console.log("\n1. Meaningful Names:");
// ❌ Bad
function calc(d, r) { return d * (1 - r / 100); }
// ✅ Good
function calculateDiscountedPrice(originalPrice, discountPercent) {
  return originalPrice * (1 - discountPercent / 100);
}
console.log("  Price after 20% discount:", calculateDiscountedPrice(100, 20));

// --- 2. Single Responsibility ---
console.log("\n2. Single Responsibility:");
// ❌ Bad — does too many things
function processUserBad(userData) {
  // validate + save + send email all in one
}
// ✅ Good — each function does ONE thing
function validateUser(data) {
  const errors = [];
  if (!data.name)  errors.push("Name required");
  if (!data.email) errors.push("Email required");
  return { valid: !errors.length, errors };
}
function formatUser(data) {
  return { ...data, name: data.name?.trim(), email: data.email?.toLowerCase() };
}
function createUserRecord(data) {
  return { ...formatUser(data), id: Date.now(), createdAt: new Date().toISOString() };
}

const { valid, errors } = validateUser({ name: "Alice", email: "ALICE@CO.COM" });
console.log("  Valid:", valid, "| Record:", JSON.stringify(createUserRecord({ name: " Alice ", email: "ALICE@CO.COM" })).slice(0,60));

// --- 3. Early return / Guard clauses ---
console.log("\n3. Early Return (Guard Clauses):");
// ❌ Deeply nested
function processPaymentBad(user, amount, method) {
  if (user) {
    if (amount > 0) {
      if (method) {
        return { success: true };
      }
    }
  }
  return { success: false };
}
// ✅ Guard clauses
function processPayment(user, amount, method) {
  if (!user)       return { success: false, error: "No user"         };
  if (amount <= 0) return { success: false, error: "Invalid amount"  };
  if (!method)     return { success: false, error: "No payment method"};
  return { success: true, user: user.name, amount, method };
}
console.log("  ", processPayment({ name:"Alice" }, 99.99, "card"));
console.log("  ", processPayment(null, 99.99, "card"));

// --- 4. Pure functions ---
console.log("\n4. Pure Functions:");
// ❌ Impure — side effect, depends on external state
let totalRevenue = 0;
function addRevenueBad(amount) { totalRevenue += amount; }  // mutates external state
// ✅ Pure — same input always gives same output, no side effects
function addToRevenue(currentRevenue, amount) { return currentRevenue + amount; }

let revenue = 0;
revenue = addToRevenue(revenue, 100);
revenue = addToRevenue(revenue, 250);
revenue = addToRevenue(revenue, 75);
console.log("  Revenue:", revenue);

// --- 5. Composition over complex conditionals ---
console.log("\n5. Composition & Strategy Pattern:");
const discountStrategies = {
  none:      (price)           => price,
  percent:   (price, value)    => price * (1 - value / 100),
  fixed:     (price, value)    => Math.max(0, price - value),
  buyOneGet: (price, _, qty)   => qty >= 2 ? price * Math.ceil(qty/2)/qty : price,
};

function applyDiscount(price, qty, { type = "none", value = 0 } = {}) {
  const strategy = discountStrategies[type] ?? discountStrategies.none;
  return +(strategy(price, value, qty) * qty).toFixed(2);
}

console.log("  No discount:  $" + applyDiscount(100, 3));
console.log("  20% off:      $" + applyDiscount(100, 3, { type:"percent", value:20 }));
console.log("  $15 off:      $" + applyDiscount(100, 3, { type:"fixed", value:15 }));
console.log("  Buy1Get1:     $" + applyDiscount(100, 4, { type:"buyOneGet" }));

// --- 6. Avoid magic numbers ---
console.log("\n6. No Magic Numbers:");
// ❌ Bad
// if (status === 2) { ... }
// if (retries > 3) { ... }
// ✅ Good
const HTTP_STATUS = Object.freeze({ OK:200, CREATED:201, BAD_REQUEST:400, UNAUTHORIZED:401, NOT_FOUND:404, SERVER_ERROR:500 });
const LIMITS = Object.freeze({ MAX_RETRIES:3, REQUEST_TIMEOUT_MS:5000, MAX_FILE_SIZE_MB:10, MIN_PASSWORD_LEN:8 });

function handleResponse(status) {
  if (status === HTTP_STATUS.OK)           return "Success";
  if (status === HTTP_STATUS.UNAUTHORIZED) return "Please log in";
  if (status === HTTP_STATUS.NOT_FOUND)    return "Resource not found";
  return "Unknown status";
}
console.log("  200:", handleResponse(200));
console.log("  401:", handleResponse(401));
console.log("  Limits:", LIMITS);

// --- 7. Error handling ---
console.log("\n7. Proper Error Handling:");
class AppError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name    = "AppError";
    this.code    = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
  toJSON() {
    return { name: this.name, message: this.message, code: this.code, details: this.details };
  }
}

class ValidationError extends AppError {
  constructor(fields) {
    super("Validation failed", "VALIDATION_ERROR", { fields });
    this.name = "ValidationError";
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} #${id} not found`, "NOT_FOUND", { resource, id });
    this.name = "NotFoundError";
  }
}

function findUser(id) {
  if (typeof id !== "number") throw new ValidationError({ id: "must be a number" });
  if (id <= 0)                throw new ValidationError({ id: "must be positive" });
  if (id > 100)               throw new NotFoundError("User", id);
  return { id, name: `User ${id}`, email: `user${id}@co.com` };
}

const testCases = ["abc", -1, 42, 999];
for (const id of testCases) {
  try {
    const user = findUser(id);
    console.log(`  ✅ Found: ${user.name}`);
  } catch(e) {
    console.log(`  ❌ ${e.name}: ${e.message}`);
  }
}

// ═══════════════════════════════════════════════════════════
// TOPIC 5: V8 Engine internals — practical implications
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  TOPIC 5: V8 Engine — Practical Implications");
console.log("═".repeat(55));

// 1. Hidden classes — keep object shape consistent
console.log("\n--- Hidden Classes ---");
// ❌ Different shapes — V8 creates multiple hidden classes
function createPointBad(x, y, hasZ) {
  const p = { x, y };
  if (hasZ) p.z = 0;  // breaks hidden class consistency!
  return p;
}
// ✅ Consistent shape — V8 reuses one hidden class
function createPoint(x, y, z = null) {
  return { x, y, z };   // always same shape
}
const points = Array.from({length:5}, (_,i) => createPoint(i, i*2));
console.log("  Consistent shape points:", points.length);

// 2. Monomorphic vs polymorphic functions
console.log("\n--- Mono vs Polymorphic ---");
// ❌ Polymorphic — called with different types (V8 can't optimise as well)
function addBad(a, b) { return a + b; }
addBad(1, 2);         // number + number
addBad("a", "b");     // string + string
addBad(1, "b");       // number + string — 3 different type profiles!

// ✅ Monomorphic — always same types (V8 inlines and optimises)
function addNumbers(a, b) { return (a | 0) + (b | 0); }  // force integer
function addStrings(a, b) { return String(a) + String(b); }

// 3. Array type stability
console.log("\n--- Array Type Stability ---");
// ❌ Mixed types — V8 uses slower generic array
const mixed = [1, "two", true, null, {x:3}];
// ✅ Single type — V8 uses optimised PACKED_SMI_ELEMENTS or similar
const ints  = [1, 2, 3, 4, 5];        // SMI (small integer) array — fastest
const floats= [1.1, 2.2, 3.3];        // PACKED_DOUBLE_ELEMENTS
const objs  = [{a:1},{a:2},{a:3}];    // PACKED_ELEMENTS
console.log("  Type-stable arrays are faster in tight loops");

// 4. Avoid deoptimisation — don't change types after assignment
console.log("\n--- Avoid Deoptimisation ---");
// ❌ Type change triggers deopt
let val = 42;
// val = "hello";  // changes type — V8 deoptimises functions using `val`

// ✅ Use constants or keep types stable
const MAX = 100;  // const hints to V8 this won't change

// 5. Practical: measure and avoid premature optimisation
console.log("\n--- Measure First ---");
function measure(label, fn) {
  const t = performance.now();
  const r = fn();
  console.log(`  ${label}: ${(performance.now()-t).toFixed(3)}ms`);
  return r;
}

const bigArr = Array.from({length:100000}, (_,i) => i);
measure("forEach sum",   () => { let s=0; bigArr.forEach(n=>s+=n); return s; });
measure("reduce sum",    () => bigArr.reduce((a,b)=>a+b,0));
measure("for loop sum",  () => { let s=0; for(let i=0;i<bigArr.length;i++) s+=bigArr[i]; return s; });
measure("for...of sum",  () => { let s=0; for(const n of bigArr) s+=n; return s; });

console.log("\n" + "═".repeat(55));
console.log("  🎉 Section 22 Complete — You know advanced JS!");
console.log("═".repeat(55));
console.log("\nKey takeaways:");
console.log("  • Event loop: sync → microtasks (all) → macrotask (one)");
console.log("  • Memory: use bounded caches, clean up listeners");
console.log("  • Performance: measure before optimising");
console.log("  • V8: consistent object shapes, stable array types");
console.log("  • Clean code: single responsibility, pure functions, guard clauses");
