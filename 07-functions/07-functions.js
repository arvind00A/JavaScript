// ============================================================
// Section 7 — Functions
// Run: node 07-functions.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: All function syntaxes
console.log("=== E1: Function Syntaxes ===");
// Declaration (hoisted)
function add(a, b) { return a + b; }
// Expression
const subtract = function(a, b) { return a - b; };
// Arrow — concise
const multiply = (a, b) => a * b;
// Arrow — block body
const divide = (a, b) => {
  if (b === 0) throw new Error("Divide by zero");
  return a / b;
};
// Named function expression (useful for recursion & debugging)
const factorial = function fact(n) { return n <= 1 ? 1 : n * fact(n - 1); };

console.log(add(5, 3));          // 8
console.log(subtract(10, 4));    // 6
console.log(multiply(3, 7));     // 21
console.log(divide(15, 4));      // 3.75
console.log(factorial(6));       // 720

// E2: Default and rest parameters
console.log("\n=== E2: Default & Rest ===");
function greet(name = "World", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}
console.log(greet());                  // Hello, World!
console.log(greet("Alice"));           // Hello, Alice!
console.log(greet("Bob", "Hi"));       // Hi, Bob!

function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4, 5));      // 15
console.log(sum(...[10, 20, 30]));     // 60

// E3: Return values
console.log("\n=== E3: Return Values ===");
function minMax(arr) {
  if (!arr.length) return { min: null, max: null };
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3, 1, 4, 1, 5, 9, 2, 6]);
console.log(`min=${min}, max=${max}`);

// ── MODERATE ──────────────────────────────────────────────

// M1: Higher-order functions
console.log("\n=== M1: Higher-Order Functions ===");
function applyTwice(fn, value) { return fn(fn(value)); }
const double = x => x * 2;
console.log(applyTwice(double, 3));  // 12

function pipe(...fns) { return x => fns.reduce((v, f) => f(v), x); }
const transform = pipe(
  x => x * 2,
  x => x + 1,
  x => x ** 2
);
console.log(transform(3));  // ((3*2)+1)^2 = 49

// M2: Closures for encapsulation
console.log("\n=== M2: Closures ===");
function makeCounter(start = 0, step = 1) {
  let count = start;
  return {
    increment: () => { count += step; return count; },
    decrement: () => { count -= step; return count; },
    reset:     () => { count = start; return count; },
    value:     () => count,
  };
}
const c = makeCounter(0, 2);
console.log(c.increment(), c.increment(), c.increment());  // 2 4 6
console.log(c.decrement());                                 // 4
console.log(c.reset());                                     // 0

// M3: Memoization
console.log("\n=== M3: Memoization ===");
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`  Cache hit for ${key}`);
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const fib = memoize(function(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});
console.log(fib(10));  // 55
console.log(fib(10));  // Cache hit

// M4: Currying
console.log("\n=== M4: Currying ===");
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

const curriedAdd = curry((a, b, c) => a + b + c);
console.log(curriedAdd(1)(2)(3));     // 6
console.log(curriedAdd(1, 2)(3));     // 6
console.log(curriedAdd(1)(2, 3));     // 6
console.log(curriedAdd(1, 2, 3));     // 6

const add10 = curriedAdd(10);
const add10and5 = add10(5);
console.log(add10and5(1));  // 16
console.log(add10and5(2));  // 17

// ── HARD ──────────────────────────────────────────────────

// H1: Function composition framework
console.log("\n=== H1: Composition Framework ===");
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const pipeAll  = (...fns) => x => fns.reduce((v, f) => f(v), x);

const double2 = x => x * 2;
const addOne  = x => x + 1;
const square  = x => x * x;
const negate  = x => -x;

console.log(compose(negate, square, addOne, double2)(3));  // -(((3*2)+1)^2) = -49
console.log(pipeAll(double2, addOne, square, negate)(3));  // same result

// H2: Partial application and function factory
console.log("\n=== H2: Partial Application ===");
function partial(fn, ...presetArgs) {
  return function(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const multiply2 = (a, b, c) => a * b * c;
const double3   = partial(multiply2, 2);
const triple    = partial(multiply2, 3);
const sextuple  = partial(multiply2, 2, 3);

console.log(double3(5, 2));   // 2*5*2 = 20
console.log(triple(4, 5));    // 3*4*5 = 60
console.log(sextuple(7));     // 2*3*7 = 42

// H3: Once, throttle, debounce implementations
console.log("\n=== H3: Function Utilities ===");
function once(fn) {
  let called = false, result;
  return function(...args) {
    if (!called) { result = fn.apply(this, args); called = true; }
    return result;
  };
}

function throttle(fn, ms) {
  let lastRun = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastRun >= ms) { lastRun = now; return fn.apply(this, args); }
  };
}

function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

const init = once(() => { console.log("Initialised!"); return 42; });
console.log(init());  // "Initialised!" 42
console.log(init());  // 42 (no log — only runs once)
console.log(init());  // 42

const throttled = throttle(n => console.log("Throttled:", n), 100);
throttled(1); throttled(2); throttled(3);  // only first fires (within 100ms)
setTimeout(() => throttled(4), 150);       // fires after throttle window
