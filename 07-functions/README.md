# 🧩 Section 7 — Functions

---

## Function Declaration (hoisted)
```js
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet("Alice"));  // works even before declaration (hoisted)
```

## Function Expression (not hoisted)
```js
const greet = function(name) {
  return `Hello, ${name}!`;
};
// greet("Bob") before this line → TypeError
```

## Arrow Functions (ES6)
```js
// Concise single expression (implicit return)
const add = (a, b) => a + b;
const square = x => x * x;      // single param: no parens needed
const sayHi = () => "hello";    // no params: () required

// Block body (needs explicit return)
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

// Return object literal (wrap in parentheses!)
const makeObj = (x) => ({ value: x });

// Arrow functions do NOT have their own `this`
// They inherit `this` from enclosing scope (lexical this)
```

## Parameters & Return Values
```js
function divide(a, b) {
  if (b === 0) return null;   // early return
  return a / b;
}

// Multiple return values (use object or array)
function minMax(arr) {
  return { min: Math.min(...arr), max: Math.max(...arr) };
}
const { min, max } = minMax([3,1,4,1,5,9]);
```

## Default Parameters (ES6)
```js
function greet(name = "World", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}
greet();              // "Hello, World!"
greet("Alice");       // "Hello, Alice!"
greet("Bob", "Hi");   // "Hi, Bob!"

// Default from another param
function createUser(name, role = "user", id = Date.now()) {
  return { name, role, id };
}
```

## Rest Parameters (ES6)
```js
function sum(...numbers) {            // collects all args into array
  return numbers.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4, 5);    // 15

function first(a, b, ...rest) {
  console.log(a, b, rest);
}
first(1, 2, 3, 4, 5);  // 1 2 [3,4,5]

// arguments object (old way, not in arrow functions)
function oldStyle() {
  console.log(arguments);   // array-like, not a real array
}
```

---
