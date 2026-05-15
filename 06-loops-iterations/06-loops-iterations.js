// ============================================================
// Section 6 — Loops / Iterations
// Run: node 06-loops-iterations.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: for loop basics
console.log("=== E1: for loop ===");
for (let i = 1; i <= 5; i++) process.stdout.write(i + " ");
console.log();
// Countdown
for (let i = 10; i >= 0; i -= 2) process.stdout.write(i + " ");
console.log();
// Nested for
for (let i = 1; i <= 3; i++)
  for (let j = 1; j <= 3; j++)
    process.stdout.write(`(${i},${j}) `);
console.log();

// E2: while and do...while
console.log("\n=== E2: while / do...while ===");
let n = 1;
while (n <= 5) { process.stdout.write(n + " "); n++; }
console.log();

// do...while runs at least once
let count = 10;
do {
  process.stdout.write(count + " ");
  count++;
} while (count < 5);  // condition false but still ran once!
console.log();

// E3: for...of and for...in
console.log("\n=== E3: for...of / for...in ===");
const fruits = ["apple","banana","cherry"];
for (const f of fruits) process.stdout.write(f + " ");
console.log();

for (const [i, f] of fruits.entries())
  console.log(`  [${i}] ${f}`);

const person = { name:"Alice", age:30, city:"NYC" };
for (const key in person)
  console.log(`  ${key}: ${person[key]}`);

// E4: break and continue
console.log("\n=== E4: break / continue ===");
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  process.stdout.write(i + " ");
}
console.log();

for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  process.stdout.write(i + " ");
}
console.log();

// ── MODERATE ──────────────────────────────────────────────

// M1: Iterate over different iterable types
console.log("\n=== M1: Iterating Iterables ===");
// String
for (const ch of "hello") process.stdout.write(ch + "·");
console.log();
// Map
const scores = new Map([["Alice",95],["Bob",82],["Carol",88]]);
for (const [name, score] of scores)
  console.log(`  ${name}: ${score}`);
// Set (unique)
const tags = new Set(["js","python","js","rust","python","go"]);
console.log("Unique tags:", [...tags].join(", "));
// Generator
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i;
}
console.log("Range 0-10 step 2:", [...range(0,10,2)].join(" "));

// M2: Loop patterns and algorithms
console.log("\n=== M2: Common Loop Patterns ===");
// FizzBuzz
const fb = [];
for (let i = 1; i <= 20; i++) {
  if (i % 15 === 0)     fb.push("FizzBuzz");
  else if (i % 3 === 0) fb.push("Fizz");
  else if (i % 5 === 0) fb.push("Buzz");
  else                  fb.push(String(i));
}
console.log(fb.join(" "));

// Flatten nested array without flat()
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) result.push(...flatten(item));
    else result.push(item);
  }
  return result;
}
console.log(flatten([1,[2,[3,[4]],5],6]));  // [1,2,3,4,5,6]

// M3: Searching and filtering with loops
console.log("\n=== M3: Search & Filter ===");
const employees = [
  { name:"Alice", dept:"Engineering", salary:95000 },
  { name:"Bob",   dept:"HR",          salary:72000 },
  { name:"Carol", dept:"Engineering", salary:88000 },
  { name:"Dave",  dept:"Finance",     salary:105000 },
  { name:"Eve",   dept:"Engineering", salary:110000 },
];

// Find highest salary per department
const deptMax = {};
for (const emp of employees) {
  if (!deptMax[emp.dept] || emp.salary > deptMax[emp.dept].salary)
    deptMax[emp.dept] = emp;
}
for (const [dept, emp] of Object.entries(deptMax))
  console.log(`  ${dept}: ${emp.name} ($${emp.salary.toLocaleString()})`);

// M4: Labeled break for nested loops
console.log("\n=== M4: Labeled Break ===");
// Find first pair that sums to target
function findPair(arr, target) {
  outer: for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        console.log(`  Found: [${arr[i]}, ${arr[j]}] at indices [${i}, ${j}]`);
        break outer;  // exit both loops!
      }
    }
  }
}
findPair([2, 7, 4, 1, 5, 3], 9);   // [2,7]
findPair([1, 2, 3, 4, 5], 8);      // [3,5]

// ── HARD ──────────────────────────────────────────────────

// H1: Implement map, filter, reduce from scratch using loops
console.log("\n=== H1: map/filter/reduce from scratch ===");
function myMap(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) result.push(fn(arr[i], i, arr));
  return result;
}
function myFilter(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) if (fn(arr[i], i, arr)) result.push(arr[i]);
  return result;
}
function myReduce(arr, fn, initial) {
  let acc = initial;
  let start = 0;
  if (acc === undefined) { acc = arr[0]; start = 1; }
  for (let i = start; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}

const nums = [1,2,3,4,5,6,7,8,9,10];
console.log(myMap(nums, n => n * 2));
console.log(myFilter(nums, n => n % 2 === 0));
console.log(myReduce(nums, (acc, n) => acc + n, 0));

// H2: Async loop patterns
console.log("\n=== H2: Async Loop Patterns ===");
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function mockFetch(id) {
  return new Promise(r => setTimeout(() => r({ id, name: `User ${id}` }), 50));
}

async function runAsyncLoops() {
  const ids = [1, 2, 3, 4, 5];

  // Sequential — one at a time
  console.log("Sequential:");
  const seqStart = Date.now();
  const seqResults = [];
  for (const id of ids) {
    seqResults.push(await mockFetch(id));
  }
  console.log(`  Done in ${Date.now()-seqStart}ms — ${seqResults.length} items`);

  // Parallel — all at once
  console.log("Parallel:");
  const parStart = Date.now();
  const parResults = await Promise.all(ids.map(id => mockFetch(id)));
  console.log(`  Done in ${Date.now()-parStart}ms — ${parResults.length} items`);

  // Batched (parallel in groups of 2)
  console.log("Batched (size 2):");
  const batchStart = Date.now();
  const batchResults = [];
  for (let i = 0; i < ids.length; i += 2) {
    const batch = ids.slice(i, i + 2);
    const results = await Promise.all(batch.map(id => mockFetch(id)));
    batchResults.push(...results);
  }
  console.log(`  Done in ${Date.now()-batchStart}ms — ${batchResults.length} items`);
}
runAsyncLoops();

// H3: Custom iterator protocol
console.log("\n=== H3: Custom Iterators ===");
class InfiniteCounter {
  #current;
  #step;
  constructor(start = 0, step = 1) { this.#current = start; this.#step = step; }

  [Symbol.iterator]() {
    let current = this.#current;
    const step  = this.#step;
    return {
      next() {
        const value = current;
        current += step;
        return { value, done: false };  // infinite — never done
      },
      return(value) { return { value, done: true }; }  // cleanup on break
    };
  }

  take(n) {
    const result = [];
    for (const val of this) {
      result.push(val);
      if (result.length >= n) break;
    }
    return result;
  }
}

const counter = new InfiniteCounter(0, 3);
console.log(counter.take(10));  // [0,3,6,9,12,15,18,21,24,27]

// Range iterator
class Range {
  constructor(start, end, step = 1) {
    Object.assign(this, { start, end, step });
  }
  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;
    return {
      next() {
        if (current < end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

console.log([...new Range(1, 10, 2)]);  // [1,3,5,7,9]
for (const n of new Range(0, 5)) process.stdout.write(n + " ");
console.log();
