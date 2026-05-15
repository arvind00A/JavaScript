# 📚 Section 11 — Strings, Numbers & Date

---

## String Methods
```js
const s = "Hello, World!";
s.length               // 13
s.toUpperCase()        // "HELLO, WORLD!"
s.toLowerCase()        // "hello, world!"
s.trim()               // removes whitespace from both ends
s.trimStart()          // removes leading whitespace
s.trimEnd()            // removes trailing whitespace
s.includes("World")    // true
s.startsWith("Hello")  // true
s.endsWith("!")        // true
s.indexOf("o")         // 4 — first occurrence
s.lastIndexOf("o")     // 8 — last occurrence
s.slice(7, 12)         // "World"
s.slice(-6)            // "orld!" — negative = from end
s.substring(7, 12)     // "World" — no negatives
s.replace("World", "JS")       // "Hello, JS!"
s.replaceAll("l", "L")         // replaces all occurrences
s.split(", ")          // ["Hello", "World!"]
s.padStart(15, "*")    // "**Hello, World!"
s.padEnd(15, ".")      // "Hello, World!.."
s.repeat(2)            // "Hello, World!Hello, World!"
s.charAt(0)            // "H"
s.charCodeAt(0)        // 72
String.fromCharCode(72) // "H"
s.at(-1)               // "!" — negative indexing (ES2022)
```

## Template Literals
```js
const name = "Alice";
const age  = 30;
`Hello, ${name}! You are ${age} years old.`
`1 + 1 = ${1 + 1}`                // expressions allowed
`Line 1\nLine 2`                   // multi-line
const html = `
  <div>
    <h1>${name}</h1>
  </div>
`;
// Tagged templates
const tagged = String.raw`C:\Users\${name}`;  // raw (no escape processing)
```

## Number & Math Methods
```js
Number.isInteger(42)        // true
Number.isFinite(Infinity)   // false
Number.isNaN(NaN)           // true
Number.parseInt("42.5")     // 42
Number.parseFloat("42.5")   // 42.5
(3.14159).toFixed(2)        // "3.14"
(1234.5).toLocaleString()   // "1,234.5"

Math.round(4.5)   // 5
Math.floor(4.9)   // 4
Math.ceil(4.1)    // 5
Math.trunc(4.9)   // 4 (removes decimal, no rounding)
Math.abs(-5)      // 5
Math.max(1,2,3)   // 3
Math.min(1,2,3)   // 1
Math.pow(2, 8)    // 256
Math.sqrt(16)     // 4
Math.cbrt(27)     // 3
Math.PI           // 3.141592653589793
Math.random()     // 0 to <1 random float
Math.log(Math.E)  // 1
Math.log2(8)      // 3
```

## Date Object
```js
const now   = new Date();                    // current
const d     = new Date("2024-01-15");        // from string
const d2    = new Date(2024, 0, 15);         // year, month(0-based), day
const stamp = Date.now();                    // timestamp ms

now.getFullYear()    // 2024
now.getMonth()       // 0-11 (add 1 for human!)
now.getDate()        // 1-31
now.getDay()         // 0-6 (0=Sunday)
now.getHours()       // 0-23
now.getMinutes()     // 0-59
now.getSeconds()     // 0-59
now.getTime()        // timestamp ms
now.toISOString()    // "2024-01-15T10:30:00.000Z"
now.toLocaleDateString()  // locale-specific date string

// Date arithmetic
const tomorrow = new Date(now.getTime() + 86400000); // + 1 day in ms
```

---
