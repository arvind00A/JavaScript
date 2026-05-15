// ============================================================
// Section 14 — Advanced JavaScript Concepts
// this · call/apply/bind · Closures · Lexical Scope · IIFE
// Run: node 14-advanced-concepts.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: `this` in different contexts
console.log("=== E1: `this` Contexts ===");

// Object method — this = the object
const obj = {
  name: "Alice",
  greet()        { return `Hi, I'm ${this.name}`; },
  greetArrow: () => `Arrow: ${typeof this}`,   // no own this → inherits
};
console.log(obj.greet());          // "Hi, I'm Alice"
console.log(obj.greetArrow());     // "Arrow: undefined" (module scope)

// Losing `this` — common mistake
const greetFn = obj.greet;
try {
  console.log(greetFn());          // TypeError in strict / undefined.name
} catch(e) {
  console.log("Lost this:", e.message.slice(0, 40));
}

// Fix: bind
const boundGreet = obj.greet.bind(obj);
console.log(boundGreet());         // "Hi, I'm Alice"

// Constructor — this = new object
function Person(name, age) {
  this.name = name;
  this.age  = age;
  this.info = function() { return `${this.name} (${this.age})`; };
}
const alice = new Person("Alice", 30);
console.log(alice.info());

// E2: call / apply / bind
console.log("\n=== E2: call / apply / bind ===");
function introduce(greeting, punctuation) {
  return `${greeting}! I'm ${this.name}${punctuation}`;
}
const bob = { name: "Bob" };

console.log(introduce.call(bob,  "Hello", "!"));    // individual args
console.log(introduce.apply(bob, ["Hi", "?"]));      // args as array
const boundIntro = introduce.bind(bob, "Hey");        // partial application
console.log(boundIntro("..."));                        // "Hey! I'm Bob..."

// Practical: borrow array methods for array-like objects
function argDemo() {
  const arr = Array.prototype.slice.call(arguments);  // arguments → array
  return arr.map(n => n * 2);
}
console.log(argDemo(1, 2, 3, 4));

// E3: Basic closure
console.log("\n=== E3: Closures ===");
function makeAdder(x) {
  return function(y) { return x + y; };   // x is enclosed
}
const add5  = makeAdder(5);
const add10 = makeAdder(10);
console.log(add5(3));    // 8
console.log(add10(3));   // 13
console.log(add5(add10(2)));  // 5 + 12 = 17

// ── MODERATE ──────────────────────────────────────────────

// M1: Closure for data privacy
console.log("\n=== M1: Private Data via Closure ===");
function createWallet(owner, initialBalance) {
  let balance = initialBalance;  // private — not accessible outside
  const transactions = [];

  function log(type, amount) {
    transactions.push({ type, amount, balance, date: new Date().toISOString() });
  }

  return {
    get owner()   { return owner; },
    get balance() { return balance; },
    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      balance += amount;
      log("deposit", amount);
      return this;
    },
    withdraw(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      log("withdrawal", amount);
      return this;
    },
    history() { return [...transactions]; },
    toString() { return `${owner}'s wallet: $${balance.toFixed(2)}`; },
  };
}

const wallet = createWallet("Alice", 1000);
wallet.deposit(500).deposit(200).withdraw(300);
console.log(wallet.toString());
console.log("Last txn:", wallet.history().at(-1));
try { wallet.withdraw(5000); } catch(e) { console.log("Error:", e.message); }

// M2: IIFE patterns
console.log("\n=== M2: IIFE Patterns ===");
// Basic IIFE
const result1 = (function() {
  const private = "hidden";
  return { getValue: () => private };
})();
console.log(result1.getValue());   // "hidden"
// private not accessible directly

// Async IIFE
(async () => {
  const nums = await Promise.resolve([1,2,3,4,5]);
  console.log("Async IIFE result:", nums.reduce((a,b) => a+b));
})();

// IIFE with parameters
const config = (function(env) {
  const configs = {
    dev:  { host: "localhost",     port: 3000, debug: true  },
    prod: { host: "api.example.com", port: 443, debug: false },
  };
  return configs[env] ?? configs.dev;
})("dev");
console.log("Config:", config);

// M3: call/apply for method borrowing
console.log("\n=== M3: Method Borrowing ===");
const array1 = { 0:"a", 1:"b", 2:"c", length:3 };  // array-like object
console.log(Array.from(array1));  // modern way
console.log([].slice.call(array1));  // old way — borrows Array's slice

// Borrow toString for type checking
function getType(val) {
  return Object.prototype.toString.call(val).slice(8,-1);
}
console.log(getType([]));          // "Array"
console.log(getType({}));          // "Object"
console.log(getType(null));        // "Null"
console.log(getType(new Date())); // "Date"
console.log(getType(/regex/));    // "RegExp"

// M4: Lexical scope and closures in loops
console.log("\n=== M4: Closures in Loops ===");
// Problem: var + closure
const varFns = [];
for (var i = 0; i < 3; i++) {
  varFns.push(() => i);   // all capture same `i`
}
console.log("var:", varFns.map(f => f())); // [3,3,3] — all 3!

// Fix 1: let
const letFns = [];
for (let i = 0; i < 3; i++) {
  letFns.push(() => i);   // each iteration creates new `i`
}
console.log("let:", letFns.map(f => f())); // [0,1,2] ✅

// Fix 2: IIFE
const iifeFns = [];
for (var i = 0; i < 3; i++) {
  iifeFns.push(((j) => () => j)(i));
}
console.log("IIFE:", iifeFns.map(f => f())); // [0,1,2] ✅

// ── HARD ──────────────────────────────────────────────────

// H1: Implement bind, call, apply from scratch
console.log("\n=== H1: Implement call/apply/bind ===");
Function.prototype.myCall = function(context, ...args) {
  const ctx = context ?? globalThis;
  const sym = Symbol("fn");
  ctx[sym] = this;
  const result = ctx[sym](...args);
  delete ctx[sym];
  return result;
};

Function.prototype.myApply = function(context, args = []) {
  return this.myCall(context, ...args);
};

Function.prototype.myBind = function(context, ...preArgs) {
  const fn = this;
  return function(...laterArgs) {
    return fn.myCall(context, ...preArgs, ...laterArgs);
  };
};

function sum(a, b, c) { return (this.base ?? 0) + a + b + c; }

console.log(sum.myCall({ base: 10 }, 1, 2, 3));      // 16
console.log(sum.myApply({ base: 5 }, [1, 2, 3]));     // 11
const bound = sum.myBind({ base: 100 }, 1);
console.log(bound(2, 3));                              // 106

// H2: Mixin pattern using call/apply
console.log("\n=== H2: Mixin Pattern ===");
const Serializable = {
  serialize()   { return JSON.stringify(this); },
  deserialize(json) { return Object.assign(this, JSON.parse(json)); },
};

const Validatable = {
  validate(schema) {
    return Object.entries(schema).every(([key, check]) => check(this[key]));
  },
};

const Timestamped = {
  initTimestamps() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    return this;
  },
  touch() {
    this.updatedAt = new Date().toISOString();
    return this;
  },
};

class User {
  constructor(name, email, age) {
    Object.assign(this, { name, email, age });
    Object.assign(this, Serializable, Validatable, Timestamped);
    this.initTimestamps();
  }
}

const user = new User("Alice", "alice@co.com", 30);
const json = user.serialize();
console.log("Serialized:", json.slice(0, 60) + "...");

const isValid = user.validate({
  name:  v => typeof v === "string" && v.length >= 2,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  age:   v => typeof v === "number" && v >= 0 && v <= 120,
});
console.log("Valid:", isValid);

// H3: Context-preserving event handler wrapper
console.log("\n=== H3: Auto-bound Methods ===");
function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto)
    .filter(name => name !== "constructor" && typeof proto[name] === "function")
    .forEach(name => { instance[name] = instance[name].bind(instance); });
  return instance;
}

class Timer {
  #count = 0;
  #interval = null;

  constructor() { autoBind(this); }   // all methods auto-bound!

  start(ms = 1000) {
    this.#interval = setInterval(this.tick, ms);  // `this` safe — no .bind() needed!
    return this;
  }
  tick()  { console.log(`  Tick #${++this.#count}`); if (this.#count >= 3) this.stop(); }
  stop()  { clearInterval(this.#interval); console.log("  Timer stopped"); }
  reset() { this.#count = 0; return this; }
}

const timer = new Timer();
timer.start(100);   // logs Tick #1, #2, #3 then stops
