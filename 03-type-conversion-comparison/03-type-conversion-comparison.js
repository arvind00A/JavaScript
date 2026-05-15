// ============================================================
// Section 3 — Type Conversion & Comparison
// Run: node 03-type-conversion-comparison.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Explicit type conversions
console.log("=== E1: Explicit Conversions ===");
console.log(String(42));           // "42"
console.log(String(true));         // "true"
console.log(String(null));         // "null"
console.log(Number("42"));         // 42
console.log(Number(""));           // 0
console.log(Number("abc"));        // NaN
console.log(Number(true));         // 1
console.log(Number(false));        // 0
console.log(Number(null));         // 0
console.log(Number(undefined));    // NaN
console.log(Boolean(0));           // false
console.log(Boolean(""));          // false
console.log(Boolean({}));          // true ← empty object is truthy!
console.log(Boolean([]));          // true ← empty array is truthy!

// E2: Truthy and falsy values
console.log("\n=== E2: Truthy / Falsy ===");
const values = [0, -0, 0n, "", '', ``, null, undefined, NaN, false,
                1, -1, "hello", " ", "0", [], {}, function(){}];
for (const v of values) {
  const display = v === "" ? '""' : v === null ? "null" : String(v).slice(0,12);
  console.log(`  ${display.padEnd(14)} → ${v ? "✅ truthy" : "❌ falsy"}`);
}

// E3: == vs === basics
console.log("\n=== E3: == vs === ===");
console.log(1 == "1");       // true  — coercion
console.log(1 === "1");      // false — strict
console.log(0 == false);     // true  — coercion
console.log(0 === false);    // false — strict
console.log(null == undefined);  // true
console.log(null === undefined); // false

// ── MODERATE ──────────────────────────────────────────────

// M1: All confusing JS cases
console.log("\n=== M1: JS Gotchas ===");
const cases = [
  ["'5' + 3",    "5" + 3],
  ["'5' - 3",    "5" - 3],
  ["true + true", true + true],
  ["null + 1",    null + 1],
  ["undefined+1", undefined + 1],
  ["[] + []",     [] + []],
  ["[] + {}",     [] + {}],
  ["{} + []",     ({}) + []],
  ["NaN == NaN",  NaN == NaN],
  ["null >= 0",   null >= 0],
  ["null == 0",   null == 0],
  ['"11" > "9"',  "11" > "9"],
  ['"11" > 9',    "11" > 9],
  ["[] == false", [] == false],
  ["[] == ![]",   [] == ![]],
];
for (const [expr, result] of cases) {
  console.log(`  ${expr.padEnd(20)} = ${JSON.stringify(result)}`);
}

// M2: parseInt / parseFloat edge cases
console.log("\n=== M2: Parse Edge Cases ===");
console.log(parseInt("42.9px"));        // 42
console.log(parseFloat("3.14abc"));     // 3.14
console.log(parseInt("0xFF", 16));      // 255
console.log(parseInt("1010", 2));       // 10
console.log(parseInt("010"));           // 10 (NOT octal in strict mode)
console.log(parseInt("abc"));           // NaN
console.log(parseInt(0.000005));        // 5  ← parses "5e-7" → stops at e!
console.log(parseFloat("Infinity"));    // Infinity

// M3: Build a safeNumber converter
console.log("\n=== M3: safeNumber Converter ===");
function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isNaN(n) || !Number.isFinite(n) ? fallback : n;
}
console.log(safeNumber("42"));         // 42
console.log(safeNumber("abc"));        // 0
console.log(safeNumber(null));         // 0
console.log(safeNumber(Infinity));     // 0
console.log(safeNumber("3.14"));       // 3.14
console.log(safeNumber("3.14", -1));   // 3.14
console.log(safeNumber("bad", -1));    // -1

// M4: Custom equality check
console.log("\n=== M4: Deep Equality ===");
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a), keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(k => deepEqual(a[k], b[k]));
}

console.log(deepEqual(1, 1));                   // true
console.log(deepEqual({a:1}, {a:1}));           // true
console.log(deepEqual({a:1}, {a:2}));           // false
console.log(deepEqual([1,[2,3]], [1,[2,3]]));   // true
console.log(deepEqual(null, null));             // true
console.log(deepEqual(null, undefined));        // false

// ── HARD ──────────────────────────────────────────────────

// H1: Comprehensive type coercion table generator
console.log("\n=== H1: Coercion Table ===");
function coercionTable(values) {
  console.log("\nValue          String         Number   Boolean");
  console.log("─".repeat(55));
  for (const v of values) {
    const display = String(JSON.stringify(v) ?? typeof v).padEnd(14);
    const str  = String(v).padEnd(14);
    const num  = String(Number(v)).padEnd(8);
    const bool = String(Boolean(v));
    console.log(`${display} ${str} ${num} ${bool}`);
  }
}
coercionTable([0, 1, -1, "", "0", "1", "abc", null, undefined, true, false, [], [0], [1]]);

// H2: Implement JavaScript's abstract equality algorithm
console.log("\n=== H2: Abstract Equality Implementation ===");
function abstractEqual(x, y) {
  // Step-by-step implementation of ES spec == algorithm
  if (typeof x === typeof y) return x === y;  // same type: use ===
  if (x === null && y === undefined) return true;
  if (x === undefined && y === null) return true;
  if (typeof x === "number" && typeof y === "string") return x === Number(y);
  if (typeof x === "string" && typeof y === "number") return Number(x) === y;
  if (typeof x === "bigint" && typeof y === "string") {
    const n = BigInt.asIntN(64, BigInt(y.trim()) || 0n);
    return x === n;
  }
  if (typeof x === "boolean") return abstractEqual(Number(x), y);
  if (typeof y === "boolean") return abstractEqual(x, Number(y));
  if ((typeof x === "string" || typeof x === "number" || typeof x === "symbol" || typeof x === "bigint")
      && typeof y === "object" && y !== null) return abstractEqual(x, y.valueOf?.() ?? y);
  if (typeof x === "object" && x !== null && (typeof y === "string" || typeof y === "number"))
    return abstractEqual(x.valueOf?.() ?? x, y);
  return false;
}

const eqTests = [
  [1, "1"], [0, false], [null, undefined], [NaN, NaN],
  [[], false], ["0", false], ["", false], [true, "1"]
];
for (const [a, b] of eqTests) {
  const native = a == b;
  const custom = abstractEqual(a, b);
  const match  = native === custom ? "✅" : "❌ MISMATCH";
  console.log(`  ${JSON.stringify(a)} == ${JSON.stringify(b)} → ${native} ${match}`);
}
