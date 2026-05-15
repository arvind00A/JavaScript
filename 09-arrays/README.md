# 🧱 Section 9 — Arrays

---

## Creating Arrays
```js
const arr1 = [1, 2, 3];                    // literal
const arr2 = new Array(3);                  // [undefined x 3]
const arr3 = new Array(1, 2, 3);            // [1, 2, 3]
const arr4 = Array.from("hello");           // ['h','e','l','l','o']
const arr5 = Array.from({length:5}, (_,i) => i); // [0,1,2,3,4]
const arr6 = Array.of(1, 2, 3);            // [1, 2, 3]
const arr7 = [...arr1, ...arr2];            // spread to combine
```

## Core Methods
```js
const arr = [1, 2, 3, 4, 5];

// Mutating methods
arr.push(6);         // add to end     → [1,2,3,4,5,6]
arr.pop();           // remove from end → [1,2,3,4,5]
arr.unshift(0);      // add to start   → [0,1,2,3,4,5]
arr.shift();         // remove from start → [1,2,3,4,5]
arr.splice(1,2);     // remove 2 from index 1 → [1,4,5]
arr.sort();          // sort in place (lexicographic by default!)
arr.sort((a,b)=>a-b); // numeric sort ascending
arr.reverse();       // reverse in place

// Non-mutating (return new array/value)
arr.slice(1,3);          // [2,3] — copy portion
arr.concat([6,7]);       // [1,2,3,4,5,6,7]
arr.indexOf(3);          // 2
arr.includes(3);         // true
arr.find(x => x > 3);   // 4 — first match
arr.findIndex(x => x>3); // 3 — index of first match
arr.flat();              // [[1,[2]],3].flat() → [1,2,3]
arr.flatMap(x=>[x,x*2]); // map + flat
arr.join(" - ");         // "1 - 2 - 3 - 4 - 5"
```

## map / filter / reduce
```js
const nums = [1, 2, 3, 4, 5];

// map — transform each element, return new array
const doubled = nums.map(n => n * 2);         // [2,4,6,8,10]
const strings = nums.map(n => `#${n}`);       // ["#1","#2",...]

// filter — keep elements that pass test
const evens  = nums.filter(n => n % 2 === 0); // [2,4]
const odds   = nums.filter(n => n % 2 !== 0); // [1,3,5]

// reduce — accumulate to single value
const sum    = nums.reduce((acc, n) => acc + n, 0);       // 15
const max    = nums.reduce((acc, n) => n > acc ? n : acc, -Infinity);

// Chaining
const result = nums
  .filter(n => n % 2 === 0)     // [2,4]
  .map(n => n * 10)              // [20,40]
  .reduce((acc, n) => acc + n);  // 60
```

## Iteration Methods
```js
nums.forEach((n, i) => console.log(i, n));  // no return value
nums.every(n => n > 0);   // true — all match
nums.some(n => n > 4);    // true — at least one matches
```

---
