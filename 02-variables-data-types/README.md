# 🧠 Section 2 — Variables & Data Types

---

## var, let, const

| Feature | `var` | `let` | `const` |
|---|---|---|---|
| Scope | Function | Block | Block |
| Hoisted | ✅ (as `undefined`) | ✅ (TDZ — not accessible) | ✅ (TDZ) |
| Re-declare | ✅ | ❌ | ❌ |
| Re-assign | ✅ | ✅ | ❌ |
| Global object property | ✅ (window.x) | ❌ | ❌ |
| Use today | ❌ Avoid | ✅ | ✅ Prefer |

```js
var x = 10;     // function-scoped, hoisted
let y = 20;     // block-scoped
const z = 30;   // block-scoped, cannot be reassigned

// var is function-scoped — leaks out of blocks!
if (true) {
  var leaked = "I leak";
  let safe   = "I'm block-scoped";
}
console.log(leaked);  // "I leak" ← problem!
console.log(safe);    // ReferenceError ✅

// const with objects — the binding is constant, not the content
const obj = { a: 1 };
obj.a = 2;        // ✅ allowed — mutating the object
obj = { b: 3 };   // ❌ TypeError — cannot reassign binding
```

### Temporal Dead Zone (TDZ)
```js
console.log(a);   // undefined  (var hoisted)
console.log(b);   // ReferenceError (let/const in TDZ)
var a = 1;
let b = 2;
```

---

## Primitive Data Types (7 types)

Primitives are **immutable** and stored on the **stack**.

### 1. String
```js
let name = "Alice";
let greeting = 'Hello';
let template = `Hi, ${name}!`;   // template literal

// Strings are immutable
let s = "hello";
s[0] = "H";           // silently fails
console.log(s);        // "hello" — unchanged!
```

### 2. Number
```js
let int   = 42;
let float = 3.14;
let neg   = -7;
let big   = 1_000_000;    // underscore separator (readability)

// Special number values
console.log(Infinity);    // 1/0
console.log(-Infinity);   // -1/0
console.log(NaN);         // "Not a Number" — e.g. "abc" * 2

// NaN is the only value not equal to itself!
console.log(NaN === NaN);        // false
console.log(Number.isNaN(NaN));  // true ✅
```

### 3. Boolean
```js
let isActive = true;
let isLoggedIn = false;

// Produced by comparisons
console.log(5 > 3);    // true
console.log(5 === 3);  // false
```

### 4. null
```js
let result = null;   // intentional "no value"
console.log(typeof null);   // "object" ← known JS bug!
```

### 5. undefined
```js
let x;               // declared but not assigned
console.log(x);      // undefined
console.log(typeof x);  // "undefined"

function noReturn() {}
console.log(noReturn());  // undefined — functions without return
```

### 6. Symbol (ES6)
```js
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2);    // false — always unique!
console.log(id1.toString()); // "Symbol(id)"
console.log(id1.description); // "id"

// Used as unique object keys
const obj = {};
obj[id1] = "value1";
```

### 7. BigInt (ES2020)
```js
const big = 9007199254740991n;   // n suffix
const big2 = BigInt("9999999999999999999");
console.log(big + 1n);           // ✅
console.log(big + 1);            // ❌ TypeError — can't mix BigInt and Number
console.log(typeof big);         // "bigint"
```

---

## Non-Primitive (Reference Types)

Stored on the **heap**; variables hold a **reference** (pointer).

```js
// Object
const person = { name: "Alice", age: 30 };

// Array (special object)
const colors = ["red", "green", "blue"];

// Function (also an object)
const greet = function() { return "hello"; };

// Reference behaviour — multiple variables can point to same object!
const a = { x: 1 };
const b = a;          // b points to SAME object
b.x = 99;
console.log(a.x);     // 99 ← a was changed through b!

// To copy: use spread or Object.assign
const c = { ...a };   // shallow copy
c.x = 0;
console.log(a.x);     // 99 ← a is NOT changed
```

---

## Type Checking (`typeof`)

```js
typeof "hello"      // "string"
typeof 42           // "number"
typeof 3.14         // "number"
typeof true         // "boolean"
typeof undefined    // "undefined"
typeof null         // "object"  ← historical bug in JS!
typeof Symbol()     // "symbol"
typeof 42n          // "bigint"
typeof {}           // "object"
typeof []           // "object"  ← arrays are objects!
typeof function(){} // "function"

// Better checks:
Array.isArray([]);        // true  ← use for arrays
null === null;            // true  ← use for null
x instanceof Object;      // true  ← use for objects
Object.prototype.toString.call([]);  // "[object Array]"
```

---

## Stack vs Heap Memory

```
STACK (primitives)           HEAP (objects/arrays/functions)
─────────────────────        ──────────────────────────────
  Fast, fixed size             Slower, dynamic size
  Stores value directly        Stores reference (address)
  Automatically managed        Garbage collected

let a = 5;    →  stack: a = 5
let b = a;    →  stack: b = 5 (copy of value)
b = 10;       →  stack: b = 10  |  a still = 5

let obj1 = {x:1};  →  heap: {x:1}  |  stack: obj1 → @001
let obj2 = obj1;   →  stack: obj2 → @001 (SAME reference!)
obj2.x = 99;       →  heap: {x:99}  |  both point to same!
```

---

## Quick Reference

| Type | Example | typeof |
|---|---|---|
| String | `"hello"` | `"string"` |
| Number | `42`, `3.14`, `NaN`, `Infinity` | `"number"` |
| Boolean | `true`, `false` | `"boolean"` |
| null | `null` | `"object"` ⚠️ |
| undefined | `undefined` | `"undefined"` |
| Symbol | `Symbol("id")` | `"symbol"` |
| BigInt | `42n` | `"bigint"` |
| Object | `{}`, `[]`, `function(){}` | `"object"` / `"function"` |
