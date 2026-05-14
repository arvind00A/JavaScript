// ============================================================
// Section 2 — Variables & Data Types
// Run: node 02-variables-data-types.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Declare variables with all three keywords
console.log("=== E1: var / let / const ===");
var age = 25;
let name = "Alice";
const PI = 3.14159;

console.log(age, name, PI);

// var is function-scoped (leaks from blocks)
if (true) {
  var varLeak = "I leaked!";
  let letSafe = "I'm safe";
  // const constSafe = "Also safe";
}
console.log(varLeak);          // "I leaked!" — var leaks
// console.log(letSafe);       // ReferenceError ← uncomment to test

// E2: Explore all 7 primitive types
console.log("\n=== E2: All 7 Primitives ===");
const str       = "Hello World";           // string
const num       = 42;                      // number
const float     = 3.14;                    // number
const bool      = true;                    // boolean
const nothing   = null;                    // null
let notAssigned;                           // undefined
const sym       = Symbol("unique");        // symbol
const bigNumber = 9007199254740993n;       // bigint

console.log("string:   ", typeof str,        "→", str);
console.log("number:   ", typeof num,        "→", num);
console.log("float:    ", typeof float,      "→", float);
console.log("boolean:  ", typeof bool,       "→", bool);
console.log("null:     ", typeof nothing,    "→", nothing, "(⚠️ typeof null === 'object')");
console.log("undefined:", typeof notAssigned,"→", notAssigned);
console.log("symbol:   ", typeof sym,        "→", sym.toString());
console.log("bigint:   ", typeof bigNumber,  "→", bigNumber);

// E3: Reference types demo
console.log("\n=== E3: Reference Types ===");
const obj1 = { x: 1 };
const obj2 = obj1;        // same reference!
obj2.x = 99;
console.log("obj1.x:", obj1.x);   // 99 — both point to same heap object

const arr1 = [1, 2, 3];
const arr2 = arr1;
arr2.push(4);
console.log("arr1:", arr1);       // [1,2,3,4] — same reference

// ── MODERATE ──────────────────────────────────────────────

// M1: typeof gotchas
console.log("\n=== M1: typeof Gotchas ===");
console.log(typeof null);           // "object" ← JS bug!
console.log(typeof []);             // "object" ← arrays are objects
console.log(typeof {});             // "object"
console.log(typeof function(){});   // "function"
console.log(typeof NaN);            // "number" ← NaN is a number type!
console.log(Array.isArray([]));     // true ← correct array check
console.log(null === null);         // true ← correct null check
console.log(Number.isNaN(NaN));     // true ← correct NaN check

// M2: Special number values
console.log("\n=== M2: Special Numbers ===");
console.log(1 / 0);          // Infinity
console.log(-1 / 0);         // -Infinity
console.log(0 / 0);          // NaN
console.log("abc" * 2);      // NaN
console.log(NaN === NaN);    // false ← NaN is not equal to itself!
console.log(isNaN("abc"));   // true — old way (coerces first)
console.log(Number.isNaN("abc")); // false ← strict, no coercion
console.log(Number.isNaN(NaN));   // true ← correct

console.log(Number.MAX_SAFE_INTEGER);   // 9007199254740991
console.log(Number.MIN_SAFE_INTEGER);   // -9007199254740991
console.log(Number.MAX_VALUE);          // 1.7976931348623157e+308
console.log(Number.EPSILON);            // smallest difference

// M3: Symbols are always unique
console.log("\n=== M3: Symbols ===");
const s1 = Symbol("id");
const s2 = Symbol("id");
console.log(s1 === s2);          // false — always unique
console.log(s1.description);     // "id"
console.log(s1.toString());      // "Symbol(id)"

// Symbols as object keys — won't conflict with string keys
const USER_ID = Symbol("userId");
const user = {
  name: "Alice",
  [USER_ID]: 101,
};
console.log(user.name);          // "Alice"
console.log(user[USER_ID]);      // 101
console.log(Object.keys(user));  // ["name"] — symbol not visible!

// M4: BigInt operations
console.log("\n=== M4: BigInt ===");
const MAX_SAFE = Number.MAX_SAFE_INTEGER;
console.log(MAX_SAFE + 1 === MAX_SAFE + 2);  // true ← precision lost!
const bigMax = BigInt(MAX_SAFE);
console.log(bigMax + 1n === bigMax + 2n);    // false ← precise!

// M5: Stack vs Heap visualisation
console.log("\n=== M5: Stack vs Heap ===");
// Primitive — copy on assignment
let prim1 = 10;
let prim2 = prim1;   // copy of VALUE
prim2 = 99;
console.log("prim1:", prim1, "prim2:", prim2);  // 10, 99 — independent

// Reference — copy of pointer
let ref1 = { value: 10 };
let ref2 = ref1;     // copy of REFERENCE
ref2.value = 99;
console.log("ref1.value:", ref1.value);  // 99 — shared!

// Proper copy (shallow)
let ref3 = { ...ref1 };  // spread creates new object
ref3.value = 0;
console.log("ref1.value after shallow copy change:", ref1.value);  // still 99

// ── HARD ──────────────────────────────────────────────────

// H1: Deep clone utility (handles nested objects)
console.log("\n=== H1: Deep Clone ===");
function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(deepClone);
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}

const original = { a: 1, b: { c: 2, d: [3, 4, { e: 5 }] } };
const clone = deepClone(original);
clone.b.c = 999;
clone.b.d[2].e = 888;

console.log("original:", JSON.stringify(original));  // unchanged
console.log("clone:   ", JSON.stringify(clone));      // changed

// H2: Type-safe variable wrapper
console.log("\n=== H2: Type-Safe Wrapper ===");
function createTypedVar(value) {
  const type = Array.isArray(value) ? "array"
             : value === null       ? "null"
             : typeof value;
  return {
    value,
    type,
    is: (t) => type === t,
    set(newValue) {
      const newType = Array.isArray(newValue) ? "array"
                    : newValue === null        ? "null"
                    : typeof newValue;
      if (newType !== type) {
        throw new TypeError(`Expected ${type}, got ${newType}`);
      }
      return createTypedVar(newValue);
    },
    toString: () => `TypedVar<${type}>(${JSON.stringify(value)})`,
  };
}

const typedNum = createTypedVar(42);
console.log(typedNum.toString());         // TypedVar<number>(42)
const updated = typedNum.set(100);
console.log(updated.toString());          // TypedVar<number>(100)
try {
  typedNum.set("hello");                  // throws TypeError
} catch (e) {
  console.log("Type error caught:", e.message);
}

// H3: Detailed type inspector
console.log("\n=== H3: Type Inspector ===");
function inspectType(value) {
  const rawType = Object.prototype.toString.call(value); // "[object Array]" etc.
  const type    = rawType.slice(8, -1).toLowerCase();    // "array"
  const isNull  = value === null;
  const isPrim  = value !== null && typeof value !== "object" && typeof value !== "function";

  return {
    value,
    typeof: typeof value,
    exactType: type,
    isPrimitive: isPrim,
    isReference: !isPrim && !isNull,
    isNull,
    isTruthy: !!value,
    isFalsy:  !value,
  };
}

const testValues = [0, "", null, undefined, false, NaN, [], {}, "hello", 42, true, () => {}];
console.log("\nValue            typeof       exactType    prim   truthy");
console.log("─".repeat(65));
for (const val of testValues) {
  const info = inspectType(val);
  console.log(
    String(JSON.stringify(val) ?? val).padEnd(16),
    info.typeof.padEnd(12),
    info.exactType.padEnd(12),
    String(info.isPrimitive).padEnd(6),
    String(info.isTruthy)
  );
}
