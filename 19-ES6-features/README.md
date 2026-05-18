# ⚙️ Section 19 — ES6+ Features

---

## Arrow Functions (see Section 7)

## Template Literals (see Section 11)

## Destructuring (see Section 10)

## Spread / Rest (see Section 10)

## Modules (import / export)
```js
// Named exports
export const PI = 3.14;
export function add(a, b) { return a + b; }
export class Calc { ... }

// Default export
export default function main() { ... }

// Named import
import { PI, add } from "./math.js";
import { add as addition } from "./math.js";   // alias

// Default import
import main from "./main.js";

// Import all
import * as math from "./math.js";
math.PI; math.add(1,2);

// Dynamic import (lazy loading)
const module = await import("./heavy.js");
module.default();
```

## Other ES6+ Highlights
```js
// Map (ordered key-value, any key type)
const map = new Map();
map.set("name", "Alice");
map.set(42, "the answer");
map.get("name");   // "Alice"
map.has(42);       // true
map.size;          // 2

// Set (unique values)
const set = new Set([1, 2, 2, 3, 3]);
set.size;          // 3 — duplicates removed
set.add(4);
set.has(2);        // true
[...set];          // [1,2,3,4]

// for...of with Map/Set
for (const [k, v] of map) { ... }
for (const val of set)    { ... }

// WeakMap / WeakRef (garbage-collection friendly)
// Generators
function* gen() { yield 1; yield 2; yield 3; }
const g = gen();
g.next();   // {value:1, done:false}

// Proxy & Reflect (meta-programming)
const handler = {
  get: (target, key) => key in target ? target[key] : "default"
};
const proxy = new Proxy({}, handler);
```

---
