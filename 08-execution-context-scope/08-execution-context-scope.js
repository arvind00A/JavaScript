// ============================================================
// Section 8 — Execution Context & Scope
// Run: node 08-execution-context-scope.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: Scope types
console.log("=== E1: Scope Types ===");
let globalVar = "global";

function outerFn() {
  let outerVar = "outer";
  function innerFn() {
    let innerVar = "inner";
    console.log(innerVar);   // own scope
    console.log(outerVar);   // outer scope (closure)
    console.log(globalVar);  // global scope
  }
  innerFn();
  // console.log(innerVar);  // ReferenceError
}
outerFn();

// Block scope
{
  let blockLet   = "block let";
  const blockConst = "block const";
  var blockVar   = "block var (leaks!)";
}
console.log(blockVar);     // accessible (var leaks)
// console.log(blockLet);  // ReferenceError

// E2: Hoisting
console.log("\n=== E2: Hoisting ===");
// var is hoisted (as undefined)
console.log(hoistedVar);     // undefined (not error)
var hoistedVar = "assigned";
console.log(hoistedVar);     // "assigned"

// function declaration is fully hoisted
console.log(hoistedFn());    // "I'm hoisted!"
function hoistedFn() { return "I'm hoisted!"; }

// let/const are hoisted but in TDZ
try {
  console.log(tdzVar);       // ReferenceError!
} catch(e) {
  console.log("TDZ error:", e.constructor.name);
}
let tdzVar = "now assigned";

// ── MODERATE ──────────────────────────────────────────────

// M1: Scope chain lookup
console.log("\n=== M1: Scope Chain ===");
const x = "global-x";
function level1() {
  const x = "level1-x";
  function level2() {
    // no x here — looks up chain
    function level3() {
      console.log(x);  // finds "level1-x" (skips level2, finds level1)
    }
    level3();
  }
  level2();
}
level1();

// M2: Classic var-in-loop closure bug and fix
console.log("\n=== M2: var-in-loop Bug ===");
// ❌ Bug — all callbacks capture the same var i
const funcs_bad = [];
for (var i = 0; i < 3; i++) {
  funcs_bad.push(function() { return i; });
}
console.log("var bug:", funcs_bad.map(f => f()));  // [3,3,3] — all 3!

// ✅ Fix 1 — use let (block scoped)
const funcs_let = [];
for (let i = 0; i < 3; i++) {
  funcs_let.push(function() { return i; });
}
console.log("let fix:", funcs_let.map(f => f()));  // [0,1,2] ✅

// ✅ Fix 2 — IIFE to create new scope
const funcs_iife = [];
for (var i = 0; i < 3; i++) {
  funcs_iife.push((function(j) { return function() { return j; }; })(i));
}
console.log("IIFE fix:", funcs_iife.map(f => f()));  // [0,1,2] ✅

// M3: Call stack simulation
console.log("\n=== M3: Call Stack ===");
function stackTrace() {
  // Simulate call stack via recursive calls
  function a() {
    console.log("  → a() called");
    return b() + 1;
  }
  function b() {
    console.log("  → b() called");
    return c() + 1;
  }
  function c() {
    console.log("  → c() called (deepest)");
    return 1;
  }
  const result = a();
  console.log("  result:", result);  // 3
}
stackTrace();

// Stack overflow example (safely caught)
function causeOverflow(n = 0) {
  return causeOverflow(n + 1);  // no base case!
}
try {
  causeOverflow();
} catch (e) {
  console.log("\nStack overflow caught:", e.constructor.name);
}

// M4: Hoisting edge cases
console.log("\n=== M4: Hoisting Edge Cases ===");
// Function expression NOT hoisted
try {
  result = notHoisted();
} catch(e) {
  console.log("Function expression not hoisted:", e.message.slice(0,30));
}
var notHoisted = function() { return "value"; };

// Var in function scope
function varScope() {
  console.log(localVar);  // undefined (hoisted within function)
  var localVar = "set";
  console.log(localVar);  // "set"
}
varScope();

// Function declaration inside if — avoid! Behaviour varies
// Use function expression instead:
const conditionalFn = true
  ? function() { return "true branch"; }
  : function() { return "false branch"; };
console.log(conditionalFn());

// ── HARD ──────────────────────────────────────────────────

// H1: Module pattern using IIFE + closures
console.log("\n=== H1: Module Pattern ===");
const ShoppingCart = (() => {
  // Private state
  let items = [];
  let discount = 0;

  // Private functions
  function calcSubtotal() {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }
  function validateItem(item) {
    if (!item.name || typeof item.name !== "string") throw new Error("Invalid name");
    if (typeof item.price !== "number" || item.price < 0) throw new Error("Invalid price");
    if (!Number.isInteger(item.qty) || item.qty < 1) throw new Error("Invalid qty");
    return true;
  }

  // Public API
  return {
    addItem(item) {
      validateItem(item);
      const existing = items.find(i => i.name === item.name);
      if (existing) existing.qty += item.qty;
      else items.push({ ...item });
      return this;
    },
    removeItem(name) {
      items = items.filter(i => i.name !== name);
      return this;
    },
    setDiscount(pct) {
      if (pct < 0 || pct > 100) throw new Error("Discount must be 0-100");
      discount = pct;
      return this;
    },
    getTotal() {
      const subtotal = calcSubtotal();
      return subtotal * (1 - discount / 100);
    },
    getItems() { return [...items]; },          // return copy
    summary() {
      const subtotal = calcSubtotal();
      const total    = this.getTotal();
      return { items: this.getItems(), subtotal, discount, total };
    }
  };
})();

ShoppingCart
  .addItem({ name: "Laptop", price: 999, qty: 1 })
  .addItem({ name: "Mouse",  price: 29,  qty: 2 })
  .addItem({ name: "Laptop", price: 999, qty: 1 })  // adds to existing
  .setDiscount(10);

const summary = ShoppingCart.summary();
console.log("Items:", summary.items);
console.log(`Subtotal: $${summary.subtotal}`);
console.log(`Discount: ${summary.discount}%`);
console.log(`Total: $${summary.total}`);

// H2: Scope-aware variable tracker
console.log("\n=== H2: Scope Tracker ===");
function createScopeTracker() {
  const scopes = [new Map()];   // stack of scope maps

  return {
    enterScope() { scopes.push(new Map()); },
    exitScope()  { if (scopes.length > 1) scopes.pop(); },
    declare(name, value) {
      const current = scopes[scopes.length - 1];
      if (current.has(name)) throw new Error(`${name} already declared in this scope`);
      current.set(name, value);
    },
    assign(name, value) {
      for (let i = scopes.length - 1; i >= 0; i--) {
        if (scopes[i].has(name)) { scopes[i].set(name, value); return; }
      }
      throw new Error(`${name} is not defined`);
    },
    lookup(name) {
      for (let i = scopes.length - 1; i >= 0; i--) {
        if (scopes[i].has(name)) return scopes[i].get(name);
      }
      throw new Error(`${name} is not defined`);
    },
    depth() { return scopes.length; }
  };
}

const tracker = createScopeTracker();
tracker.declare("x", 10);
tracker.enterScope();
  tracker.declare("y", 20);
  tracker.assign("x", 99);   // modifies outer x
  console.log("x in inner scope:", tracker.lookup("x"));  // 99
  console.log("y in inner scope:", tracker.lookup("y"));  // 20
tracker.exitScope();
console.log("x after exiting scope:", tracker.lookup("x"));  // 99 (was modified)
try {
  tracker.lookup("y");  // should throw
} catch(e) {
  console.log("y not in outer scope:", e.message);
}
