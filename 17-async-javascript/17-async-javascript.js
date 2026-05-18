// ============================================================
// Section 17 — Asynchronous JavaScript
// Callbacks · Callback Hell · Promises · async/await
// Run: node 17-async-javascript.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: setTimeout / setInterval basics
console.log("=== E1: Timers ===");
console.log("1 — synchronous (runs first)");
setTimeout(() => console.log("3 — after 0ms timeout"), 0);
console.log("2 — synchronous (runs before timeout)");
// Output order: 1, 2, 3 — proves event loop puts timers in macrotask queue

// E2: Callback pattern
console.log("\n=== E2: Callbacks ===");
function fetchUser(id, callback) {
  setTimeout(() => {
    if (id <= 0) return callback(new Error("Invalid ID"), null);
    callback(null, { id, name: `User ${id}`, email: `user${id}@co.com` });
  }, 50);
}

fetchUser(1, (err, user) => {
  if (err) return console.error("Error:", err.message);
  console.log("Got user:", user.name);
});
fetchUser(-1, (err, user) => {
  if (err) console.log("Caught error:", err.message);
});

// E3: Promise basics
console.log("\n=== E3: Promise Basics ===");
function delay(ms)          { return new Promise(resolve => setTimeout(resolve, ms)); }
function asyncAdd(a, b)     { return new Promise(resolve => setTimeout(() => resolve(a + b), 50)); }
function asyncFail(msg)     { return new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), 50)); }

asyncAdd(10, 20)
  .then(result => { console.log("asyncAdd:", result); return asyncAdd(result, 5); })
  .then(result => console.log("chained:", result))
  .catch(err   => console.error("Error:", err.message));

asyncFail("Something broke")
  .catch(err => console.log("Caught promise rejection:", err.message));

// ── MODERATE ──────────────────────────────────────────────

// M1: Callback hell vs Promise chain vs async/await
console.log("\n=== M1: Hell → Promise → async/await ===");
function getUser(id)    { return new Promise(r => setTimeout(() => r({ id, name:`User${id}`, deptId:2 }), 30)); }
function getDept(id)    { return new Promise(r => setTimeout(() => r({ id, name:`Dept${id}`, budget:50000 }), 30)); }
function getReports(id) { return new Promise(r => setTimeout(() => r([`Report-A for ${id}`,`Report-B for ${id}`]), 30)); }

// ✅ async/await — cleanest
async function loadUserInfo(userId) {
  const user    = await getUser(userId);
  const dept    = await getDept(user.deptId);
  const reports = await getReports(user.id);
  return { user, dept, reports };
}

loadUserInfo(42).then(({ user, dept, reports }) => {
  console.log(`User: ${user.name}, Dept: ${dept.name}, Reports: ${reports.length}`);
});

// M2: Promise combinators
console.log("\n=== M2: Promise Combinators ===");
const p1 = delay(100).then(() => "fast");
const p2 = delay(200).then(() => "medium");
const p3 = delay(300).then(() => "slow");
const pFail = delay(150).then(() => { throw new Error("p4 failed"); });

async function combineDemo() {
  // Promise.all — all must succeed
  const all = await Promise.all([p1, p2, p3]);
  console.log("Promise.all:", all);

  // Promise.allSettled — all, regardless of failure
  const settled = await Promise.allSettled([
    Promise.resolve("ok1"),
    Promise.reject(new Error("fail")),
    Promise.resolve("ok3"),
  ]);
  settled.forEach(r => console.log(`  ${r.status}:`, r.value ?? r.reason?.message));

  // Promise.race — first to settle
  const race = await Promise.race([
    delay(200).then(() => "200ms"),
    delay(100).then(() => "100ms"),   // wins!
    delay(300).then(() => "300ms"),
  ]);
  console.log("Promise.race winner:", race);

  // Promise.any — first to RESOLVE (ignores rejects)
  const any = await Promise.any([
    Promise.reject(new Error("a")),
    delay(50).then(() => "second"),
    delay(10).then(() => "first"),   // wins!
  ]);
  console.log("Promise.any winner:", any);
}
combineDemo();

// M3: async/await error handling patterns
console.log("\n=== M3: Error Handling ===");
async function safeCall(fn, ...args) {
  try {
    return { data: await fn(...args), error: null };
  } catch(error) {
    return { data: null, error };
  }
}

async function riskyOperation(shouldFail) {
  await delay(20);
  if (shouldFail) throw new Error("Operation failed!");
  return { success: true, timestamp: Date.now() };
}

async function errorHandlingDemo() {
  // Pattern 1: try/catch
  try {
    const result = await riskyOperation(false);
    console.log("Success:", result.success);
    await riskyOperation(true);  // throws
  } catch(e) {
    console.log("Caught in try/catch:", e.message);
  }

  // Pattern 2: safeCall wrapper
  const { data, error } = await safeCall(riskyOperation, true);
  if (error) console.log("safeCall caught:", error.message);

  // Pattern 3: .catch on async fn
  const result = await riskyOperation(false).catch(e => null);
  console.log("Result with .catch:", result?.success);
}
errorHandlingDemo();

// M4: Sequential vs Parallel async
console.log("\n=== M4: Sequential vs Parallel ===");
function mockFetch(id, ms = 100) {
  return new Promise(r => setTimeout(() => r({ id, name: `Item ${id}` }), ms));
}

async function sequentialVsParallel() {
  const ids = [1, 2, 3, 4, 5];

  // Sequential (slow — each waits for previous)
  let start = Date.now();
  const sequential = [];
  for (const id of ids) sequential.push(await mockFetch(id, 50));
  console.log(`Sequential: ${Date.now()-start}ms (${sequential.length} items)`);

  // Parallel (fast — all start simultaneously)
  start = Date.now();
  const parallel = await Promise.all(ids.map(id => mockFetch(id, 50)));
  console.log(`Parallel:   ${Date.now()-start}ms (${parallel.length} items)`);
}
sequentialVsParallel();

// ── HARD ──────────────────────────────────────────────────

// H1: Promise implementation from scratch
console.log("\n=== H1: Custom Promise ===");
class MyPromise {
  #state    = "pending";
  #value    = undefined;
  #handlers = [];

  constructor(executor) {
    const resolve = value => {
      if (this.#state !== "pending") return;
      this.#state = "fulfilled";
      this.#value = value;
      this.#handlers.forEach(h => h.onFulfilled?.(value));
    };
    const reject = reason => {
      if (this.#state !== "pending") return;
      this.#state = "rejected";
      this.#value = reason;
      this.#handlers.forEach(h => h.onRejected?.(reason));
    };
    try { executor(resolve, reject); }
    catch(e) { reject(e); }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handle = (fn, settle) => value => {
        try {
          if (typeof fn !== "function") { settle(value); return; }
          const result = fn(value);
          result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
        } catch(e) { reject(e); }
      };

      if (this.#state === "fulfilled") setTimeout(() => handle(onFulfilled, resolve)(this.#value));
      else if (this.#state === "rejected") setTimeout(() => handle(onRejected, reject)(this.#value));
      else this.#handlers.push({ onFulfilled: handle(onFulfilled, resolve), onRejected: handle(onRejected, reject) });
    });
  }

  catch(fn)  { return this.then(null, fn); }
  finally(fn){ return this.then(v => { fn(); return v; }, e => { fn(); throw e; }); }

  static resolve(v) { return new MyPromise(r => r(v)); }
  static reject(e)  { return new MyPromise((_, r) => r(e)); }
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const results = [], len = promises.length;
      if (!len) { resolve([]); return; }
      let done = 0;
      promises.forEach((p, i) =>
        MyPromise.resolve(p).then(v => { results[i] = v; if (++done === len) resolve(results); }, reject));
    });
  }
}

// Test our implementation
new MyPromise((resolve) => setTimeout(() => resolve(42), 30))
  .then(v  => { console.log("MyPromise resolved:", v); return v * 2; })
  .then(v  => console.log("Chained:", v))
  .finally(() => console.log("Finally!"));

MyPromise.all([
  MyPromise.resolve(1),
  MyPromise.resolve(2),
  new MyPromise(r => setTimeout(() => r(3), 20)),
]).then(results => console.log("MyPromise.all:", results));

// H2: Retry with exponential backoff
console.log("\n=== H2: Retry with Backoff ===");
async function retryWithBackoff(fn, { maxRetries = 3, baseDelay = 50, factor = 2, onRetry } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn(attempt);
    } catch(error) {
      if (++attempt > maxRetries) throw error;
      const waitMs = baseDelay * factor ** (attempt - 1);
      onRetry?.({ attempt, error, waitMs });
      await delay(waitMs);
    }
  }
}

let callCount = 0;
async function flakyAPI() {
  callCount++;
  if (callCount < 3) throw new Error(`Temporary error (attempt ${callCount})`);
  return { data: "Success!", attempts: callCount };
}

retryWithBackoff(flakyAPI, {
  maxRetries: 4,
  baseDelay:  20,
  onRetry: ({ attempt, error, waitMs }) =>
    console.log(`  Retry ${attempt}: ${error.message}, waiting ${waitMs}ms`),
}).then(result => console.log("Final result:", result));

// H3: Async queue with concurrency limit
console.log("\n=== H3: Async Queue (Concurrency Limit) ===");
class AsyncQueue {
  #queue       = [];
  #running     = 0;
  #concurrency;
  #results     = [];

  constructor(concurrency = 2) { this.#concurrency = concurrency; }

  add(fn) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ fn, resolve, reject });
      this.#run();
    });
  }

  #run() {
    while (this.#running < this.#concurrency && this.#queue.length) {
      const { fn, resolve, reject } = this.#queue.shift();
      this.#running++;
      Promise.resolve().then(() => fn())
        .then(result => { resolve(result); this.#running--; this.#run(); })
        .catch(err   => { reject(err);    this.#running--; this.#run(); });
    }
  }
}

async function queueDemo() {
  const queue = new AsyncQueue(2);   // max 2 concurrent
  const log   = [];

  const tasks = Array.from({ length: 5 }, (_, i) => () =>
    new Promise(r => {
      log.push(`START task-${i+1}`);
      setTimeout(() => { log.push(`END task-${i+1}`); r(`result-${i+1}`); }, 80);
    })
  );

  const results = await Promise.all(tasks.map(t => queue.add(t)));
  console.log("Queue results:", results);
  console.log("Execution log:");
  log.forEach(l => console.log(" ", l));
}
queueDemo();
