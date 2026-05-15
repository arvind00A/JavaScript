# 🔂 Section 6 — Loops / Iterations

---

## for Loop
```js
for (let i = 0; i < 5; i++) {
  console.log(i);   // 0 1 2 3 4
}

// Iterate array by index
const arr = ["a", "b", "c"];
for (let i = 0; i < arr.length; i++) {
  console.log(i, arr[i]);
}

// Count down
for (let i = 10; i >= 0; i -= 2) {
  console.log(i);   // 10 8 6 4 2 0
}
```

## while Loop
```js
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}

// Read until condition
let input = getUserInput();
while (input !== "quit") {
  processInput(input);
  input = getUserInput();
}
```

## do...while (runs at least once)
```js
let n = 10;
do {
  console.log(n);   // runs once even though condition is false
  n++;
} while (n < 5);    // 10 — loop exits immediately after first run
```

## for...of (iterate values — arrays, strings, Maps, Sets)
```js
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}

// With index using entries()
for (const [i, fruit] of fruits.entries()) {
  console.log(i, fruit);
}

// Strings
for (const char of "hello") {
  console.log(char);  // h e l l o
}

// Map
const map = new Map([["a",1],["b",2]]);
for (const [key, val] of map) {
  console.log(key, val);
}
```

## for...in (iterate keys — objects)
```js
const person = { name: "Alice", age: 30, city: "NYC" };
for (const key in person) {
  console.log(key, ":", person[key]);
}

// ⚠️ for...in also iterates inherited properties
// Always check hasOwnProperty or use for...of Object.entries()
for (const [key, val] of Object.entries(person)) {
  console.log(key, val);  // safer
}
```

## break / continue
```js
// break — exit the loop
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);   // 0 1 2 3 4
}

// continue — skip to next iteration
for (let i = 0; i < 10; i++) {
  if (i % 2 === 0) continue;
  console.log(i);   // 1 3 5 7 9
}

// Labelled break (nested loops)
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) break outer;  // breaks outer loop
    console.log(i, j);
  }
}
```

---
