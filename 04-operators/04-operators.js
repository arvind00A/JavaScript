// ============================================================
// Section 4 — Operators
// Run: node 04-operators.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Arithmetic operators
console.log("=== E1: Arithmetic ===");
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.333...
console.log(10 % 3);   // 1
console.log(10 ** 3);  // 1000
let x = 5;
console.log(x++, x);   // 5, 6  (post-increment)
console.log(++x, x);   // 7, 7  (pre-increment)

// E2: Assignment operators
console.log("\n=== E2: Assignment ===");
let n = 10;
n += 5;  console.log("+=5 →", n);   // 15
n -= 3;  console.log("-=3 →", n);   // 12
n *= 2;  console.log("*=2 →", n);   // 24
n /= 4;  console.log("/=4 →", n);   // 6
n %= 4;  console.log("%=4 →", n);   // 2
n **= 3; console.log("**=3 →", n);  // 8

// Logical assignment (ES2021)
let a = null;
a ??= "default";  console.log("??=:", a);  // "default"
let b = 0;
b ||= 42;         console.log("||=:", b);  // 42
let c = 1;
c &&= 99;         console.log("&&=:", c);  // 99

// E3: Comparison operators
console.log("\n=== E3: Comparison ===");
console.log(5 > 3);        // true
console.log(5 < 3);        // false
console.log(5 >= 5);       // true
console.log(5 <= 4);       // false
console.log(5 == "5");     // true (coercion)
console.log(5 === "5");    // false (strict)
console.log(5 != "5");     // false
console.log(5 !== "5");    // true

// E4: Logical operators
console.log("\n=== E4: Logical ===");
console.log(true && false);  // false
console.log(true || false);  // true
console.log(!true);          // false
// Short-circuit
console.log(false && console.log("not printed"));  // false
console.log(true  || console.log("not printed"));  // true
// Nullish coalescing
console.log(null ?? "fallback");   // "fallback"
console.log(0    ?? "fallback");   // 0  (0 is not nullish!)
console.log(""   ?? "fallback");   // "" ("" is not nullish!)

// ── MODERATE ──────────────────────────────────────────────

// M1: Operator precedence demo
console.log("\n=== M1: Precedence ===");
console.log(2 + 3 * 4);      // 14 (not 20) — * before +
console.log((2 + 3) * 4);    // 20
console.log(2 ** 3 ** 2);    // 512 — ** is right-associative: 2**(3**2) = 2**9
console.log((2 ** 3) ** 2);  // 64
console.log(1 + "2" + 3);    // "123" — left to right
console.log(1 + 2 + "3");    // "33"  — 3 then concat "3"

// M2: Optional chaining & nullish coalescing
console.log("\n=== M2: Optional Chaining ===");
const user = {
  name: "Alice",
  address: { city: "NYC" },
  getAge: () => 30,
};
console.log(user?.name);                   // "Alice"
console.log(user?.phone?.number);          // undefined (no error)
console.log(user?.address?.city);          // "NYC"
console.log(user?.getAge?.());             // 30
console.log(user?.getPhone?.());           // undefined (no error)

const arr = [1, 2, 3];
console.log(arr?.[0]);   // 1
console.log(arr?.[99]);  // undefined

// Combine ?? with ?.
const config = null;
const port = config?.server?.port ?? 3000;
console.log("Port:", port);  // 3000

// M3: Bitwise operators (practical: check even/odd, flags)
console.log("\n=== M3: Bitwise ===");
console.log(5 & 1);   // 1 (5=101, 1=001, AND=001) → odd check!
console.log(4 & 1);   // 0 → even
const isOdd = n => (n & 1) === 1;
[0,1,2,3,4,5].forEach(n => console.log(`${n} is ${isOdd(n) ? "odd" : "even"}`));

// Flags with bitwise OR
const READ  = 0b001;
const WRITE = 0b010;
const EXEC  = 0b100;
const perms = READ | WRITE;
console.log("Can read?",  (perms & READ)  !== 0);  // true
console.log("Can write?", (perms & WRITE) !== 0);  // true
console.log("Can exec?",  (perms & EXEC)  !== 0);  // false

// M4: typeof and instanceof
console.log("\n=== M4: typeof / instanceof ===");
console.log(typeof 42);            // number
console.log(typeof "hello");       // string
console.log(typeof null);          // object ← bug!
console.log(typeof undefined);     // undefined
console.log(typeof []);            // object
console.log(typeof {});            // object
console.log(typeof function(){});  // function
console.log([] instanceof Array);  // true
console.log({} instanceof Object); // true
console.log([] instanceof Object); // true (Array extends Object)

// ── HARD ──────────────────────────────────────────────────

// H1: Build expression evaluator using operators
console.log("\n=== H1: Expression Evaluator ===");
function evaluate(a, op, b) {
  const ops = {
    "+":  (x,y) => x + y,
    "-":  (x,y) => x - y,
    "*":  (x,y) => x * y,
    "/":  (x,y) => y !== 0 ? x / y : "Error: division by zero",
    "%":  (x,y) => x % y,
    "**": (x,y) => x ** y,
    ">":  (x,y) => x > y,
    "<":  (x,y) => x < y,
    "===": (x,y) => x === y,
    "!==": (x,y) => x !== y,
    "&&": (x,y) => x && y,
    "||": (x,y) => x || y,
    "??": (x,y) => x ?? y,
  };
  if (!ops[op]) throw new Error(`Unknown operator: ${op}`);
  return ops[op](a, b);
}

const tests = [
  [10, "+", 5],  [10, "-", 3],  [4, "**", 3],
  [10, "/", 0],  [null, "??", "default"], [0, "||", 42],
];
for (const [a, op, b] of tests) {
  console.log(`${JSON.stringify(a)} ${op} ${JSON.stringify(b)} = ${JSON.stringify(evaluate(a, op, b))}`);
}

// H2: Precedence table verification
console.log("\n=== H2: Precedence Verification ===");
const expressions = [
  { expr: "2 + 3 * 4",       result: 2 + 3 * 4,       expected: 14 },
  { expr: "10 - 2 - 3",      result: 10 - 2 - 3,      expected: 5  },
  { expr: "2 ** 2 ** 3",     result: 2 ** (2 ** 3),   expected: 256 },
  { expr: "true || false && false", result: true || (false && false), expected: true },
  { expr: "null ?? 0 || 1",  result: (null ?? 0) || 1, expected: 1 },
];
for (const t of expressions) {
  const ok = t.result === t.expected;
  console.log(`${ok ? "✅" : "❌"} ${t.expr} = ${t.result} (expected ${t.expected})`);
}

// H3: Calculator with operator history
console.log("\n=== H3: Calculator with History ===");
class Calculator {
  #value;
  #history = [];

  constructor(initial = 0) { this.#value = initial; }

  #op(operator, operand, fn) {
    const prev = this.#value;
    this.#value = fn(this.#value, operand);
    this.#history.push(`${prev} ${operator} ${operand} = ${this.#value}`);
    return this;
  }

  add(n)      { return this.#op("+",  n, (a,b) => a + b); }
  subtract(n) { return this.#op("-",  n, (a,b) => a - b); }
  multiply(n) { return this.#op("×",  n, (a,b) => a * b); }
  divide(n)   {
    if (n === 0) throw new Error("Cannot divide by zero");
    return this.#op("÷", n, (a,b) => a / b);
  }
  power(n)    { return this.#op("^",  n, (a,b) => a ** b); }
  mod(n)      { return this.#op("%",  n, (a,b) => a % b); }

  result()  { return this.#value; }
  history() { return [...this.#history]; }
  reset()   { this.#value = 0; return this; }
}

const calc = new Calculator(10);
calc.add(5).multiply(3).subtract(7).divide(4).power(2);
console.log("Result:", calc.result());
console.log("History:");
calc.history().forEach(h => console.log(" ", h));
