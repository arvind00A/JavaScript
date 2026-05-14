# 🚀 JavaScript Roadmap — Complete Study Guide

> **22 sections** · **22 cheat sheets** · **22 project files** · Beginner → Advanced

---

## 📁 Folder Structure

```
js-roadmap/
├── README.md                          ← You are here
├── /                       ← Theory + syntax reference (22 files)
│   ├── 01-introduction-setup.md
│   ├── 02-variables-data-types.md
│   ├── 03-type-conversion-comparison.md
│   ├── 04-operators.md
│   ├── 05-control-flow.md
│   ├── 06-loops-iterations.md
│   ├── 07-functions.md
│   ├── 08-execution-context-scope.md
│   ├── 09-arrays.md
│   ├── 10-objects.md
│   ├── 11-strings-numbers-date.md
│   ├── 12-dom.md
│   ├── 13-events.md
│   ├── 14-advanced-concepts.md
│   ├── 15-oop.md
│   ├── 16-prototypes.md
│   ├── 17-async-javascript.md
│   ├── 18-api-networking.md
│   ├── 19-es6-features.md
│   ├── 20-modules-code-organization.md
│   ├── 21-projects.md
│   └── 22-bonus-advanced.md
└── /                          ← Runnable practice files (22 files)
    ├── 01-introduction-setup.js
    ├── 02-variables-data-types.js
    ├── 03-type-conversion-comparison.js
    ├── 04-operators.js
    ├── 05-control-flow.js
    ├── 06-loops-iterations.js
    ├── 07-functions.js
    ├── 08-execution-context-scope.js
    ├── 09-arrays.js
    ├── 10-objects.js
    ├── 11-strings-numbers-date.js
    ├── 12-dom.js
    ├── 13-events.js
    ├── 14-advanced-concepts.js
    ├── 15-oop.js
    ├── 16-prototypes.js
    ├── 17-async-javascript.js
    ├── 18-api-networking.js
    ├── 19-es6-features.js
    ├── 20-modules-code-organization.js
    ├── 21-projects.js
    └── 22-bonus-advanced.js
```

---

## ⚡ Quick Start

```bash
# Prerequisites
node --version    # Need Node.js 18+ (for native fetch)
npm --version

# Run any project file
node projects/01-introduction-setup.js
node projects/09-arrays.js
node projects/17-async-javascript.js

# Run all project files in sequence
for f in projects/*.js; do echo "--- $f ---"; node "$f"; done
```

---

## 📚 Section Reference

| #   | Section                   | Key Topics                                            | Run                                                |
| --- | ------------------------- | ----------------------------------------------------- | -------------------------------------------------- |
| 01  | 🔰 Introduction & Setup   | JS engine, Node.js, console, debugging                | `node projects/01-introduction-setup.js`           |
| 02  | 🧠 Variables & Data Types | var/let/const, 7 primitives, stack vs heap            | `node projects/02-variables-data-types.js`         |
| 03  | 🔄 Type Conversion        | Coercion, truthy/falsy, == vs ===                     | `node projects/03-type-conversion-comparison.js`   |
| 04  | ➕ Operators              | Arithmetic, logical, ??. ?., bitwise                  | `node projects/04-operators.js`                    |
| 05  | 🔁 Control Flow           | if/else, switch, ternary, guard clauses               | `node projects/05-control-flow.js`                 |
| 06  | 🔂 Loops                  | for, while, for..of, for..in, iterators               | `node projects/06-loops-iterations.js`             |
| 07  | 🧩 Functions              | Declaration, arrow, closures, curry, HOF              | `node projects/07-functions.js`                    |
| 08  | 📦 Execution Context      | Call stack, scope chain, hoisting                     | `node projects/08-execution-context-scope.js`      |
| 09  | 🧱 Arrays                 | map/filter/reduce, flat, sort, iterators              | `node projects/09-arrays.js`                       |
| 10  | 🏗️ Objects                | Destructuring, spread, Proxy, descriptors             | `node projects/10-objects.js`                      |
| 11  | 📚 Strings, Numbers, Date | Methods, regex, Math, Intl, Date ops                  | `node projects/11-strings-numbers-date.js`         |
| 12  | 🌐 DOM                    | Select, manipulate, create, delete elements           | `node projects/12-dom.js` (+ open HTML in browser) |
| 13  | 🖱️ Events                 | Listeners, bubbling, delegation, custom EventEmitter  | `node projects/13-events.js`                       |
| 14  | 🔗 Advanced Concepts      | this, call/apply/bind, closures, IIFE                 | `node projects/14-advanced-concepts.js`            |
| 15  | 🧬 OOP                    | Classes, inheritance, mixins, abstract, patterns      | `node projects/15-oop.js`                          |
| 16  | 🧪 Prototypes             | Prototype chain, Object.create, descriptors           | `node projects/16-prototypes.js`                   |
| 17  | ⏳ Async JavaScript       | Callbacks, Promises, async/await, queues              | `node projects/17-async-javascript.js`             |
| 18  | 🌍 API & Networking       | fetch, CRUD, caching, streaming, abort                | `node projects/18-api-networking.js`               |
| 19  | ⚙️ ES6+ Features          | Map/Set, Symbols, Generators, Proxy, tagged templates | `node projects/19-es6-features.js`                 |
| 20  | 🧩 Modules                | ESM, CommonJS, patterns, DI container, plugins        | `node projects/20-modules-code-organization.js`    |
| 21  | 🎯 Projects               | To-Do CLI, Quiz, Budget Tracker, Text Analyser, Redux | `node projects/21-projects.js`                     |
| 22  | 🚀 Bonus / Advanced       | Event loop, V8, memory, clean code, performance       | `node projects/22-bonus-advanced.js`               |

---

## 🎯 Interview Quick-Reference

### Most-Asked JavaScript Interview Questions

#### Variables & Types

```js
// typeof gotchas
typeof null        // "object" ← famous bug!
typeof []          // "object" — use Array.isArray()
typeof NaN         // "number" — NaN is type number!
NaN === NaN        // false — use Number.isNaN()

// == vs ===
null == undefined  // true  (only case!)
null === undefined // false
0 == ""            // true  (coercion)
[] == false        // true  (coercion)
```

#### Closures

```js
function makeCounter() {
  let count = 0;
  return () => ++count; // closes over count
}
const counter = makeCounter();
counter(); // 1
counter(); // 2
```

#### var/let/const in loops

```js
// ❌ Bug — all 3 (var leaks)
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 3 3 3
// ✅ Fix — let creates new binding per iteration
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 0 1 2
```

#### Event Loop

```js
console.log("1");
setTimeout(() => console.log("4"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("2");
// Output: 1 → 2 → 3 → 4
// sync → microtask (Promise) → macrotask (setTimeout)
```

#### this Keyword

```js
const obj = {
  name: "Alice",
  regular() {
    return this.name;
  }, // this = obj ✅
  arrow: () => this.name, // this = outer scope ❌
};
```

#### Promises vs async/await

```js
// Promise chain
fetch(url).then(r=>r.json()).then(data=>...).catch(err=>...);

// async/await (same thing, cleaner syntax)
async function load() {
  try {
    const data = await fetch(url).then(r=>r.json());
  } catch(err) { ... }
}
```

#### Prototype chain

```js
// Every object → prototype → Object.prototype → null
const arr = [];
Object.getPrototypeOf(arr) === Array.prototype; // true
// arr.push() found on Array.prototype via chain
```

---

## 🗺️ Learning Path

### Beginner (Weeks 1–3)

- [ ] Section 1 — Setup & Console
- [ ] Section 2 — Variables & Types
- [ ] Section 3 — Type Conversion
- [ ] Section 4 — Operators
- [ ] Section 5 — Control Flow
- [ ] Section 6 — Loops

### Intermediate (Weeks 4–6)

- [ ] Section 7 — Functions
- [ ] Section 8 — Execution Context
- [ ] Section 9 — Arrays
- [ ] Section 10 — Objects
- [ ] Section 11 — Strings, Numbers, Date
- [ ] Section 12 — DOM

### Advanced (Weeks 7–10)

- [ ] Section 13 — Events
- [ ] Section 14 — Advanced Concepts (this, closures)
- [ ] Section 15 — OOP
- [ ] Section 16 — Prototypes
- [ ] Section 17 — Async JavaScript
- [ ] Section 18 — API & Networking

### Expert (Weeks 11–12)

- [ ] Section 19 — ES6+ Features
- [ ] Section 20 — Modules
- [ ] Section 21 — Projects
- [ ] Section 22 — Bonus & Advanced Topics

---

## 📝 How to Study Each Section

1. **Read** the cheat sheet (`cheatsheets/NN-section-name.md`)
2. **Run** the project file and study the output
3. **Modify** the examples — break things and fix them
4. **Build** your own small project using the concepts
5. **Explain** it out loud (Feynman technique)

---

## 🔥 ES Version Reference

| Version    | Year | Key Features                                                                               |
| ---------- | ---- | ------------------------------------------------------------------------------------------ |
| ES5        | 2009 | `strict mode`, `JSON`, `Array.forEach`                                                     |
| ES6/ES2015 | 2015 | `let/const`, arrow functions, classes, template literals, destructuring, Promises, modules |
| ES2016     | 2016 | `Array.includes`, `**` exponentiation                                                      |
| ES2017     | 2017 | `async/await`, `Object.entries/values`, `padStart/padEnd`                                  |
| ES2018     | 2018 | Rest/spread for objects, `Promise.finally`, async iteration                                |
| ES2019     | 2019 | `Array.flat/flatMap`, `Object.fromEntries`, optional catch binding                         |
| ES2020     | 2020 | `BigInt`, optional chaining `?.`, nullish coalescing `??`, `Promise.allSettled`            |
| ES2021     | 2021 | `Promise.any`, `String.replaceAll`, logical assignment `??=` `&&=` `\|\|=`                 |
| ES2022     | 2022 | Class fields `#private`, `Array.at()`, `Object.hasOwn`, top-level `await`                  |
| ES2023     | 2023 | `Array.findLast`, `Array.toSorted/toReversed/toSpliced` (non-mutating)                     |
| ES2024     | 2024 | `Promise.withResolvers`, `Object.groupBy`, `Map.groupBy`                                   |

---

## 🛠️ Recommended Tools

| Tool           | Purpose                     | Install                                                |
| -------------- | --------------------------- | ------------------------------------------------------ |
| Node.js 20 LTS | Run JS outside browser      | [nodejs.org](https://nodejs.org)                       |
| VS Code        | Editor                      | [code.visualstudio.com](https://code.visualstudio.com) |
| ESLint         | Code quality                | `npm i -g eslint`                                      |
| Prettier       | Auto formatting             | `npm i -g prettier`                                    |
| Nodemon        | Auto-restart on file change | `npm i -g nodemon`                                     |
| Vitest / Jest  | Testing                     | `npm i -D vitest`                                      |
| TypeScript     | Type safety                 | `npm i -g typescript`                                  |

---

## 📖 Further Reading

- **MDN Web Docs** — [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- **JavaScript.info** — [javascript.info](https://javascript.info) — best free tutorial
- **You Don't Know JS** — Kyle Simpson (free on GitHub)
- **Eloquent JavaScript** — Marijn Haverbeke (free online)
- **ECMAScript Spec** — [tc39.es/ecma262](https://tc39.es/ecma262)
- **TC39 Proposals** — [github.com/tc39/proposals](https://github.com/tc39/proposals)

---

_Happy coding! 🎉 — Built for the JavaScript Interview Roadmap series_
