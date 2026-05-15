# 🔗 Section 14 — Advanced JavaScript Concepts

---

## `this` Keyword
```js
// 1. Global context
console.log(this);   // window (browser) / {} (Node.js module)

// 2. Regular function — this = caller
const obj = {
  name: "Alice",
  greet() { return this.name; }   // this = obj
};

// 3. Arrow function — no own this, inherits from enclosing scope
const obj2 = {
  name: "Alice",
  greet: () => this.name,  // this = outer scope (NOT obj2!)
};

// 4. new — this = new object
function Person(name) { this.name = name; }

// 5. Explicit binding
function greet() { return this.name; }
greet.call({ name: "Bob" });        // call immediately with this
greet.apply({ name: "Carol" });     // same as call (args as array)
const bound = greet.bind({ name: "Dave" });  // returns new function
```

## Call / Apply / Bind
```js
function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const alice = { name: "Alice" };
introduce.call(alice, "Hello", "!");     // individual args
introduce.apply(alice, ["Hi", "?"]);    // args as array
const fn = introduce.bind(alice, "Hey"); // partial application
fn("...");                               // "Hey, I'm Alice..."
```

## Closures
```js
// A closure is a function that "remembers" its lexical scope
// even when executed outside of that scope.

function makeCounter(start = 0) {
  let count = start;   // enclosed variable
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount:  () => count,
    reset:     () => { count = start; }
  };
}
const counter = makeCounter(10);
counter.increment();  // 11
counter.increment();  // 12
counter.getCount();   // 12

// Closures for data privacy
function createWallet(initial) {
  let balance = initial;  // private — not accessible outside
  return {
    deposit: (amt) => balance += amt,
    withdraw: (amt) => { if (amt <= balance) balance -= amt; },
    getBalance: () => balance,
  };
}
```

## IIFE (Immediately Invoked Function Expression)
```js
// Execute immediately — creates a new scope (old module pattern)
(function() {
  const private = "not accessible outside";
  console.log("IIFE ran!");
})();

// Arrow function IIFE
(() => {
  console.log("Arrow IIFE");
})();

// With return value
const result = (function(a, b) {
  return a + b;
})(5, 3);  // 8

// Async IIFE
(async () => {
  const data = await fetch("...");
  // ...
})();
```

---
