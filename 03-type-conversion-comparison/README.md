# 🔄 Section 3 — Type Conversion & Comparison

---

## Type Casting (Explicit Conversion)

### To String
```js
String(42)          // "42"
String(true)        // "true"
String(null)        // "null"
String(undefined)   // "undefined"
String([1,2,3])     // "1,2,3"
(42).toString()     // "42"
(255).toString(16)  // "ff"  (base 16)
(8).toString(2)     // "1000" (base 2 — binary)
```

### To Number
```js
Number("42")        // 42
Number("")          // 0
Number("  ")        // 0
Number("abc")       // NaN
Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN
Number([])          // 0
Number([1])         // 1
Number([1,2])       // NaN

parseInt("42.9px")  // 42   — stops at non-digit
parseFloat("3.14abc") // 3.14
parseInt("0xFF", 16) // 255 — parse hex
parseInt("1010", 2)  // 10  — parse binary
+"42"               // 42  — unary + shorthand
+"abc"              // NaN
```

### To Boolean
```js
Boolean(0)          // false
Boolean("")         // false
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false
Boolean(false)      // false
// Everything else is truthy:
Boolean(1)          // true
Boolean("hello")    // true
Boolean({})         // true  ← empty object IS truthy!
Boolean([])         // true  ← empty array IS truthy!
!!value             // double bang — quick cast to boolean
```

---

## Truthy & Falsy Values

### The 6 Falsy Values (memorise these!)
```js
false       // boolean false
0           // zero (and -0, 0n)
""          // empty string (and '' and ``)
null        // null
undefined   // undefined
NaN         // Not a Number
```

### Everything else is Truthy
```js
// Common truthy surprises:
!!{}         // true  ← empty object
!![]         // true  ← empty array
!!" "        // true  ← space string
!!"0"        // true  ← string "0" (not number 0!)
!!-1         // true  ← negative number
```

### Practical Usage
```js
// Guard clauses using truthy/falsy
const name = userInput || "Anonymous";   // fallback
const count = data?.items?.length ?? 0;  // nullish fallback

if (name) {                 // truthy check
  console.log("Has name");
}
```

---

## Comparison Operators: `==` vs `===`

### `==` (Abstract / Loose Equality) — performs type coercion
```js
1  == "1"        // true  — string coerced to number
1  == true       // true  — true coerced to 1
0  == false      // true  — false coerced to 0
0  == ""         // true  — both coerce to 0
0  == null       // false — special case!
null == undefined // true — only these two are == to each other
null == false    // false
[] == false      // true  — [] → "" → 0, false → 0
[] == ![]        // true  — famous JS gotcha!
```

### `===` (Strict Equality) — no type coercion
```js
1  === "1"       // false — different types
1  === 1         // true
null === null    // true
null === undefined // false — different types
NaN === NaN      // false — NaN is never equal to anything!
```

### Always use `===` in practice!
```js
// ❌ Dangerous
if (x == null)   { ... }   // matches both null AND undefined

// ✅ Clear intent
if (x === null)      { ... }   // only null
if (x === undefined) { ... }   // only undefined
if (x == null)  { ... }   // acceptable shorthand for "null OR undefined"
```

---

## Confusing Cases in JS

```js
// Arithmetic surprises
"5" + 3         // "53"  — + does concatenation when string involved
"5" - 3         // 2     — - only works numerically, coerces "5"→5
"5" * "2"       // 10    — numeric coercion
true + true     // 2     — true→1, 1+1=2
{} + []         // 0     (as expression, {} is empty block; +[] → 0)
[] + {}         // "[object Object]"
[] + []         // ""

// Comparison surprises
"11" > "9"      // false — string comparison (lexicographic)!
"11" > 9        // true  — numeric comparison (string coerced)
null > 0        // false
null == 0       // false
null >= 0       // true  ← !!

// typeof quirks
typeof null     // "object" — historical JS bug
typeof []       // "object" — use Array.isArray()
typeof NaN      // "number" — NaN is of type number!

// Equality quirks
NaN == NaN     // false — only NaN !== NaN in JS
NaN === NaN    // false

// Parsing
parseInt(0.5)  // 0
parseInt(0.000005)   // 5 — "5e-6" → parseInt stops at 'e'!
parseFloat("Infinity") // Infinity
```

---

## Type Coercion Rules Summary

```
Operator + (one operand is string) → string concatenation
Operator - * / %                   → numeric coercion
Comparison < > <= >=              → numeric (unless both strings)
== abstract equality              → complex coercion table
=== strict equality               → no coercion
if/while/ternary                  → boolean coercion
```

---

## Quick Reference

| Expression | Result | Why |
|---|---|---|
| `"5" + 3` | `"53"` | String concatenation |
| `"5" - 3` | `2` | Numeric coercion |
| `true + 1` | `2` | true → 1 |
| `null + 1` | `1` | null → 0 |
| `undefined + 1` | `NaN` | undefined → NaN |
| `[] + []` | `""` | Both → "" |
| `[] + {}` | `"[object Object]"` | [] → "", {} → "[object Object]" |
| `null == undefined` | `true` | Special case |
| `null === undefined` | `false` | Different types |
| `NaN == NaN` | `false` | NaN is unique |
