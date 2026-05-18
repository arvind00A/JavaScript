// ============================================================
// Section 19 — ES6+ Features
// Arrow Functions · Destructuring · Spread/Rest
// Map · Set · Symbol · Generator · Proxy · Reflect
// Run: node 19-es6-features.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Destructuring deep-dive
console.log("=== E1: Destructuring ===");

// Array destructuring
const [a, b, , c, ...rest] = [10, 20, 30, 40, 50, 60];
console.log(a, b, c, rest);   // 10 20 40 [50,60]

// Object destructuring with rename and default
const user = { name: "Alice", age: 30, role: "admin" };
const { name: userName, age, role = "user", salary = 50000 } = user;
console.log(userName, age, role, salary);   // Alice 30 admin 50000

// Nested destructuring
const { address: { city, zip = "00000" } = {} } = { address: { city: "NYC" } };
console.log(city, zip);    // NYC 00000

// Function parameter destructuring
function displayUser({ name, age = 0, role = "guest" }) {
  console.log(`${name} (${age}) — ${role}`);
}
displayUser(user);
displayUser({ name: "Bob" });

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);   // 2 1

// E2: Spread / Rest
console.log("\n=== E2: Spread / Rest ===");
// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, 0, ...arr2];
console.log(combined);   // [1,2,3,0,4,5,6]

// Spread in objects
const defaults = { theme: "light", lang: "en", debug: false };
const custom   = { theme: "dark", debug: true };
const config   = { ...defaults, ...custom };
console.log(config);   // theme:dark, lang:en, debug:true

// Spread in function call
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
console.log(sum(...[1, 2, 3, 4, 5]));   // 15

// Rest in destructuring
const { theme, ...otherConfig } = config;
console.log(theme, otherConfig);

// E3: Map and Set
console.log("\n=== E3: Map & Set ===");
// Map — ordered, any key type
const map = new Map();
map.set("name", "Alice");
map.set(42,     "answer");
map.set({ id: 1 }, "object key");
console.log("Map size:", map.size);
console.log("get name:", map.get("name"));
console.log("has 42:", map.has(42));
for (const [k, v] of map) console.log(`  ${JSON.stringify(k)} → ${v}`);

// Map from entries
const scores = new Map([["Alice",95],["Bob",82],["Carol",88]]);
const sorted = [...scores.entries()].sort((a,b) => b[1]-a[1]);
console.log("Sorted scores:", sorted.map(([n,s]) => `${n}:${s}`).join(", "));

// Set — unique values
const nums = new Set([1,2,2,3,3,3,4,5,5]);
console.log("Set:", [...nums]);           // [1,2,3,4,5]
console.log("Size:", nums.size);
nums.add(6); nums.delete(1);
console.log("After add/delete:", [...nums]);

// Set operations
const setA = new Set([1,2,3,4]);
const setB = new Set([3,4,5,6]);
const union        = new Set([...setA, ...setB]);
const intersection = new Set([...setA].filter(x => setB.has(x)));
const difference   = new Set([...setA].filter(x => !setB.has(x)));
console.log("Union:",        [...union]);
console.log("Intersection:", [...intersection]);
console.log("Difference:",   [...difference]);

// ── MODERATE ──────────────────────────────────────────────

// M1: Symbols
console.log("\n=== M1: Symbols ===");
// Well-known symbols
class Collection {
  #items;
  constructor(...items) { this.#items = items; }

  // Make iterable with Symbol.iterator
  [Symbol.iterator]() {
    let i = 0;
    const items = this.#items;
    return { next: () => i < items.length
      ? { value: items[i++], done: false }
      : { value: undefined, done: true } };
  }

  // Custom toString
  get [Symbol.toStringTag]() { return "Collection"; }

  // Enable spread / Array.from
  get length() { return this.#items.length; }
}

const col = new Collection(10, 20, 30, 40);
for (const v of col) process.stdout.write(v + " ");
console.log();
console.log([...col]);
console.log(Object.prototype.toString.call(col));  // [object Collection]

// Symbol as private-ish key
const _id  = Symbol("id");
const _key = Symbol("secret");
const obj2 = { name: "Alice", [_id]: 1, [_key]: "xyz" };
console.log("name:", obj2.name);
console.log("id via Symbol:", obj2[_id]);
console.log("Keys (no symbols):", Object.keys(obj2));  // ["name"] only

// M2: Generators
console.log("\n=== M2: Generators ===");
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i;
}
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) { yield a; [a, b] = [b, a + b]; }
}
function* take(gen, n) {
  for (const val of gen) { if (n-- <= 0) return; yield val; }
}

console.log([...range(0, 10, 2)]);           // [0,2,4,6,8]
console.log([...take(fibonacci(), 10)]);      // [0,1,1,2,3,5,8,13,21,34]

// Two-way generator (send values in)
function* accumulator() {
  let total = 0;
  while (true) {
    const n = yield total;   // yield current, receive next
    if (n === null) return total;
    total += n;
  }
}
const acc = accumulator();
acc.next();          // start
acc.next(10);        // send 10
acc.next(20);        // send 20
const final = acc.next(5).value;
console.log("Accumulator total:", final);   // 35

// M3: Proxy and Reflect
console.log("\n=== M3: Proxy & Reflect ===");
function createValidator(target, schema) {
  return new Proxy(target, {
    set(obj, key, value) {
      const rule = schema[key];
      if (rule) {
        if (rule.type && typeof value !== rule.type)
          throw new TypeError(`${key} must be ${rule.type}`);
        if (rule.min !== undefined && value < rule.min)
          throw new RangeError(`${key} must be >= ${rule.min}`);
        if (rule.max !== undefined && value > rule.max)
          throw new RangeError(`${key} must be <= ${rule.max}`);
        if (rule.match && !rule.match.test(value))
          throw new Error(`${key} format invalid`);
      }
      return Reflect.set(obj, key, value);
    },
    get(obj, key) {
      console.log(`  Getting: ${String(key)}`);
      return Reflect.get(obj, key);
    },
  });
}

const person = createValidator({}, {
  name:  { type: "string" },
  age:   { type: "number", min: 0, max: 150 },
  email: { type: "string", match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
});

person.name  = "Alice";
person.age   = 30;
person.email = "alice@co.com";
console.log(person.name);

try { person.age = -5; }
catch(e) { console.log("Validation:", e.message); }
try { person.email = "not-an-email"; }
catch(e) { console.log("Validation:", e.message); }

// M4: WeakMap, WeakSet, WeakRef
console.log("\n=== M4: Weak Collections ===");
// WeakMap: key must be an object; GC can collect keys
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    privateData.set(this, { password });   // truly private!
    this.name = name;
  }
  checkPassword(pwd) { return privateData.get(this).password === pwd; }
}

const alice = new User("Alice", "secret123");
console.log("Check password:", alice.checkPassword("secret123"));  // true
console.log("Check password:", alice.checkPassword("wrong"));       // false
console.log("Private accessible?", alice.password);                 // undefined ✅

// ── HARD ──────────────────────────────────────────────────

// H1: Lazy evaluation with Proxy + Generators
console.log("\n=== H1: Lazy Pipeline ===");
function lazyPipeline(iterable) {
  let transforms = [];

  const pipeline = {
    map(fn)    { transforms.push({ type:"map",    fn }); return pipeline; },
    filter(fn) { transforms.push({ type:"filter", fn }); return pipeline; },
    take(n)    { transforms.push({ type:"take",   n  }); return pipeline; },
    *[Symbol.iterator]() {
      let taken = Infinity;
      for (const t of transforms) if (t.type === "take") { taken = t.n; break; }
      let count = 0;
      outer: for (let val of iterable) {
        for (const t of transforms) {
          if (t.type === "filter" && !t.fn(val)) continue outer;
          if (t.type === "map")    val = t.fn(val);
          if (t.type === "take"  && count >= t.n) break outer;
        }
        yield val;
        if (++count >= taken) break;
      }
    },
    toArray() { return [...this]; },
    first()   { return this[Symbol.iterator]().next().value; },
  };
  return pipeline;
}

function* naturals() { let n = 1; while (true) yield n++; }

const result = lazyPipeline(naturals())
  .filter(n => n % 2 === 0)          // even numbers
  .map(n => n ** 2)                   // squared
  .filter(n => String(n).includes("4")) // contains "4"
  .take(5)
  .toArray();

console.log("Lazy pipeline result:", result);

// H2: Decorators (manual implementation)
console.log("\n=== H2: Method Decorators ===");
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
function memoize(target, key, descriptor) {
  const cache = new Map();
  const orig  = descriptor.value;
  descriptor.value = function(...args) {
    const k = JSON.stringify(args);
    if (!cache.has(k)) cache.set(k, orig.apply(this, args));
    return cache.get(k);
  };
  return descriptor;
}
function log(target, key, descriptor) {
  const orig = descriptor.value;
  descriptor.value = function(...args) {
    console.log(`  [LOG] ${key}(${args.join(",")})`);
    const result = orig.apply(this, args);
    console.log(`  [LOG] ${key} → ${JSON.stringify(result)}`);
    return result;
  };
  return descriptor;
}

// Apply manually (before TC39 decorator proposal ships)
class MathUtils {
  fib(n) { return n <= 1 ? n : this.fib(n-1) + this.fib(n-2); }
  factorial(n) { return n <= 1 ? 1 : n * this.factorial(n-1); }
}
// Apply memoize decorator manually
const descriptor1 = Object.getOwnPropertyDescriptor(MathUtils.prototype, "fib");
Object.defineProperty(MathUtils.prototype, "fib", memoize(MathUtils.prototype, "fib", descriptor1));

const mu = new MathUtils();
console.time("fib(35) first");
mu.fib(35);
console.timeEnd("fib(35) first");
console.time("fib(35) cached");
mu.fib(35);
console.timeEnd("fib(35) cached");   // near 0ms — from cache!

// H3: Tagged template literal — SQL query builder
console.log("\n=== H3: Tagged Template SQL Builder ===");
function sql(strings, ...values) {
  const params = [];
  const query  = strings.reduce((acc, str, i) => {
    if (i < values.length) {
      params.push(values[i]);
      return acc + str + `$${params.length}`;  // PostgreSQL-style placeholder
    }
    return acc + str;
  }, "").trim();

  return {
    query,
    params,
    toString() { return `Query: ${this.query}\nParams: ${JSON.stringify(this.params)}`; },
  };
}

const userId   = 42;
const minSal   = 50000;
const status   = "active";
const limit    = 10;

const q = sql`
  SELECT name, email, salary
  FROM   employees
  WHERE  user_id = ${userId}
    AND  salary  > ${minSal}
    AND  status  = ${status}
  ORDER BY salary DESC
  LIMIT ${limit}
`;
console.log(q.toString());

// Ensure values are safely parameterised (no SQL injection risk)
const malicious = "'; DROP TABLE users; --";
const safe = sql`SELECT * FROM users WHERE name = ${malicious}`;
console.log("\nWith malicious input:");
console.log(safe.toString());  // value is in params, not injected into query ✅
