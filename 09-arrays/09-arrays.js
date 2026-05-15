// ============================================================
// Section 9 — Arrays
// Run: node 09-arrays.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Creating arrays
console.log("=== E1: Creating Arrays ===");
const arr1 = [1, 2, 3, 4, 5];
const arr2 = new Array(5).fill(0);
const arr3 = Array.from({ length: 5 }, (_, i) => i + 1);
const arr4 = Array.from("hello");
const arr5 = Array.of(10, 20, 30);
console.log(arr1);   // [1,2,3,4,5]
console.log(arr2);   // [0,0,0,0,0]
console.log(arr3);   // [1,2,3,4,5]
console.log(arr4);   // ['h','e','l','l','o']
console.log(arr5);   // [10,20,30]

// E2: Mutating methods
console.log("\n=== E2: Mutating Methods ===");
const a = [1, 2, 3];
a.push(4, 5);          console.log("push(4,5):", a);
a.pop();               console.log("pop():",     a);
a.unshift(0);          console.log("unshift(0):", a);
a.shift();             console.log("shift():",   a);
a.splice(1, 1, 99);    console.log("splice(1,1,99):", a);
a.reverse();           console.log("reverse():", a);
a.sort((x, y) => x-y); console.log("sort():",   a);

// E3: Non-mutating methods
console.log("\n=== E3: Non-Mutating Methods ===");
const nums = [1, 2, 3, 4, 5];
console.log(nums.slice(1, 3));         // [2,3]
console.log(nums.concat([6, 7]));      // [1,2,3,4,5,6,7]
console.log(nums.indexOf(3));          // 2
console.log(nums.includes(4));         // true
console.log(nums.join(" - "));         // "1 - 2 - 3 - 4 - 5"
console.log(nums.find(n => n > 3));    // 4
console.log(nums.findIndex(n => n>3)); // 3
console.log(nums.at(-1));              // 5 (last)
console.log(nums.at(-2));              // 4 (second last)

// E4: map / filter / reduce
console.log("\n=== E4: map/filter/reduce ===");
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const doubled   = data.map(n => n * 2);
const evens     = data.filter(n => n % 2 === 0);
const total     = data.reduce((acc, n) => acc + n, 0);
const product   = data.reduce((acc, n) => acc * n, 1);
console.log("doubled:", doubled);
console.log("evens:", evens);
console.log("sum:", total);
console.log("product:", product);

// ── MODERATE ──────────────────────────────────────────────

// M1: Array method chaining
console.log("\n=== M1: Method Chaining ===");
const students = [
  { name: "Alice",  grade: 92, subject: "Math"    },
  { name: "Bob",    grade: 75, subject: "Science"  },
  { name: "Carol",  grade: 88, subject: "Math"     },
  { name: "Dave",   grade: 95, subject: "Science"  },
  { name: "Eve",    grade: 60, subject: "Math"     },
  { name: "Frank",  grade: 82, subject: "Science"  },
];

// Top Math students scoring > 80, sorted by grade desc
const topMath = students
  .filter(s => s.subject === "Math" && s.grade > 80)
  .sort((a, b) => b.grade - a.grade)
  .map(s => `${s.name} (${s.grade})`);
console.log("Top Math students:", topMath);

// Average grade per subject
const avgBySubject = students.reduce((acc, s) => {
  if (!acc[s.subject]) acc[s.subject] = { total: 0, count: 0 };
  acc[s.subject].total += s.grade;
  acc[s.subject].count += 1;
  return acc;
}, {});
for (const [sub, { total, count }] of Object.entries(avgBySubject))
  console.log(`  ${sub} avg: ${(total/count).toFixed(1)}`);

// M2: flat and flatMap
console.log("\n=== M2: flat / flatMap ===");
const nested = [1, [2, 3], [4, [5, 6]], [[7, [8]]]];
console.log(nested.flat(1));    // 1 level deep
console.log(nested.flat(2));    // 2 levels deep
console.log(nested.flat(Infinity)); // fully flat

// flatMap = map + flat(1)
const sentences = ["Hello World", "Foo Bar", "JS is fun"];
const words = sentences.flatMap(s => s.split(" "));
console.log(words);  // ['Hello','World','Foo','Bar','JS','is','fun']

// Group words by length using flatMap
const grouped = [1, 2, 3].flatMap(n => [n, n * 2]);
console.log(grouped);  // [1,2,2,4,3,6]

// M3: Searching and sorting
console.log("\n=== M3: Searching & Sorting ===");
const products = [
  { id: 1, name: "Laptop",  price: 999,  category: "Electronics" },
  { id: 2, name: "Book",    price: 29,   category: "Education"   },
  { id: 3, name: "Phone",   price: 699,  category: "Electronics" },
  { id: 4, name: "Pen",     price: 2,    category: "Education"   },
  { id: 5, name: "Tablet",  price: 499,  category: "Electronics" },
];

// Find by predicate
const laptop = products.find(p => p.name === "Laptop");
console.log("Found:", laptop.name, laptop.price);

// Multi-key sort: category asc, then price desc
const sorted = [...products].sort((a, b) => {
  if (a.category < b.category) return -1;
  if (a.category > b.category) return  1;
  return b.price - a.price;  // price desc within same category
});
console.log("Sorted:");
sorted.forEach(p => console.log(`  ${p.category.padEnd(12)} ${p.name.padEnd(8)} $${p.price}`));

// M4: every, some, includes
console.log("\n=== M4: every / some / includes ===");
const scores = [85, 90, 78, 92, 88];
console.log(scores.every(s => s >= 70));    // true — all pass
console.log(scores.some(s  => s >= 90));    // true — at least one A
console.log(scores.every(s => s >= 90));    // false — not all A
console.log(scores.includes(92));           // true
console.log(scores.indexOf(78));            // 2

// ── HARD ──────────────────────────────────────────────────

// H1: Implement Array utility functions
console.log("\n=== H1: Array Utilities ===");
const ArrayUtils = {
  // chunk: split into groups of n
  chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) },
      (_, i) => arr.slice(i * size, i * size + size));
  },
  // unique: remove duplicates
  unique(arr) { return [...new Set(arr)]; },
  // uniqueBy: remove duplicates by key
  uniqueBy(arr, key) {
    const seen = new Set();
    return arr.filter(item => {
      const k = typeof key === "function" ? key(item) : item[key];
      return seen.has(k) ? false : (seen.add(k), true);
    });
  },
  // groupBy: group array items by key
  groupBy(arr, key) {
    return arr.reduce((acc, item) => {
      const k = typeof key === "function" ? key(item) : item[key];
      (acc[k] ??= []).push(item);
      return acc;
    }, {});
  },
  // zip: pair elements from multiple arrays
  zip(...arrays) {
    const len = Math.min(...arrays.map(a => a.length));
    return Array.from({ length: len }, (_, i) => arrays.map(a => a[i]));
  },
  // flatten deeply
  deepFlatten(arr) {
    return arr.reduce((acc, val) =>
      Array.isArray(val) ? acc.concat(this.deepFlatten(val)) : acc.concat(val), []);
  },
  // partition: split into [match, noMatch]
  partition(arr, pred) {
    return arr.reduce(([yes, no], item) =>
      pred(item) ? [[...yes, item], no] : [yes, [...no, item]], [[], []]);
  },
};

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("chunk(3):",     ArrayUtils.chunk(arr, 3));
console.log("unique:",       ArrayUtils.unique([1,2,2,3,3,3,4]));
console.log("zip:",          ArrayUtils.zip([1,2,3],["a","b","c"],["x","y","z"]));
console.log("deepFlatten:",  ArrayUtils.deepFlatten([1,[2,[3,[4,[5]]]]]));

const [evens2, odds] = ArrayUtils.partition(arr, n => n % 2 === 0);
console.log("partition even:", evens2);
console.log("partition odd:", odds);

const people = [
  { name:"Alice",dept:"Eng"},{ name:"Bob",dept:"HR"},
  { name:"Carol",dept:"Eng"},{ name:"Dave",dept:"HR"},{ name:"Eve",dept:"Eng"}
];
const byDept = ArrayUtils.groupBy(people, "dept");
console.log("groupBy dept:", JSON.stringify(byDept));

// H2: Sorted and searchable array wrapper
console.log("\n=== H2: Sorted Array ===");
class SortedArray {
  #data;
  #compare;

  constructor(compare = (a, b) => a - b) {
    this.#data = [];
    this.#compare = compare;
  }

  insert(value) {
    let lo = 0, hi = this.#data.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.#compare(this.#data[mid], value) < 0) lo = mid + 1;
      else hi = mid;
    }
    this.#data.splice(lo, 0, value);
    return this;
  }

  remove(value) {
    const i = this.#binarySearch(value);
    if (i >= 0) this.#data.splice(i, 1);
    return this;
  }

  #binarySearch(value) {
    let lo = 0, hi = this.#data.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const cmp = this.#compare(this.#data[mid], value);
      if (cmp === 0) return mid;
      if (cmp < 0) lo = mid + 1;
      else hi = mid - 1;
    }
    return -1;
  }

  has(value)   { return this.#binarySearch(value) >= 0; }
  toArray()    { return [...this.#data]; }
  get size()   { return this.#data.length; }
  min()        { return this.#data[0]; }
  max()        { return this.#data[this.#data.length - 1]; }
}

const sa = new SortedArray();
[5, 2, 8, 1, 9, 3, 7, 4, 6].forEach(n => sa.insert(n));
console.log("Sorted:", sa.toArray());   // [1,2,3,4,5,6,7,8,9]
console.log("Has 5:", sa.has(5));        // true
console.log("Min:", sa.min(), "Max:", sa.max());
sa.remove(5);
console.log("After remove 5:", sa.toArray());
