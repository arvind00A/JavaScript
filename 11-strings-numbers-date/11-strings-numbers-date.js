// ============================================================
// Section 11 — Strings, Numbers & Date
// Run: node 11-strings-numbers-date.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: String methods
console.log("=== E1: String Methods ===");
const s = "  Hello, World!  ";
console.log(s.trim());                      // "Hello, World!"
console.log(s.trim().toUpperCase());        // "HELLO, WORLD!"
console.log(s.trim().toLowerCase());        // "hello, world!"
console.log(s.trim().includes("World"));    // true
console.log(s.trim().startsWith("Hello"));  // true
console.log(s.trim().endsWith("!"));        // true
console.log(s.trim().replace("World","JS")); // "Hello, JS!"
console.log(s.trim().split(", "));          // ["Hello","World!"]
console.log("abc".repeat(3));               // "abcabcabc"
console.log("5".padStart(4,"0"));           // "0005"
console.log("Hi".padEnd(8,"-."));           // "Hi-.-.-."
console.log("Hello".slice(1, 4));           // "ell"
console.log("Hello".at(-1));               // "o"
console.log("  hello  ".trimStart());       // "hello  "

// E2: Template literals
console.log("\n=== E2: Template Literals ===");
const name = "Alice", age = 30;
console.log(`Name: ${name}, Age: ${age}`);
console.log(`Next year: ${age + 1}`);
console.log(`Is adult: ${age >= 18 ? "yes" : "no"}`);

// Multi-line
const html = `
<div class="card">
  <h2>${name}</h2>
  <p>Age: ${age}</p>
</div>`.trim();
console.log(html);

// Tagged template
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) =>
    result + str + (values[i] !== undefined ? `[${values[i]}]` : ""), "");
}
console.log(highlight`Hello ${name}, you are ${age} years old!`);

// E3: Number methods
console.log("\n=== E3: Number Methods ===");
console.log((3.14159).toFixed(2));          // "3.14"
console.log((1234567).toLocaleString());    // "1,234,567"
console.log(Number.isInteger(42));          // true
console.log(Number.isInteger(42.5));        // false
console.log(Number.isFinite(1/0));          // false
console.log(Number.isNaN(NaN));             // true
console.log(Number.parseInt("42px"));       // 42
console.log(Number.parseFloat("3.14abc"));  // 3.14
console.log((255).toString(16));            // "ff"  hex
console.log((8).toString(2));               // "1000" binary
console.log(Number.MAX_SAFE_INTEGER);       // 9007199254740991

// E4: Math methods
console.log("\n=== E4: Math ===");
console.log(Math.round(4.5));    // 5
console.log(Math.floor(4.9));    // 4
console.log(Math.ceil(4.1));     // 5
console.log(Math.trunc(-4.9));   // -4
console.log(Math.abs(-42));      // 42
console.log(Math.max(3,1,4,1,5,9)); // 9
console.log(Math.min(3,1,4,1,5,9)); // 1
console.log(Math.pow(2, 10));    // 1024
console.log(Math.sqrt(144));     // 12
console.log(Math.log2(1024));    // 10
const rand = Math.floor(Math.random() * 100) + 1;  // 1-100
console.log("Random 1-100:", rand);

// ── MODERATE ──────────────────────────────────────────────

// M1: String parsing and transformation
console.log("\n=== M1: String Transformations ===");
function titleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase());
}
function camelToKebab(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}
function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}
function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}
function truncate(str, max, suffix = "...") {
  return str.length <= max ? str : str.slice(0, max - suffix.length) + suffix;
}

console.log(titleCase("hello world from javascript"));
console.log(camelToKebab("backgroundColor"));    // "background-color"
console.log(kebabToCamel("background-color"));   // "backgroundColor"
console.log(countWords("  Hello   World  JS  ")); // 3
console.log(truncate("This is a very long string", 15));  // "This is a ve..."

// M2: Number formatting
console.log("\n=== M2: Number Formatting ===");
function formatCurrency(amount, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, { style:"currency", currency }).format(amount);
}
function formatPercent(value, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`;
}
function formatBytes(bytes) {
  const units = ["B","KB","MB","GB","TB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return `${bytes.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
function clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

console.log(formatCurrency(1234567.89));           // $1,234,567.89
console.log(formatCurrency(99.99, "GBP", "en-GB")); // £99.99
console.log(formatPercent(0.756));                  // 75.6%
console.log(formatBytes(1536));                     // 1.5 KB
console.log(formatBytes(2097152));                  // 2.0 MB
console.log(clamp(150, 0, 100));                    // 100
console.log(clamp(-5, 0, 100));                     // 0

// M3: Date operations
console.log("\n=== M3: Date Operations ===");
const now = new Date();
console.log("Now:", now.toISOString());
console.log("Date:", now.toLocaleDateString());
console.log("Time:", now.toLocaleTimeString());

function formatDate(date, format = "YYYY-MM-DD") {
  const d = new Date(date);
  const pad = n => String(n).padStart(2,"0");
  return format
    .replace("YYYY", d.getFullYear())
    .replace("MM",   pad(d.getMonth() + 1))
    .replace("DD",   pad(d.getDate()))
    .replace("HH",   pad(d.getHours()))
    .replace("mm",   pad(d.getMinutes()))
    .replace("ss",   pad(d.getSeconds()));
}
function daysBetween(d1, d2) {
  const ms = Math.abs(new Date(d2) - new Date(d1));
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function isWeekend(date) {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

console.log(formatDate(now));
console.log(formatDate(now, "DD/MM/YYYY HH:mm"));
console.log("Days since 2024-01-01:", daysBetween("2024-01-01", now));
console.log("30 days from now:", formatDate(addDays(now, 30)));
console.log("Is weekend:", isWeekend(now));

// ── HARD ──────────────────────────────────────────────────

// H1: String template engine
console.log("\n=== H1: Template Engine ===");
function renderTemplate(template, data) {
  // Replace {{variable}} and {{#if cond}}...{{/if}} blocks
  // First: handle conditionals
  let result = template.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (_, key, content) => data[key] ? content : "");
  // Then: handle each blocks
  result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (_, key, content) => {
      const arr = data[key];
      if (!Array.isArray(arr)) return "";
      return arr.map(item =>
        typeof item === "object"
          ? content.replace(/\{\{(\w+)\}\}/g, (_, k) => item[k] ?? "")
          : content.replace(/\{\{this\}\}/g, item)
      ).join("");
    });
  // Finally: replace simple variables
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? "");
  return result;
}

const tmpl = `
Hello, {{name}}!
{{#if isPremium}}You are a premium member.{{/if}}
Your items:
{{#each items}}- {{name}}: ${{price}}
{{/each}}Total: {{total}}`.trim();

const ctx = {
  name: "Alice",
  isPremium: true,
  items: [
    { name: "Book", price: "29.99" },
    { name: "Pen",  price: "4.99"  },
  ],
  total: "$34.98",
};

console.log(renderTemplate(tmpl, ctx));

// H2: Advanced number utilities
console.log("\n=== H2: Number Utilities ===");
const NumUtils = {
  // Precise decimal arithmetic (avoid floating point errors)
  addDecimals(a, b, precision = 10) {
    const factor = 10 ** precision;
    return (Math.round(a * factor) + Math.round(b * factor)) / factor;
  },
  // Roman numeral converter
  toRoman(num) {
    const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
    const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
    let result = "";
    for (let i = 0; i < vals.length; i++) {
      while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
    }
    return result;
  },
  // Fibonacci sequence (generator)
  *fibonacci() {
    let [a, b] = [0, 1];
    while (true) { yield a; [a, b] = [b, a + b]; }
  },
  // Prime check
  isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2)
      if (n % i === 0) return false;
    return true;
  },
  // Range of primes
  primesUpTo(n) {
    const sieve = new Array(n + 1).fill(true);
    sieve[0] = sieve[1] = false;
    for (let i = 2; i * i <= n; i++)
      if (sieve[i]) for (let j = i*i; j <= n; j += i) sieve[j] = false;
    return sieve.map((p,i) => p ? i : 0).filter(Boolean);
  }
};

console.log("0.1 + 0.2 =", 0.1 + 0.2);              // 0.30000000000000004 ← bug!
console.log("fixed:", NumUtils.addDecimals(0.1, 0.2)); // 0.3

[1,4,9,14,40,1994,2024].forEach(n => console.log(`${n} = ${NumUtils.toRoman(n)}`));

const fib = NumUtils.fibonacci();
const first10fib = Array.from({length:10}, () => fib.next().value);
console.log("First 10 Fibonacci:", first10fib);

console.log("Primes up to 50:", NumUtils.primesUpTo(50));
