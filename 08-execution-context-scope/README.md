# 📦 Section 8 — Execution Context & Scope

---

## Execution Context
```
Every time JS code runs, an Execution Context (EC) is created.

Types:
1. Global EC  — created first, contains global code
2. Function EC — created each time a function is called
3. Eval EC    — created inside eval() (avoid)

Each EC has:
- Variable Environment  (stores variables/functions)
- Lexical Environment   (scope chain reference)
- this binding
```

## Call Stack
```
LIFO (Last In First Out) stack of execution contexts.

Example:
  function c() { ... }
  function b() { c(); }
  function a() { b(); }
  a();

Call Stack progression:
  [global EC]
  [global EC, a EC]
  [global EC, a EC, b EC]
  [global EC, a EC, b EC, c EC]
  [global EC, a EC, b EC]   ← c returns
  [global EC, a EC]          ← b returns
  [global EC]                ← a returns
```

## Scope Types
```js
// Global scope
var globalVar = "I'm global";
let globalLet = "Also global but not on window";

function outer() {
  // Function scope
  let funcVar = "function scope";

  if (true) {
    // Block scope
    let blockVar = "block scope";
    var funcLeak = "leaks to function scope!";
    console.log(funcVar);    // ✅ accessible (outer scope)
    console.log(blockVar);   // ✅ accessible
  }
  console.log(funcLeak);    // ✅ var leaks from block
  // console.log(blockVar); // ❌ ReferenceError
}
```

## Scope Chain
```js
const x = "global";
function outer() {
  const x = "outer";
  function inner() {
    const x = "inner";
    console.log(x);   // "inner" — own scope
  }
  function noOwn() {
    console.log(x);   // "outer" — looks up scope chain
  }
  inner();
  noOwn();
}
outer();
// Scope chain: inner → outer → global → built-in
```

## Hoisting
```js
// var declarations are hoisted (but not assignments)
console.log(a);   // undefined (not ReferenceError!)
var a = 5;
// Equivalent to:
// var a;            // hoisted
// console.log(a);   // undefined
// a = 5;            // assignment stays

// Function declarations are fully hoisted
greet("Alice");   // works!
function greet(name) { return `Hi ${name}`; }

// let/const are hoisted but in Temporal Dead Zone
// console.log(b); // ReferenceError — in TDZ
let b = 10;

// Function expressions are NOT hoisted
// sayHi();   // TypeError: sayHi is not a function
var sayHi = function() { return "hi"; };
```

---
