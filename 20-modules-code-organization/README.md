# 🧩 Section 20 — Modules & Code Organization

---

## ES Modules (ESM)
```js
// math.js
export const add = (a, b) => a + b;
export const sub = (a, b) => a - b;
export default { add, sub };

// main.js
import calc, { add, sub } from "./math.js";

// Use in Node.js:
// package.json: { "type": "module" }
// OR use .mjs extension
```

## File Structure Best Practices
```
project/
├── src/
│   ├── index.js          (entry point)
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── services/
│   │   └── api.js
│   └── models/
│       └── User.js
├── tests/
├── package.json
└── README.md
```

## CommonJS (Node.js default)
```js
// Export
module.exports = { add, sub };
module.exports.greet = function() { ... };
exports.name = "value";   // shorthand

// Import
const { add, sub } = require("./math");
const fs = require("fs");        // built-in
const _ = require("lodash");     // npm package
```

## Reusable Code Patterns
```js
// Utility module
// utils/validators.js
export const isEmail    = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const isPhone    = (s) => /^\d{10}$/.test(s);
export const isEmpty    = (v) => v === null || v === undefined || v === "";
export const clamp      = (n, min, max) => Math.min(Math.max(n, min), max);

// Barrel file (index.js in folder — re-export for clean imports)
export { isEmail, isPhone } from "./validators.js";
export { formatDate }      from "./formatters.js";
// Usage: import { isEmail, formatDate } from "./utils";
```

---
