// ============================================================
// Section 16 — Prototypes
// Run: node 16-prototypes.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Prototype chain basics
console.log("=== E1: Prototype Chain ===");
const arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype);         // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype));                // null  ← end of chain

function Dog(name) { this.name = name; }
Dog.prototype.bark = function() { return `${this.name} says Woof!`; };
Dog.prototype.toString = function() { return `Dog(${this.name})`; };

const rex = new Dog("Rex");
console.log(rex.bark());                              // own chain: Dog.prototype
console.log(rex.toString());                          // overridden on Dog.prototype
console.log(rex.hasOwnProperty("name"));             // true  — own property
console.log(rex.hasOwnProperty("bark"));             // false — on prototype
console.log("bark" in rex);                          // true  — found via chain
console.log(Object.getPrototypeOf(rex) === Dog.prototype); // true

// E2: Adding to built-in prototypes (be careful with this!)
console.log("\n=== E2: Augmenting Prototypes ===");
// Safe: add to your own constructors
Dog.prototype.fetch = function(item) { return `${this.name} fetches ${item}!`; };
console.log(rex.fetch("ball"));

// Checking prototype chain
console.log(rex instanceof Dog);     // true
console.log(rex instanceof Object);  // true — everything is an Object

// Object.create
const proto = { greet() { return `Hello, I'm ${this.name}`; } };
const obj   = Object.create(proto);
obj.name    = "Alice";
console.log(obj.greet());
console.log(Object.getPrototypeOf(obj) === proto);  // true

// E3: hasOwnProperty vs `in`
console.log("\n=== E3: Own vs Inherited ===");
function Vehicle(make) { this.make = make; }
Vehicle.prototype.drive = function() { return "Driving"; };

const car = new Vehicle("Toyota");
car.color = "blue";

// Own properties only
console.log("Own props:", Object.keys(car));             // ["make","color"]
console.log("All (incl. inherited):");
for (const key in car) console.log(`  ${key}: own=${car.hasOwnProperty(key)}`);
// make:true, color:true, drive:false

// ── MODERATE ──────────────────────────────────────────────

// M1: Classical inheritance via prototype chain
console.log("\n=== M1: Classical Inheritance ===");
function Animal(name, sound) {
  this.name  = name;
  this.sound = sound;
}
Animal.prototype.speak = function() { return `${this.name} says ${this.sound}`; };
Animal.prototype.toString = function() { return `Animal(${this.name})`; };

function Cat(name, indoor) {
  Animal.call(this, name, "Meow");    // borrow constructor
  this.indoor = indoor;
}
// Set up prototype chain
Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;       // fix constructor reference!

Cat.prototype.purr  = function() { return `${this.name} purrs...`; };
Cat.prototype.toString = function() {
  return `Cat(${this.name}, indoor=${this.indoor})`;
};

const whiskers = new Cat("Whiskers", true);
console.log(whiskers.speak());         // inherited from Animal
console.log(whiskers.purr());          // own method
console.log(whiskers.toString());      // overridden
console.log(whiskers instanceof Cat);    // true
console.log(whiskers instanceof Animal); // true

// Verify prototype chain
console.log("Cat.prototype → Animal.prototype → Object.prototype → null:");
let p = whiskers;
while (p !== null) {
  const name = p.constructor?.name ?? "Object";
  process.stdout.write(`${name} → `);
  p = Object.getPrototypeOf(p);
}
console.log("null");

// M2: Object.create patterns
console.log("\n=== M2: Object.create Patterns ===");
const eventMixin = {
  on(event, fn) {
    (this._events ??= {})[event] ??= [];
    this._events[event].push(fn);
    return this;
  },
  emit(event, ...args) {
    this._events?.[event]?.forEach(fn => fn(...args));
    return this;
  },
  off(event, fn) {
    if (this._events?.[event])
      this._events[event] = this._events[event].filter(f => f !== fn);
    return this;
  },
};

const logMixin = {
  log(...args) { console.log(`[${this.constructor?.name ?? "obj"}]`, ...args); return this; },
  warn(...args){ console.warn(`[${this.constructor?.name ?? "obj"}]`, ...args); return this; },
};

// Compose multiple mixins
const base = Object.assign(Object.create(null), eventMixin, logMixin);
const myObj = Object.create(base);
myObj.name = "MyObject";

myObj.on("data", d => console.log("  Received:", d));
myObj.on("data", d => console.log("  Also got:", d.toUpperCase?.() ?? d));
myObj.emit("data", "hello");
myObj.log("This is a log message");

// M3: Property descriptors
console.log("\n=== M3: Property Descriptors ===");
const config = {};

// Define non-writable, non-enumerable, non-configurable
Object.defineProperty(config, "VERSION", {
  value:        "1.0.0",
  writable:     false,
  enumerable:   true,
  configurable: false,
});
Object.defineProperty(config, "_secret", {
  value:        "hidden",
  writable:     true,
  enumerable:   false,    // won't show in for...in or Object.keys
  configurable: true,
});

config.VERSION = "2.0.0";    // silently fails (non-strict)
console.log("VERSION:", config.VERSION);   // still "1.0.0"
console.log("Keys:", Object.keys(config)); // ["VERSION"] — _secret hidden
console.log("All:", Object.getOwnPropertyNames(config)); // includes _secret

// Getter/setter via defineProperty
let _radius = 5;
const circle = {};
Object.defineProperty(circle, "radius", {
  get() { return _radius; },
  set(v) { if (v < 0) throw new Error("Negative!"); _radius = v; },
  enumerable: true, configurable: true,
});
console.log(circle.radius);    // 5
circle.radius = 10;
console.log(circle.radius);    // 10
try { circle.radius = -1; } catch(e) { console.log("Error:", e.message); }

// ── HARD ──────────────────────────────────────────────────

// H1: Build a class system using prototypes only
console.log("\n=== H1: Class System via Prototypes ===");
function createClass(Base, definition) {
  const { constructor: ctor = function() {}, ...methods } = definition;

  function Class(...args) {
    if (Base) Base.apply(this, args);
    ctor.apply(this, args);
  }

  if (Base) {
    Class.prototype = Object.create(Base.prototype);
    Class.prototype.constructor = Class;
  }

  Object.assign(Class.prototype, methods);

  Class.extend = (def) => createClass(Class, def);

  return Class;
}

const Shape = createClass(null, {
  constructor(color = "black") { this.color = color; },
  area()      { throw new Error("Not implemented"); },
  describe()  { return `${this.constructor.name}[${this.color}] area=${this.area().toFixed(2)}`; },
});

const Rect = Shape.extend({
  constructor(w, h, color) { this.w = w; this.h = h; },
  area() { return this.w * this.h; },
});

const Square = Rect.extend({
  constructor(side, color) { Rect.prototype.constructor.call(this, side, side, color); },
});

const r = new Rect(10, 5, "red");
const s = new Square(7, "blue");

console.log(r.describe());
console.log(s.describe());
console.log("Square instanceof Rect:", s instanceof Rect);
console.log("Square instanceof Shape:", s instanceof Shape);

// H2: Prototype chain inspector
console.log("\n=== H2: Prototype Inspector ===");
function inspectChain(obj) {
  const chain = [];
  let current = obj;

  while (current !== null) {
    const ownProps  = Object.getOwnPropertyNames(current)
      .filter(k => k !== "__proto__");
    const ownMethods = ownProps.filter(k => typeof current[k] === "function");
    const ownData    = ownProps.filter(k => typeof current[k] !== "function");

    chain.push({
      name:    current.constructor?.name ?? "(anonymous)",
      data:    ownData,
      methods: ownMethods,
    });
    current = Object.getPrototypeOf(current);
  }

  return chain;
}

const tesla = new (class ElectricCar {
  constructor() { this.make = "Tesla"; this.battery = 100; }
  charge() {}
  drive()  {}
})();

const chain = inspectChain(tesla);
chain.forEach(({ name, data, methods }, i) => {
  const indent = "  ".repeat(i);
  console.log(`${indent}[${name}]`);
  if (data.length)    console.log(`${indent}  data:    ${data.join(", ")}`);
  if (methods.length) console.log(`${indent}  methods: ${methods.join(", ")}`);
});

// H3: Implement Object.create and new from scratch
console.log("\n=== H3: myCreate & myNew ===");
function myCreate(proto, props = {}) {
  const obj = {};
  Object.setPrototypeOf(obj, proto);
  Object.defineProperties(obj, props);
  return obj;
}

function myNew(Constructor, ...args) {
  const obj = myCreate(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result && typeof result === "object" ? result : obj;
}

function Person(name, age) {
  this.name = name;
  this.age  = age;
}
Person.prototype.greet = function() { return `Hi, I'm ${this.name}`; };

const alice = myNew(Person, "Alice", 30);
console.log(alice.greet());
console.log(alice instanceof Person);
console.log(Object.getPrototypeOf(alice) === Person.prototype);
