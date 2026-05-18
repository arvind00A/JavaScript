// ============================================================
// Section 20 — Modules & Code Organization
// ESM · CommonJS · Patterns · Barrel files · Reusable code
// Run: node 20-modules-code-organization.js
// ============================================================

// ── NOTE ──────────────────────────────────────────────────
// This file demonstrates module patterns runnable in Node.js
// (CommonJS) without needing a bundler. For ESM examples,
// see the companion /esm-demo/ folder created below.
// ============================================================

const fs   = require("fs");
const path = require("path");

// Create ESM demo folder
const esmDir = path.join(__dirname, "esm-demo");
if (!fs.existsSync(esmDir)) fs.mkdirSync(esmDir, { recursive: true });

// Write ESM demo files
fs.writeFileSync(path.join(esmDir, "package.json"), JSON.stringify({ type:"module" }, null, 2));

fs.writeFileSync(path.join(esmDir, "math.js"), `
// Named exports
export const PI     = 3.14159265358979;
export const E      = 2.71828182845905;

export function add(a, b)      { return a + b; }
export function subtract(a, b) { return a - b; }
export function multiply(a, b) { return a * b; }
export function divide(a, b)   {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

// Named export of object
export const mathUtils = { add, subtract, multiply, divide };

// Default export
export default { PI, E, add, subtract, multiply, divide };
`);

fs.writeFileSync(path.join(esmDir, "validators.js"), `
export const isEmail  = s => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s);
export const isPhone  = s => /^\\+?[\\d\\s\\-]{10,15}$/.test(s);
export const isEmpty  = v => v == null || String(v).trim() === "";
export const isNumber = v => typeof v === "number" && !isNaN(v);
export const inRange  = (v, min, max) => v >= min && v <= max;
export const clamp    = (v, min, max) => Math.min(Math.max(v, min), max);

export default { isEmail, isPhone, isEmpty, isNumber, inRange, clamp };
`);

fs.writeFileSync(path.join(esmDir, "formatters.js"), `
export const formatDate = (d, locale="en-US") =>
  new Date(d).toLocaleDateString(locale, { year:"numeric", month:"short", day:"2-digit" });

export const formatCurrency = (amount, currency="USD", locale="en-US") =>
  new Intl.NumberFormat(locale, { style:"currency", currency }).format(amount);

export const formatNumber = (n, opts={}) =>
  new Intl.NumberFormat("en-US", opts).format(n);

export const truncate = (str, n=50, suffix="...") =>
  str.length > n ? str.slice(0, n-suffix.length) + suffix : str;

export const padStart = (n, len=2, char="0") => String(n).padStart(len, char);
`);

// Barrel file (index.js — re-export everything cleanly)
fs.writeFileSync(path.join(esmDir, "index.js"), `
export * from "./math.js";
export * from "./validators.js";
export * from "./formatters.js";
// Usage in consumer: import { add, isEmail, formatDate } from "./esm-demo/index.js"
`);

fs.writeFileSync(path.join(esmDir, "main.js"), `
// Import from barrel
import { add, multiply, isEmail, formatCurrency, truncate } from "./index.js";
// Default import
import defaultMath from "./math.js";
// Namespace import
import * as validators from "./validators.js";
// Dynamic import
const { formatDate } = await import("./formatters.js");

console.log("add(5,3):", add(5, 3));
console.log("PI:", defaultMath.PI);
console.log("isEmail:", validators.isEmail("alice@co.com"));
console.log("formatCurrency:", formatCurrency(1234.56));
console.log("formatDate:", formatDate(new Date()));
console.log("truncate:", truncate("This is a very long string that needs truncating", 30));
`);

console.log("✅ Created esm-demo/ folder with ESM module examples");
console.log("   Run ESM demo: node esm-demo/main.js");

// ── COMMONJS PATTERNS (runnable directly) ─────────────────

// E1: Module pattern (IIFE-based — pre-module-system pattern)
console.log("\n=== E1: Module Pattern ===");
const MathModule = (() => {
  // Private
  const _history = [];

  function _log(op, a, b, result) {
    _history.push({ op, a, b, result, time: Date.now() });
  }

  // Public API
  return {
    add(a, b)      { const r = a+b;  _log("+",a,b,r); return r; },
    subtract(a,b)  { const r = a-b;  _log("-",a,b,r); return r; },
    multiply(a,b)  { const r = a*b;  _log("×",a,b,r); return r; },
    divide(a,b)    {
      if (!b) throw new Error("Divide by zero");
      const r = a/b; _log("÷",a,b,r); return r;
    },
    history()      { return [..._history]; },   // return copy
    clearHistory() { _history.length = 0; return this; },
  };
})();

console.log(MathModule.add(5, 3));          // 8
console.log(MathModule.multiply(4, 7));     // 28
console.log(MathModule.divide(20, 4));      // 5
console.log("History entries:", MathModule.history().length);
console.log("Last:", MathModule.history().at(-1));

// E2: Singleton pattern
console.log("\n=== E2: Singleton ===");
class Config {
  static #instance = null;
  #settings = {};

  constructor() {
    if (Config.#instance) return Config.#instance;
    Config.#instance = this;
    this.#settings = {
      theme:     "light",
      lang:      "en",
      debug:     false,
      maxRetries: 3,
    };
  }

  get(key)        { return this.#settings[key]; }
  set(key, value) { this.#settings[key] = value; return this; }
  getAll()        { return { ...this.#settings }; }
  static getInstance() { return Config.#instance ?? new Config(); }
}

const c1 = new Config();
const c2 = new Config();
c1.set("theme", "dark");
console.log("Same instance?", c1 === c2);           // true
console.log("c2 theme:", c2.get("theme"));          // "dark" — same!

// E3: Observer / Event system (reusable module)
console.log("\n=== E3: Reusable Observer ===");
class EventBus {
  static #instance = null;
  #listeners = {};

  static getInstance() { return EventBus.#instance ?? (EventBus.#instance = new EventBus()); }

  on(event, fn, { once = false } = {}) {
    (this.#listeners[event] ??= []).push({ fn, once });
    return () => this.off(event, fn);   // returns unsubscribe fn
  }

  off(event, fn) {
    this.#listeners[event] = this.#listeners[event]?.filter(l => l.fn !== fn) ?? [];
  }

  emit(event, ...args) {
    const listeners = this.#listeners[event] ?? [];
    this.#listeners[event] = listeners.filter(l => {
      l.fn(...args);
      return !l.once;
    });
    return this;
  }

  once(event, fn) { return this.on(event, fn, { once: true }); }
  listenerCount(event) { return (this.#listeners[event] ?? []).length; }
}

const bus = EventBus.getInstance();

const unsub = bus.on("user:login", ({ name }) => console.log(`User logged in: ${name}`));
bus.once("app:ready", () => console.log("App is ready! (fires once)"));
bus.on("data:received", data => console.log("Data:", JSON.stringify(data)));

bus.emit("app:ready");
bus.emit("app:ready");           // does NOT fire (once)
bus.emit("user:login", { name: "Alice" });
bus.emit("user:login", { name: "Bob" });
bus.emit("data:received", { id: 1, value: 42 });
unsub();                          // unsubscribe user:login
bus.emit("user:login", { name: "Carol" });  // no output — unsubscribed

// ── MODERATE ──────────────────────────────────────────────

// M1: Plugin system
console.log("\n=== M1: Plugin System ===");
class App {
  #plugins  = new Map();
  #hooks    = {};
  #context  = {};

  use(plugin) {
    if (this.#plugins.has(plugin.name))
      throw new Error(`Plugin "${plugin.name}" already registered`);
    plugin.install(this);
    this.#plugins.set(plugin.name, plugin);
    console.log(`  Plugin installed: ${plugin.name}`);
    return this;
  }

  hook(name, fn) {
    (this.#hooks[name] ??= []).push(fn);
    return this;
  }

  async runHook(name, ...args) {
    for (const fn of this.#hooks[name] ?? []) await fn(...args);
  }

  set(key, value) { this.#context[key] = value; return this; }
  get(key)        { return this.#context[key]; }
  getPlugins()    { return [...this.#plugins.keys()]; }
}

// Plugins
const loggerPlugin = {
  name: "logger",
  install(app) {
    app.hook("request",  req   => console.log(`  → ${req.method} ${req.url}`));
    app.hook("response", (res) => console.log(`  ← ${res.status}`));
    app.set("logger", { log: (...a) => console.log("[LOG]", ...a) });
  },
};

const authPlugin = {
  name: "auth",
  install(app) {
    app.hook("request", req => {
      if (!req.headers?.authorization)
        console.log("  ⚠️  No auth header");
    });
  },
};

const app = new App();
app.use(loggerPlugin).use(authPlugin);
console.log("Plugins:", app.getPlugins());

async function handleRequest(app, req) {
  await app.runHook("request",  req);
  await app.runHook("response", { status: 200 });
}
handleRequest(app, { method: "GET", url: "/api/users", headers: {} });

// M2: Dependency injection container
console.log("\n=== M2: DI Container ===");
class Container {
  #services    = new Map();
  #singletons  = new Map();
  #factories   = new Map();

  register(name, factory, { singleton = false } = {}) {
    this.#factories.set(name, factory);
    if (singleton) this.#services.set(name, null);   // mark as singleton
    return this;
  }

  resolve(name) {
    if (!this.#factories.has(name)) throw new Error(`Service "${name}" not registered`);

    if (this.#services.has(name)) {   // singleton
      if (!this.#singletons.has(name))
        this.#singletons.set(name, this.#factories.get(name)(this));
      return this.#singletons.get(name);
    }

    return this.#factories.get(name)(this);   // new instance each time
  }
}

// Register services
const container = new Container();
container
  .register("config",     () => ({ dbHost: "localhost", dbPort: 5432 }), { singleton: true })
  .register("logger",     () => ({ log: (m) => console.log("  [DB LOG]", m) }), { singleton: true })
  .register("database",   c  => ({ config: c.resolve("config"), logger: c.resolve("logger"),
    query(sql) { this.logger.log(`Query: ${sql}`); return []; } }),
    { singleton: true })
  .register("userService",c  => ({
    db: c.resolve("database"),
    findAll() { return this.db.query("SELECT * FROM users"); },
    findById(id) { return this.db.query(`SELECT * FROM users WHERE id=${id}`); },
  }));

const userService1 = container.resolve("userService");
const userService2 = container.resolve("userService");
console.log("Same singleton?", userService1 === userService2);   // true
userService1.findAll();
userService1.findById(42);

// ── HARD ──────────────────────────────────────────────────

// H1: Module hot-reload simulation
console.log("\n=== H1: Module Registry ===");
class ModuleRegistry {
  #modules    = new Map();
  #dependents = new Map();

  define(name, factory, deps = []) {
    this.#modules.set(name, { factory, deps, instance: null, version: 0 });
    deps.forEach(dep => {
      (this.#dependents.get(dep) ??= new Set()).add(name);
    });
    return this;
  }

  require(name) {
    const mod = this.#modules.get(name);
    if (!mod) throw new Error(`Module "${name}" not found`);
    if (mod.instance) return mod.instance;

    const resolvedDeps = mod.deps.map(d => this.require(d));
    mod.instance = mod.factory(...resolvedDeps);
    return mod.instance;
  }

  reload(name) {
    const mod = this.#modules.get(name);
    if (!mod) return;
    mod.instance = null;
    mod.version++;
    // Invalidate dependents
    this.#dependents.get(name)?.forEach(dep => this.reload(dep));
    console.log(`  Reloaded: ${name} (v${mod.version})`);
  }

  list() { return [...this.#modules.entries()].map(([n,m]) => `${n}@v${m.version}`); }
}

const registry = new ModuleRegistry();
registry
  .define("config",  ()    => ({ env: "dev", port: 3000 }))
  .define("db",      (cfg) => ({ connected: true, host: cfg.env === "dev" ? "localhost" : "prod-db" }), ["config"])
  .define("api",     (db)  => ({ router: { db, routes: ["/users","/posts"] } }), ["db"]);

const api1 = registry.require("api");
console.log("API routes:", api1.router.routes);
console.log("DB host:", api1.router.db.host);
console.log("Modules:", registry.list());

registry.reload("config");   // cascades to db and api
console.log("After reload:", registry.list());
const api2 = registry.require("api");
console.log("New instance after reload?", api1 !== api2);  // true
