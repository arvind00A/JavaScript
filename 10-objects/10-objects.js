// ============================================================
// Section 10 — Objects
// Run: node 10-objects.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Object creation and access
console.log("=== E1: Object Basics ===");
const person = {
  firstName: "Alice",
  lastName: "Sharma",
  age: 30,
  address: { city: "NYC", zip: "10001" },
  hobbies: ["reading", "coding"],
  greet() { return `Hi, I'm ${this.firstName} ${this.lastName}`; },
};
console.log(person.firstName);          // dot notation
console.log(person["lastName"]);        // bracket notation
console.log(person.address.city);       // nested access
console.log(person.greet());            // method call
console.log(person.hobbies[1]);         // array in object

// Dynamic key
const key = "age";
console.log(person[key]);               // 30

// E2: Modify and Object.keys/values/entries
console.log("\n=== E2: Object Methods ===");
const car = { make: "Toyota", model: "Camry", year: 2020 };
car.color = "blue";         // add
car.year  = 2022;           // modify
delete car.model;           // remove

console.log(Object.keys(car));         // ["make","year","color"]
console.log(Object.values(car));       // ["Toyota",2022,"blue"]
console.log(Object.entries(car));      // [["make","Toyota"],...]
console.log(Object.hasOwn(car,"make")); // true

// E3: Destructuring
console.log("\n=== E3: Destructuring ===");
const { firstName, age, address: { city } } = person;
console.log(firstName, age, city);

// Rename + default
const { firstName: fn, salary = 75000 } = person;
console.log(fn, salary);

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);  // 2 1

// Array destructuring
const [first, , third, ...rest] = [1, 2, 3, 4, 5];
console.log(first, third, rest);  // 1 3 [4,5]

// E4: Spread and Object.assign
console.log("\n=== E4: Spread & Object.assign ===");
const defaults = { theme: "light", lang: "en", notifications: true };
const userPrefs = { theme: "dark", lang: "fr" };
const merged = { ...defaults, ...userPrefs };
console.log(merged);  // theme:dark, lang:fr, notifications:true

const copy = Object.assign({}, car);
copy.color = "red";
console.log("original:", car.color);   // still "blue"
console.log("copy:", copy.color);      // "red"

// ── MODERATE ──────────────────────────────────────────────

// M1: Computed property names and shorthand
console.log("\n=== M1: Computed Keys & Shorthand ===");
const prefix = "get";
const actions = {
  [`${prefix}Name`]() { return "Alice"; },
  [`${prefix}Age`]()  { return 30; },
};
console.log(actions.getName(), actions.getAge());

// Property shorthand
const name = "Alice", ageVal = 30;
const user = { name, ageVal };  // { name: "Alice", ageVal: 30 }
console.log(user);

// Dynamic key from variable
function createState(key, value) {
  return { [key]: value, [`${key}Dirty`]: false };
}
console.log(createState("username", "alice"));

// M2: Object.freeze and Object.seal
console.log("\n=== M2: freeze / seal ===");
const config = Object.freeze({ host: "localhost", port: 3000, db: { name: "mydb" } });
config.port = 9999;     // silently fails in non-strict
config.newProp = "x";   // silently fails
console.log("port (unchanged):", config.port);   // 3000
// ⚠️ freeze is shallow — nested objects can still change
config.db.name = "hacked";
console.log("db.name (changed!):", config.db.name);  // "hacked"

const sealed = Object.seal({ a: 1, b: 2 });
sealed.a = 99;      // ✅ allowed — modify existing
sealed.c = 3;       // ❌ ignored — no new props
delete sealed.b;    // ❌ ignored — can't delete
console.log("sealed:", sealed);   // { a: 99, b: 2 }

// M3: Object transformation patterns
console.log("\n=== M3: Object Transformations ===");
const inventory = [
  { id: 1, name: "Apple",  qty: 50, price: 1.2  },
  { id: 2, name: "Banana", qty: 30, price: 0.5  },
  { id: 3, name: "Cherry", qty: 20, price: 3.0  },
];

// Array of objects → object keyed by id
const byId = Object.fromEntries(inventory.map(item => [item.id, item]));
console.log("byId[2]:", byId[2]);

// Pick specific keys
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter(k => k in obj).map(k => [k, obj[k]]));
const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));

console.log("pick:", pick(person, ["firstName","age"]));
console.log("omit:", omit(car, ["color"]));

// Map over object values
const mapValues = (obj, fn) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v, k)]));
const prices = { apple: 1.2, banana: 0.5, cherry: 3.0 };
const withTax = mapValues(prices, v => +(v * 1.1).toFixed(2));
console.log("withTax:", withTax);

// M4: Deep object operations
console.log("\n=== M4: Deep Operations ===");
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const value = obj[name];
    if (value && typeof value === "object") deepFreeze(value);
  });
  return Object.freeze(obj);
}

function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key]) Object.assign(target, { [key]: {} });
      deepMerge(target[key], source[key]);
    } else {
      Object.assign(target, { [key]: source[key] });
    }
  }
  return deepMerge(target, ...sources);
}

const obj1 = { a: 1, b: { c: 2, d: 3 } };
const obj2 = { b: { c: 99, e: 5 }, f: 6 };
const merged2 = deepMerge({}, obj1, obj2);
console.log("deepMerge:", JSON.stringify(merged2));  // b.c=99, b.d=3, b.e=5

// ── HARD ──────────────────────────────────────────────────

// H1: Observable object (Proxy-based reactivity)
console.log("\n=== H1: Observable Object ===");
function createObservable(data, onChange) {
  const handler = {
    get(target, key) {
      const val = target[key];
      if (val && typeof val === "object") return createObservable(val, onChange);
      return val;
    },
    set(target, key, value) {
      const old = target[key];
      target[key] = value;
      if (old !== value) onChange({ key, old, value, path: key });
      return true;
    },
    deleteProperty(target, key) {
      const old = target[key];
      delete target[key];
      onChange({ key, old, value: undefined, deleted: true });
      return true;
    }
  };
  return new Proxy(data, handler);
}

const changes = [];
const state = createObservable(
  { user: { name: "Alice", age: 30 }, count: 0 },
  change => changes.push(change)
);

state.count = 1;
state.count = 2;
state.user.name = "Bob";
delete state.count;

console.log("Changes recorded:", changes);

// H2: Schema validator for objects
console.log("\n=== H2: Schema Validator ===");
function validate(data, schema) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`${field}: required`);
      continue;
    }
    if (value === undefined) continue;

    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field}: expected ${rules.type}, got ${typeof value}`);
    }
    if (rules.min !== undefined && value < rules.min) {
      errors.push(`${field}: must be >= ${rules.min}`);
    }
    if (rules.max !== undefined && value > rules.max) {
      errors.push(`${field}: must be <= ${rules.max}`);
    }
    if (rules.minLen !== undefined && value.length < rules.minLen) {
      errors.push(`${field}: min length ${rules.minLen}`);
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field}: invalid format`);
    }
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field}: must be one of [${rules.enum.join(",")}]`);
    }
  }

  return { valid: errors.length === 0, errors };
}

const userSchema = {
  name:  { required: true, type: "string", minLen: 2 },
  age:   { required: true, type: "number", min: 0, max: 120 },
  email: { required: true, type: "string", pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  role:  { type: "string", enum: ["admin","user","guest"] },
};

const tests = [
  { name: "Alice", age: 30, email: "alice@co.com", role: "admin" },
  { name: "B",     age: -1, email: "bad-email",    role: "superuser" },
  { age: 25, email: "bob@co.com" },   // missing name
];

tests.forEach((t, i) => {
  const { valid, errors } = validate(t, userSchema);
  console.log(`Test ${i+1}: ${valid ? "✅ valid" : "❌ invalid"}`);
  if (errors.length) errors.forEach(e => console.log(`  - ${e}`));
});
