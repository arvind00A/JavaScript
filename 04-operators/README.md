# ➕ Section 4 — Operators

---

## Arithmetic Operators
```js
5 + 3    // 8   addition (also string concat when string involved)
5 - 3    // 2   subtraction
5 * 3    // 15  multiplication
5 / 2    // 2.5 division (not integer division!)
5 % 2    // 1   modulo (remainder)
5 ** 2   // 25  exponentiation (ES2016)
-5       // -5  unary negation

// Increment / Decrement
let x = 5;
x++   // post-increment: returns 5, then x becomes 6
++x   // pre-increment:  x becomes 7, returns 7
x--   // post-decrement: returns 7, then x becomes 6
--x   // pre-decrement:  x becomes 5, returns 5
```

## Assignment Operators
```js
x = 5       // assign
x += 3      // x = x + 3   → 8
x -= 2      // x = x - 2   → 6
x *= 4      // x = x * 4   → 24
x /= 3      // x = x / 3   → 8
x %= 3      // x = x % 3   → 2
x **= 2     // x = x ** 2  → 4
x &&= 10    // x = x && 10 → if x is truthy, assign 10
x ||= 20    // x = x || 20 → if x is falsy, assign 20
x ??= 30    // x = x ?? 30 → if x is null/undefined, assign 30
```

## Comparison Operators
```js
5 >  3      // true   greater than
5 <  3      // false  less than
5 >= 5      // true   greater than or equal
5 <= 4      // false  less than or equal
5 == "5"    // true   loose equality (coerces)
5 === "5"   // false  strict equality (no coercion)
5 != "5"    // false  loose inequality
5 !== "5"   // true   strict inequality
```

## Logical Operators
```js
true && false   // false  AND
true || false   // true   OR
!true           // false  NOT

// Short-circuit evaluation
false && expensiveFn()  // fn NOT called (false && anything = false)
true  || expensiveFn()  // fn NOT called (true || anything = true)

// Practical patterns
const val = input || "default"    // fallback value
const user = isLoggedIn && getUser()  // conditional call

// Nullish coalescing ?? (ES2020) — only falsy on null/undefined
null ?? "default"      // "default"
undefined ?? "default" // "default"
0 ?? "default"         // 0   ← 0 is NOT nullish!
"" ?? "default"        // ""  ← "" is NOT nullish!

// Optional chaining ?. (ES2020)
const street = user?.address?.street   // undefined instead of error
const first  = arr?.[0]               // safe array access
const result = obj?.method?.()         // safe method call
```

## Bitwise Operators
```js
5 & 3     // 1   AND  (0101 & 0011 = 0001)
5 | 3     // 7   OR   (0101 | 0011 = 0111)
5 ^ 3     // 6   XOR  (0101 ^ 0011 = 0110)
~5        // -6  NOT  (inverts bits + 1 for sign)
5 << 1    // 10  left shift  (5 * 2)
5 >> 1    // 2   right shift (5 / 2, floor)
5 >>> 1   // 2   unsigned right shift
```

## Other Operators
```js
// Ternary (conditional)
const result = condition ? "yes" : "no";

// Comma operator (evaluates both, returns last)
const y = (1, 2, 3);   // y = 3

// typeof
typeof "hello"   // "string"

// instanceof
[] instanceof Array   // true
{} instanceof Object  // true

// void
void 0   // undefined
void expression   // discards return value

// delete
const obj = {a:1, b:2};
delete obj.a;   // removes property
```

---
