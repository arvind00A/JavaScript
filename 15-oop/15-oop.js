// ============================================================
// Section 15 — OOP (Object-Oriented Programming)
// Run: node 15-oop.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Basic class
console.log("=== E1: Basic Class ===");
class Animal {
  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
  }
  speak()  { return `${this.name} says ${this.sound}!`; }
  toString(){ return `Animal(${this.name})`; }
}

const dog = new Animal("Rex", "Woof");
const cat = new Animal("Whiskers", "Meow");
console.log(dog.speak());
console.log(cat.speak());
console.log(dog instanceof Animal);   // true
console.log(dog.constructor === Animal); // true

// E2: Getters, setters, static
console.log("\n=== E2: Getters / Setters / Static ===");
class Circle {
  static #count = 0;

  constructor(radius) {
    if (radius <= 0) throw new Error("Radius must be positive");
    this.#radius = radius;
    Circle.#count++;
  }
  #radius;

  get radius()   { return this.#radius; }
  set radius(r)  { if (r <= 0) throw new Error("Must be positive"); this.#radius = r; }
  get area()     { return +(Math.PI * this.#radius ** 2).toFixed(4); }
  get perimeter(){ return +(2 * Math.PI * this.#radius).toFixed(4); }
  get diameter() { return this.#radius * 2; }

  scale(factor)  { this.#radius *= factor; return this; }  // method chaining

  static getCount()       { return Circle.#count; }
  static fromDiameter(d)  { return new Circle(d / 2); }

  toString() { return `Circle(r=${this.#radius})`; }
}

const c1 = new Circle(5);
console.log(`r=${c1.radius}, area=${c1.area}, perimeter=${c1.perimeter}`);
c1.scale(2);
console.log(`After scale(2): r=${c1.radius}`);

const c2 = Circle.fromDiameter(10);
console.log(`From diameter 10: ${c2}`);
console.log(`Total circles: ${Circle.getCount()}`);

// ── MODERATE ──────────────────────────────────────────────

// M1: Inheritance and super
console.log("\n=== M1: Inheritance ===");
class Vehicle {
  #mileage = 0;

  constructor(make, model, year) {
    this.make  = make;
    this.model = model;
    this.year  = year;
  }

  drive(miles) {
    if (miles < 0) throw new Error("Miles must be positive");
    this.#mileage += miles;
    return this;
  }

  get mileage() { return this.#mileage; }
  get age()     { return new Date().getFullYear() - this.year; }

  toString() { return `${this.year} ${this.make} ${this.model}`; }
  info()     { return `${this} — ${this.#mileage.toLocaleString()} miles`; }
}

class Car extends Vehicle {
  #passengers = 0;

  constructor(make, model, year, seats = 5) {
    super(make, model, year);
    this.seats = seats;
  }

  addPassengers(n) {
    if (this.#passengers + n > this.seats) throw new Error("Over capacity!");
    this.#passengers += n;
    return this;
  }

  get passengers() { return this.#passengers; }
  info() { return `${super.info()} | ${this.#passengers}/${this.seats} passengers`; }
}

class ElectricCar extends Car {
  #batteryLevel = 100;

  constructor(make, model, year, range) {
    super(make, model, year);
    this.range = range;
  }

  drive(miles) {
    const drainPct = (miles / this.range) * 100;
    if (drainPct > this.#batteryLevel) throw new Error("Not enough charge!");
    this.#batteryLevel -= drainPct;
    return super.drive(miles);
  }

  charge(pct = 100) { this.#batteryLevel = Math.min(100, this.#batteryLevel + pct); return this; }
  get battery() { return `${this.#batteryLevel.toFixed(0)}%`; }
  info() { return `${super.info()} | 🔋 ${this.battery}`; }
}

const myCar   = new Car("Toyota", "Camry", 2020);
const myTesla = new ElectricCar("Tesla", "Model 3", 2023, 350);

myCar.drive(1200).addPassengers(3);
myTesla.drive(100).drive(50);

console.log(myCar.info());
console.log(myTesla.info());
console.log("Tesla instanceof Car:", myTesla instanceof Car);
console.log("Tesla instanceof Vehicle:", myTesla instanceof Vehicle);

// M2: Mixins pattern
console.log("\n=== M2: Mixins ===");
const Serializable = (Base) => class extends Base {
  serialize()   { return JSON.stringify(this); }
  static deserialize(json) { return Object.assign(new this(), JSON.parse(json)); }
};

const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }
  touch() { this.updatedAt = new Date().toISOString(); return this; }
};

const Taggable = (Base) => class extends Base {
  #tags = new Set();
  addTag(tag)    { this.#tags.add(tag); return this; }
  removeTag(tag) { this.#tags.delete(tag); return this; }
  hasTag(tag)    { return this.#tags.has(tag); }
  get tags()     { return [...this.#tags]; }
};

class BaseModel {
  constructor(data = {}) { Object.assign(this, data); }
}

class Post extends Taggable(Timestamped(Serializable(BaseModel))) {
  constructor(title, content) {
    super({ title, content });
  }
  toString() { return `Post: "${this.title}"`; }
}

const post = new Post("Hello World", "My first post");
post.addTag("js").addTag("tutorial").addTag("es6");
console.log(post.toString());
console.log("Tags:", post.tags);
console.log("Has 'js':", post.hasTag("js"));
const json = post.serialize();
console.log("Serialized:", json.slice(0, 80) + "...");

// M3: Abstract class pattern
console.log("\n=== M3: Abstract Class Pattern ===");
class Shape {
  constructor(color = "black") {
    if (new.target === Shape) throw new Error("Shape is abstract — cannot instantiate directly");
    this.color = color;
  }
  // "Abstract" methods — must be overridden
  area()      { throw new Error(`${this.constructor.name} must implement area()`); }
  perimeter() { throw new Error(`${this.constructor.name} must implement perimeter()`); }

  toString()  { return `${this.constructor.name}[color=${this.color}, area=${this.area().toFixed(2)}]`; }
  compareTo(other) { return this.area() - other.area(); }
}

class Rectangle extends Shape {
  constructor(w, h, color) { super(color); this.w = w; this.h = h; }
  area()      { return this.w * this.h; }
  perimeter() { return 2 * (this.w + this.h); }
}

class Triangle extends Shape {
  constructor(a, b, c, color) { super(color); this.a = a; this.b = b; this.c = c; }
  area()      {
    const s = (this.a + this.b + this.c) / 2;
    return Math.sqrt(s * (s-this.a) * (s-this.b) * (s-this.c));
  }
  perimeter() { return this.a + this.b + this.c; }
}

try { new Shape(); } catch(e) { console.log("Abstract:", e.message); }

const shapes = [
  new Rectangle(10, 5, "red"),
  new Circle(7),
  new Triangle(3, 4, 5, "blue"),
  new Rectangle(3, 3, "green"),
];
shapes.sort((a, b) => a.compareTo(b));
console.log("Shapes sorted by area:");
shapes.forEach(s => console.log(" ", s.toString()));

// ── HARD ──────────────────────────────────────────────────

// H1: Full OOP mini-framework — Observable + Repository pattern
console.log("\n=== H1: Repository Pattern ===");
class Repository {
  #store  = new Map();
  #nextId = 1;
  #hooks  = { beforeSave: [], afterSave: [], beforeDelete: [], afterDelete: [] };

  addHook(event, fn) { this.#hooks[event]?.push(fn); return this; }
  #runHooks(event, data) { return this.#hooks[event]?.every(fn => fn(data) !== false); }

  save(entity) {
    if (!this.#runHooks("beforeSave", entity)) return null;
    if (!entity.id) entity.id = this.#nextId++;
    entity.updatedAt = new Date().toISOString();
    this.#store.set(entity.id, { ...entity });
    this.#runHooks("afterSave", entity);
    return entity;
  }

  findById(id)       { return this.#store.get(id) ?? null; }
  findAll(pred = ()=>true) { return [...this.#store.values()].filter(pred); }
  findOne(pred)      { return [...this.#store.values()].find(pred) ?? null; }

  delete(id) {
    const entity = this.#store.get(id);
    if (!entity) return false;
    if (!this.#runHooks("beforeDelete", entity)) return false;
    this.#store.delete(id);
    this.#runHooks("afterDelete", entity);
    return true;
  }

  count(pred = ()=>true) { return this.findAll(pred).length; }
  get size() { return this.#store.size; }
}

// Use the repository
const userRepo = new Repository();

// Add validation hook
userRepo.addHook("beforeSave", u => {
  if (!u.name || u.name.length < 2) { console.log("  ❌ Invalid name"); return false; }
  if (!u.email?.includes("@"))      { console.log("  ❌ Invalid email"); return false; }
  return true;
});
userRepo.addHook("afterSave",  u => console.log(`  ✅ Saved user: ${u.name} (id=${u.id})`));
userRepo.addHook("afterDelete",u => console.log(`  🗑️  Deleted user: ${u.name}`));

userRepo.save({ name: "Alice", email: "alice@co.com", role: "admin" });
userRepo.save({ name: "Bob",   email: "bob@co.com",   role: "user"  });
userRepo.save({ name: "X",     email: "bad" });    // fails validation
userRepo.save({ name: "Carol", email: "carol@co.com", role: "user" });

console.log("Total:", userRepo.size);
console.log("Users:", userRepo.findAll().map(u => u.name));
console.log("Admins:", userRepo.findAll(u => u.role === "admin").map(u => u.name));
userRepo.delete(2);
console.log("After delete:", userRepo.size);
