# 🔰 Section 1 — Introduction & Setup

---

## What is JavaScript?

JavaScript is a **lightweight, interpreted, single-threaded** programming language primarily used to make web pages interactive. It is the only language that runs natively in browsers.

- Originally created by Brendan Eich in 1995 (in 10 days) for Netscape
- Standardised as **ECMAScript (ES)**; latest is ES2024
- Runs in **browser** (client-side) and **server** (Node.js)
- Dynamically typed — variable types are resolved at runtime
- Multi-paradigm: procedural, object-oriented, functional

---

## How JavaScript Works

### In the Browser
```
HTML parsed → <script> tag found → JS engine executes code
```
- **JS Engine** (e.g. V8 in Chrome, SpiderMonkey in Firefox) compiles JS to machine code
- Browser provides global objects: `window`, `document`, `navigator`

### In Node.js
```
node filename.js → V8 engine runs it → OS-level APIs available
```
- Node.js provides: `fs`, `http`, `path`, `os` modules
- No `window` or `document` — uses `global` instead
- Used for backend servers, CLI tools, scripts

### Execution Flow
```
Source Code → Parser → AST (Abstract Syntax Tree) → Interpreter/JIT Compiler → Machine Code
```

---

## Setting Up the Environment

### Required Tools
| Tool | Purpose | Download |
|---|---|---|
| **Node.js** (LTS) | Run JS outside browser | nodejs.org |
| **VS Code** | Code editor | code.visualstudio.com |
| **Browser** | Chrome/Firefox DevTools | Built-in |

### VS Code Extensions (Recommended)
- **ESLint** — code quality linting
- **Prettier** — auto-formatting
- **JavaScript (ES6+) snippets** — quick boilerplate
- **Live Server** — hot-reload for HTML/JS
- **Quokka.js** — live JS output in editor

### Verify Node.js Installation
```bash
node --version       # e.g. v20.11.0
npm --version        # e.g. 10.2.4
node -e "console.log('Hello JS')"   # quick test
```

---

## Writing Your First JS Program

### In Browser (index.html)
```html
<!DOCTYPE html>
<html>
<head><title>First JS</title></head>
<body>
  <script>
    console.log("Hello, Browser!");
    alert("JS is working!");
  </script>
</body>
</html>
```

### External JS File
```html
<!-- index.html -->
<script src="app.js"></script>
```
```js
// app.js
console.log("Hello from external file!");
```

### In Node.js (Terminal)
```js
// hello.js
console.log("Hello, Node.js!");
```
```bash
node hello.js   # → Hello, Node.js!
```

### Script Tag Placement
```html
<!-- ❌ Bad: blocks HTML parsing -->
<head><script src="app.js"></script></head>

<!-- ✅ Good: HTML loads first, then JS -->
<body>
  <!-- content -->
  <script src="app.js"></script>
</body>

<!-- ✅ Better: async/defer attributes -->
<head>
  <script src="app.js" defer></script>   <!-- runs after HTML parsed -->
  <script src="app.js" async></script>   <!-- runs as soon as downloaded -->
</head>
```

---

## Console & Debugging Basics

### console Methods
```js
console.log("Standard output");          // most used
console.warn("This is a warning ⚠️");    // yellow in browser
console.error("This is an error ❌");    // red, shows stack trace
console.info("Informational 💡");
console.table([{name:"Alice",age:30},{name:"Bob",age:25}]); // table view
console.group("Group");                  // collapsible group
  console.log("inside group");
console.groupEnd();
console.time("timer");                   // start timer
  // ... code ...
console.timeEnd("timer");               // stop timer, logs ms
console.clear();                         // clear console
```

### Debugging in VS Code
1. Set a **breakpoint** by clicking left of a line number
2. Press `F5` → select **Node.js** environment
3. Step through code: `F10` (step over), `F11` (step into), `Shift+F11` (step out)

### Debugging in Browser (DevTools)
- Open with `F12` or `Ctrl+Shift+I`
- **Console tab** — run JS, see errors
- **Sources tab** — set breakpoints, step through code
- **Network tab** — inspect API calls

### Common Debugging Techniques
```js
// Temporary debugging — remove before production
debugger;   // pauses execution when DevTools is open

// Type check
console.log(typeof someVar);

// Object inspection
console.dir(document.body);

// Stringify objects for logging
console.log(JSON.stringify(obj, null, 2));
```

---

## Quick Reference

| Concept | Detail |
|---|---|
| Language type | Interpreted, JIT-compiled |
| Typing | Dynamic (types checked at runtime) |
| Paradigm | Multi-paradigm (OOP, functional, procedural) |
| Standard | ECMAScript (ECMA-262) |
| Browser engine | V8 (Chrome/Node), SpiderMonkey (Firefox) |
| File extension | `.js`, `.mjs` (ES modules), `.cjs` (CommonJS) |
| Entry keyword | `<script>` in HTML, `node file.js` in terminal |
| Case sensitive | ✅ Yes — `myVar` ≠ `MyVar` |
| Semicolons | Optional (ASI handles it) but recommended |
| Comments | `// single line` · `/* multi line */` |
