// ============================================================
// Section 5 — Control Flow
// Run: node 05-control-flow.js
// ============================================================

// ── EASY ──────────────────────────────────────────────────

// E1: if / else if / else
console.log("=== E1: if/else ===");
function getGrade(score) {
  if      (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else if (score >= 60) return "D";
  else                  return "F";
}
[100, 85, 72, 63, 45].forEach(s => console.log(`${s} → ${getGrade(s)}`));

// E2: switch statement
console.log("\n=== E2: switch ===");
function getDayType(day) {
  switch (day.toLowerCase()) {
    case "monday":
    case "tuesday":
    case "wednesday":
    case "thursday":
    case "friday":
      return "Weekday";
    case "saturday":
    case "sunday":
      return "Weekend";
    default:
      return "Invalid day";
  }
}
["Monday","Saturday","friday","Sunday","Holiday"].forEach(d =>
  console.log(`${d} → ${getDayType(d)}`)
);

// E3: Ternary operator
console.log("\n=== E3: Ternary ===");
const age = 20;
const type = age >= 18 ? "adult" : "minor";
console.log(type);  // "adult"

// Ternary chain
function classify(n) {
  return n > 0 ? "positive"
       : n < 0 ? "negative"
       : "zero";
}
[-5, 0, 3].forEach(n => console.log(`${n} → ${classify(n)}`));

// Ternary in template literal
const items = 3;
console.log(`You have ${items} ${items === 1 ? "item" : "items"}`);

// ── MODERATE ──────────────────────────────────────────────

// M1: switch (true) — range matching
console.log("\n=== M1: switch(true) ===");
function categoriseScore(score) {
  switch (true) {
    case score >= 90: return { grade: "A", remark: "Excellent" };
    case score >= 80: return { grade: "B", remark: "Good" };
    case score >= 70: return { grade: "C", remark: "Average" };
    case score >= 60: return { grade: "D", remark: "Below Average" };
    default:          return { grade: "F", remark: "Fail" };
  }
}
[95, 82, 71, 62, 40].forEach(s => {
  const { grade, remark } = categoriseScore(s);
  console.log(`${s} → ${grade} (${remark})`);
});

// M2: Guard clauses pattern
console.log("\n=== M2: Guard Clauses ===");
function processOrder(order) {
  // Guard clauses — early return for invalid states
  if (!order)           return { error: "No order provided" };
  if (!order.userId)    return { error: "Missing user ID" };
  if (!order.items?.length) return { error: "Cart is empty" };
  if (order.total < 0)  return { error: "Invalid total" };
  // Happy path — no deep nesting needed!
  return {
    success: true,
    message: `Order for user ${order.userId}: ${order.items.length} items, $${order.total}`
  };
}

const orders = [
  null,
  { items: ["book"], total: 25 },               // missing userId
  { userId: 1, items: [], total: 0 },            // empty cart
  { userId: 1, items: ["book","pen"], total: 35 }// valid!
];
orders.forEach(o => console.log(JSON.stringify(processOrder(o))));

// M3: State machine with switch
console.log("\n=== M3: Traffic Light State Machine ===");
class TrafficLight {
  #state = "red";
  #durations = { red: 3000, green: 2000, yellow: 500 };

  transition() {
    switch (this.#state) {
      case "red":    this.#state = "green";  break;
      case "green":  this.#state = "yellow"; break;
      case "yellow": this.#state = "red";    break;
    }
    return this;
  }

  get state()    { return this.#state; }
  get duration() { return this.#durations[this.#state]; }
  get emoji()    { return { red:"🔴", green:"🟢", yellow:"🟡" }[this.#state]; }
}

const light = new TrafficLight();
for (let i = 0; i < 6; i++) {
  console.log(`${light.emoji} ${light.state.padEnd(6)} (${light.duration}ms)`);
  light.transition();
}

// M4: Null-safe conditional chaining
console.log("\n=== M4: Optional Chaining in Conditions ===");
const users = [
  { name: "Alice", settings: { theme: "dark", notifications: true } },
  { name: "Bob",   settings: null },
  { name: "Carol" },                  // no settings property
];

for (const u of users) {
  const theme = u?.settings?.theme ?? "light";
  const notif = u?.settings?.notifications ?? false;
  console.log(`${u.name}: theme=${theme}, notifications=${notif}`);
}

// ── HARD ──────────────────────────────────────────────────

// H1: Role-based access control (RBAC) with complex conditions
console.log("\n=== H1: Role-Based Access Control ===");
const PERMISSIONS = {
  admin:   ["read","write","delete","manage_users","view_reports"],
  manager: ["read","write","view_reports"],
  editor:  ["read","write"],
  viewer:  ["read"],
  guest:   [],
};

function canAccess(user, action, resource = null) {
  if (!user?.role) return false;
  const perms = PERMISSIONS[user.role] ?? [];
  if (!perms.includes(action)) return false;
  // Additional resource-level checks
  if (action === "delete" && resource?.ownerId !== user.id && user.role !== "admin")
    return false;
  if (resource?.isPrivate && user.role === "guest") return false;
  return true;
}

const alice = { id: 1, name: "Alice", role: "admin" };
const bob   = { id: 2, name: "Bob",   role: "editor" };
const carol = { id: 3, name: "Carol", role: "viewer" };
const res   = { id: 10, ownerId: 2, isPrivate: false };

const checks = [
  [alice, "delete", res],
  [bob,   "delete", res],   // bob owns it but not admin
  [bob,   "write",  null],
  [carol, "write",  null],
  [carol, "read",   null],
  [null,  "read",   null],
];
for (const [user, action, resource] of checks) {
  const allowed = canAccess(user, action, resource);
  console.log(`${(user?.name ?? "null").padEnd(5)} ${action.padEnd(7)} → ${allowed ? "✅" : "❌"}`);
}

// H2: Decision tree evaluator
console.log("\n=== H2: Decision Tree ===");
function loanDecision(applicant) {
  const { age, income, creditScore, existingDebt, employmentYears } = applicant;

  if (age < 18) return { approved: false, reason: "Under age" };
  if (creditScore < 500) return { approved: false, reason: "Credit score too low" };
  if (income <= 0) return { approved: false, reason: "No income" };

  const debtToIncomeRatio = existingDebt / income;
  if (debtToIncomeRatio > 0.5) return { approved: false, reason: "Debt-to-income ratio too high" };

  // Score-based decision
  let score = 0;
  if (creditScore >= 750) score += 3;
  else if (creditScore >= 650) score += 2;
  else score += 1;

  if (income >= 80000) score += 3;
  else if (income >= 50000) score += 2;
  else score += 1;

  if (employmentYears >= 3) score += 2;
  else if (employmentYears >= 1) score += 1;

  const limit = score >= 7 ? 50000
              : score >= 5 ? 25000
              : score >= 3 ? 10000
              : 0;

  return limit > 0
    ? { approved: true,  limit, score, reason: "All criteria met" }
    : { approved: false, limit: 0, score, reason: "Score too low" };
}

const applicants = [
  { age: 17, income: 60000, creditScore: 700, existingDebt: 5000, employmentYears: 2 },
  { age: 30, income: 90000, creditScore: 780, existingDebt: 10000, employmentYears: 5 },
  { age: 25, income: 40000, creditScore: 610, existingDebt: 30000, employmentYears: 1 },
  { age: 45, income: 120000, creditScore: 800, existingDebt: 20000, employmentYears: 10 },
];

applicants.forEach((a, i) => {
  const result = loanDecision(a);
  console.log(`Applicant ${i+1}: ${result.approved ? "✅ APPROVED" : "❌ DENIED"} — ${result.reason}${result.limit ? ` (limit: $${result.limit.toLocaleString()})` : ""}`);
});
