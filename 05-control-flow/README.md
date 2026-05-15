# 🔁 Section 5 — Control Flow

---

## if / else / else if
```js
const score = 75;

if (score >= 90) {
  console.log("A grade");
} else if (score >= 80) {
  console.log("B grade");
} else if (score >= 70) {
  console.log("C grade");
} else {
  console.log("Below C");
}

// Single-line (no braces — avoid for readability)
if (x > 0) console.log("positive");

// Nested if
if (isLoggedIn) {
  if (isAdmin) {
    console.log("Admin panel");
  } else {
    console.log("User dashboard");
  }
}
```

## switch Statement
```js
const day = "Monday";

switch (day) {
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend");
    break;
  default:
    console.log("Invalid day");
}

// switch uses === (strict equality)
switch (true) {  // expression switch pattern
  case score >= 90: console.log("A"); break;
  case score >= 80: console.log("B"); break;
  default: console.log("C or below");
}
```

## Ternary Operator
```js
// condition ? valueIfTrue : valueIfFalse
const age = 20;
const status = age >= 18 ? "adult" : "minor";

// Nested ternary (use sparingly — hurts readability)
const grade = score >= 90 ? "A"
            : score >= 80 ? "B"
            : score >= 70 ? "C"
            : "F";

// Inline with assignment
const msg = isError ? `Error: ${errMsg}` : "Success";
```

---
