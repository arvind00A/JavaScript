// ============================================================
// Section 21 — Projects (Hands-on)
// 5 complete mini-projects runnable in Node.js
// Run: node 21-projects.js
// ============================================================

// ═══════════════════════════════════════════════════════════
// PROJECT 1: CLI To-Do App
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  PROJECT 1: CLI To-Do App");
console.log("═".repeat(55));

class TodoApp {
  #todos  = [];
  #nextId = 1;

  add(text, priority = "medium") {
    const todo = {
      id:        this.#nextId++,
      text,
      priority,
      done:      false,
      createdAt: new Date().toISOString(),
      tags:      [],
    };
    this.#todos.push(todo);
    return todo;
  }

  toggle(id) {
    const t = this.#find(id);
    t.done = !t.done;
    t.doneAt = t.done ? new Date().toISOString() : null;
    return t;
  }

  remove(id) {
    const idx = this.#todos.findIndex(t => t.id === id);
    if (idx === -1) throw new Error(`Todo #${id} not found`);
    return this.#todos.splice(idx, 1)[0];
  }

  edit(id, text) {
    const t = this.#find(id);
    t.text = text;
    t.updatedAt = new Date().toISOString();
    return t;
  }

  addTag(id, tag) {
    const t = this.#find(id);
    if (!t.tags.includes(tag)) t.tags.push(tag);
    return t;
  }

  filter({ done, priority, tag } = {}) {
    return this.#todos.filter(t => {
      if (done      !== undefined && t.done !== done)           return false;
      if (priority  !== undefined && t.priority !== priority)   return false;
      if (tag       !== undefined && !t.tags.includes(tag))     return false;
      return true;
    });
  }

  sort(by = "id") {
    const order = { high: 0, medium: 1, low: 2 };
    const copy  = [...this.#todos];
    if (by === "priority")  copy.sort((a,b) => order[a.priority] - order[b.priority]);
    else if (by === "text") copy.sort((a,b) => a.text.localeCompare(b.text));
    else                    copy.sort((a,b) => a.id - b.id);
    return copy;
  }

  stats() {
    const total  = this.#todos.length;
    const done   = this.#todos.filter(t => t.done).length;
    const byPri  = { high:0, medium:0, low:0 };
    this.#todos.forEach(t => byPri[t.priority]++);
    return { total, done, pending: total-done, completion: total ? Math.round(done/total*100) : 0, byPri };
  }

  print(list = this.#todos) {
    if (!list.length) { console.log("  (no todos)"); return; }
    list.forEach(t => {
      const icon  = t.done ? "✅" : { high:"🔴", medium:"🟡", low:"🟢" }[t.priority];
      const tags  = t.tags.length ? ` [${t.tags.join(",")}]` : "";
      const done  = t.done ? " ~~" : "";
      console.log(`  ${icon} #${t.id} ${t.text}${done}${tags}`);
    });
  }

  #find(id) {
    const t = this.#todos.find(t => t.id === id);
    if (!t) throw new Error(`Todo #${id} not found`);
    return t;
  }
}

const todo = new TodoApp();
todo.add("Buy groceries",     "high");
todo.add("Read JS book",      "medium");
todo.add("Exercise",          "high");
todo.add("Call dentist",      "low");
todo.add("Write unit tests",  "medium");
todo.add("Deploy to prod",    "high");

todo.addTag(1, "personal"); todo.addTag(1, "urgent");
todo.addTag(2, "learning");
todo.addTag(5, "work"); todo.addTag(6, "work");

todo.toggle(1); todo.toggle(2);
todo.edit(4, "Call dentist — make appointment");

console.log("All todos:");
todo.print();
console.log("\nPending high-priority:");
todo.print(todo.filter({ done: false, priority: "high" }));
console.log("\nSorted by priority:");
todo.print(todo.sort("priority"));
console.log("\nStats:", todo.stats());
console.log("\nWork todos:");
todo.print(todo.filter({ tag: "work" }));

// ═══════════════════════════════════════════════════════════
// PROJECT 2: Quiz Engine
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  PROJECT 2: Quiz Engine");
console.log("═".repeat(55));

class QuizEngine {
  #questions;
  #current  = 0;
  #score    = 0;
  #answers  = [];
  #startTime;

  constructor(questions) {
    this.#questions = this.#shuffle([...questions]);
    this.#startTime = Date.now();
  }

  #shuffle(arr) {
    for (let i = arr.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  get hasNext()   { return this.#current < this.#questions.length; }
  get current()   { return this.#questions[this.#current]; }
  get progress()  { return `${this.#current+1}/${this.#questions.length}`; }

  answer(choice) {
    const q       = this.current;
    const correct = choice === q.answer;
    const record  = { question: q.text, choice, answer: q.answer, correct, explanation: q.explanation };
    this.#answers.push(record);
    if (correct) this.#score++;
    this.#current++;
    return { correct, explanation: q.explanation };
  }

  results() {
    const total    = this.#questions.length;
    const elapsed  = ((Date.now() - this.#startTime) / 1000).toFixed(1);
    const pct      = Math.round(this.#score / total * 100);
    const grade    = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
    return { score: this.#score, total, pct, grade, elapsed, answers: this.#answers };
  }
}

const jsQuiz = new QuizEngine([
  {
    text:  "What does `typeof null` return in JavaScript?",
    options: ["null","undefined","object","boolean"],
    answer: "object",
    explanation: "Historical bug in JS — typeof null returns 'object'",
  },
  {
    text:  "Which is the correct way to check if a value is NaN?",
    options: ["value === NaN","value == NaN","Number.isNaN(value)","isNaN(value)"],
    answer: "Number.isNaN(value)",
    explanation: "NaN !== NaN, so use Number.isNaN() for strict checking",
  },
  {
    text:  "What does `[] + {}` evaluate to?",
    options: ["{}","[object Object]","NaN","undefined"],
    answer: "[object Object]",
    explanation: "[] coerces to '' and {} coerces to '[object Object]'",
  },
  {
    text:  "Which scope does `let` have?",
    options: ["Function","Global","Block","Module"],
    answer: "Block",
    explanation: "let and const are block-scoped; var is function-scoped",
  },
  {
    text:  "What is the output of: `console.log(0.1 + 0.2 === 0.3)`?",
    options: ["true","false","NaN","undefined"],
    answer: "false",
    explanation: "Floating point arithmetic is not exact: 0.1+0.2 = 0.30000000000000004",
  },
]);

// Simulate answering
const answers = ["object","Number.isNaN(value)","[object Object]","Block","false"];
let q;
for (const ans of answers) {
  if (!jsQuiz.hasNext) break;
  q = jsQuiz.current;
  const { correct, explanation } = jsQuiz.answer(ans);
  console.log(`Q: ${q.text}`);
  console.log(`A: ${ans} — ${correct ? "✅ Correct" : "❌ Wrong"}`);
  if (!correct) console.log(`  💡 ${explanation}`);
  console.log();
}
const results = jsQuiz.results();
console.log(`📊 Score: ${results.score}/${results.total} (${results.pct}%) — Grade: ${results.grade} — Time: ${results.elapsed}s`);

// ═══════════════════════════════════════════════════════════
// PROJECT 3: Budget Tracker
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  PROJECT 3: Budget Tracker");
console.log("═".repeat(55));

class BudgetTracker {
  #transactions = [];
  #categories   = new Map();
  #budgets      = new Map();
  #nextId       = 1;

  addCategory(name, budget = Infinity) {
    this.#categories.set(name, { name, budget });
    if (budget !== Infinity) this.#budgets.set(name, budget);
    return this;
  }

  add(type, amount, category, description = "") {
    if (!["income","expense"].includes(type)) throw new Error("type must be income or expense");
    if (amount <= 0) throw new Error("amount must be positive");
    const tx = { id: this.#nextId++, type, amount, category, description,
                 date: new Date().toISOString() };
    this.#transactions.push(tx);
    return tx;
  }

  income(amount, category, desc)  { return this.add("income", amount, category, desc); }
  expense(amount, category, desc) { return this.add("expense", amount, category, desc); }

  remove(id) {
    const idx = this.#transactions.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Transaction not found");
    return this.#transactions.splice(idx, 1)[0];
  }

  get balance() {
    return this.#transactions.reduce((sum, t) =>
      t.type === "income" ? sum + t.amount : sum - t.amount, 0);
  }

  get totalIncome()  { return this.#transactions.filter(t => t.type==="income") .reduce((s,t) => s+t.amount, 0); }
  get totalExpenses(){ return this.#transactions.filter(t => t.type==="expense").reduce((s,t) => s+t.amount, 0); }

  byCategory() {
    return this.#transactions.reduce((acc, t) => {
      (acc[t.category] ??= { income:0, expense:0, transactions:[] });
      acc[t.category][t.type] += t.amount;
      acc[t.category].transactions.push(t);
      return acc;
    }, {});
  }

  budgetStatus() {
    const bycat = this.byCategory();
    const result = [];
    for (const [cat, budget] of this.#budgets) {
      const spent  = bycat[cat]?.expense ?? 0;
      const pct    = Math.round(spent / budget * 100);
      const status = pct >= 100 ? "🔴 OVER" : pct >= 80 ? "🟡 WARNING" : "🟢 OK";
      result.push({ category: cat, budget, spent, remaining: budget-spent, pct, status });
    }
    return result;
  }

  report() {
    const fmt = n => `$${n.toFixed(2)}`;
    console.log(`\n  💰 Balance:  ${fmt(this.balance)}`);
    console.log(`  📈 Income:   ${fmt(this.totalIncome)}`);
    console.log(`  📉 Expenses: ${fmt(this.totalExpenses)}`);
    console.log("\n  By Category:");
    for (const [cat, data] of Object.entries(this.byCategory())) {
      console.log(`    ${cat.padEnd(12)} in:${fmt(data.income).padStart(9)} out:${fmt(data.expense).padStart(9)}`);
    }
    console.log("\n  Budget Status:");
    this.budgetStatus().forEach(b =>
      console.log(`    ${b.category.padEnd(12)} ${fmt(b.spent).padStart(9)}/${fmt(b.budget).padEnd(9)} ${b.pct}% ${b.status}`));
  }
}

const budget = new BudgetTracker();
budget
  .addCategory("Food",          500)
  .addCategory("Transport",     200)
  .addCategory("Entertainment", 150)
  .addCategory("Salary")
  .addCategory("Freelance");

budget.income( 3500, "Salary",       "Monthly salary");
budget.income(  800, "Freelance",    "Web project");
budget.expense( 120, "Food",         "Groceries");
budget.expense(  45, "Food",         "Restaurant");
budget.expense(  60, "Food",         "Supermarket");
budget.expense( 350, "Food",         "Weekly groceries");
budget.expense(  80, "Transport",    "Fuel");
budget.expense(  35, "Transport",    "Bus pass");
budget.expense( 200, "Entertainment","Concert tickets");
budget.expense(  40, "Entertainment","Streaming");

budget.report();

// ═══════════════════════════════════════════════════════════
// PROJECT 4: Text Analyser
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  PROJECT 4: Text Analyser");
console.log("═".repeat(55));

class TextAnalyser {
  #text;
  #words;

  constructor(text) {
    this.#text  = text;
    this.#words = text.toLowerCase().match(/\b[a-z']+\b/g) ?? [];
  }

  get charCount()        { return this.#text.length; }
  get charNoSpaces()     { return this.#text.replace(/\s/g, "").length; }
  get wordCount()        { return this.#words.length; }
  get sentenceCount()    { return (this.#text.match(/[.!?]+/g) ?? []).length; }
  get paragraphCount()   { return this.#text.split(/\n\s*\n/).filter(Boolean).length; }
  get avgWordLength()    { return this.#words.reduce((s,w) => s+w.length,0) / this.wordCount; }
  get avgWordsPerSentence() { return this.wordCount / this.sentenceCount; }

  wordFrequency(top = 10, { excludeStopWords = true } = {}) {
    const STOP = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","is","was","are","were","be","been","have","has","had","do","does","did","it","its","that","this","these","those","i","you","he","she","we","they","my","your","his","her","our","their"]);
    const freq = {};
    this.#words.forEach(w => {
      if (excludeStopWords && STOP.has(w)) return;
      freq[w] = (freq[w] ?? 0) + 1;
    });
    return Object.entries(freq)
      .sort((a,b) => b[1]-a[1])
      .slice(0, top)
      .map(([word, count]) => ({ word, count, pct: +(count/this.wordCount*100).toFixed(1) }));
  }

  longestWords(n = 5) {
    return [...new Set(this.#words)]
      .sort((a,b) => b.length-a.length)
      .slice(0, n);
  }

  readingTime(wpm = 200) {
    const mins = this.wordCount / wpm;
    if (mins < 1) return `${Math.round(mins * 60)} seconds`;
    return `${Math.round(mins)} minute${mins >= 2 ? "s" : ""}`;
  }

  // Flesch–Kincaid readability (approximate)
  readabilityScore() {
    const syllables = this.#words.reduce((s,w) => s + this.#countSyllables(w), 0);
    const score = 206.835
      - 1.015  * (this.wordCount / this.sentenceCount)
      - 84.6   * (syllables / this.wordCount);
    const clamped = Math.max(0, Math.min(100, score));
    const level   = clamped >= 90 ? "Very Easy" : clamped >= 70 ? "Easy"
                  : clamped >= 50 ? "Moderate"  : clamped >= 30 ? "Difficult" : "Very Difficult";
    return { score: +clamped.toFixed(1), level };
  }

  #countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g,"");
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
    const m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  report() {
    console.log(`  Characters:     ${this.charCount} (${this.charNoSpaces} no spaces)`);
    console.log(`  Words:          ${this.wordCount}`);
    console.log(`  Sentences:      ${this.sentenceCount}`);
    console.log(`  Avg word len:   ${this.avgWordLength.toFixed(1)} chars`);
    console.log(`  Avg sent len:   ${this.avgWordsPerSentence.toFixed(1)} words`);
    console.log(`  Reading time:   ${this.readingTime()}`);
    const { score, level } = this.readabilityScore();
    console.log(`  Readability:    ${score} (${level})`);
    console.log(`\n  Top 5 words:`);
    this.wordFrequency(5).forEach(({ word, count, pct }) =>
      console.log(`    "${word}": ${count}× (${pct}%)`));
    console.log(`\n  Longest words: ${this.longestWords(5).join(", ")}`);
  }
}

const sampleText = `
JavaScript is a lightweight, interpreted, multi-paradigm programming language.
It is one of the core technologies of the World Wide Web, alongside HTML and CSS.
JavaScript engines were originally used only in web browsers, but are now core components of servers and various applications.
The ECMAScript standard governs JavaScript and modern browsers support ES2015 and newer features.
Asynchronous programming with Promises and async/await has transformed how developers handle complex workflows.
Closures, prototypes, and the event loop are fundamental concepts every JavaScript developer must understand.
`.trim();

const analyser = new TextAnalyser(sampleText);
analyser.report();

// ═══════════════════════════════════════════════════════════
// PROJECT 5: Mini State Management (like Redux)
// ═══════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(55));
console.log("  PROJECT 5: Mini State Manager (Redux-like)");
console.log("═".repeat(55));

// Action types
const ACTIONS = {
  ADD_ITEM:     "ADD_ITEM",
  REMOVE_ITEM:  "REMOVE_ITEM",
  UPDATE_QTY:   "UPDATE_QTY",
  APPLY_COUPON: "APPLY_COUPON",
  CLEAR_CART:   "CLEAR_CART",
};

// Action creators
const addItem    = (product, qty=1) => ({ type: ACTIONS.ADD_ITEM,    payload: { product, qty } });
const removeItem = (id)             => ({ type: ACTIONS.REMOVE_ITEM, payload: { id } });
const updateQty  = (id, qty)        => ({ type: ACTIONS.UPDATE_QTY,  payload: { id, qty } });
const applyCoupon = code            => ({ type: ACTIONS.APPLY_COUPON,payload: { code } });
const clearCart  = ()               => ({ type: ACTIONS.CLEAR_CART });

// Reducer — pure function (state, action) → newState
const COUPONS = { SAVE10: 0.10, SAVE20: 0.20, HALF: 0.50 };
function cartReducer(state = { items:[], discount:0, coupon:null }, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const { product, qty } = action.payload;
      const existing = state.items.find(i => i.id === product.id);
      const items = existing
        ? state.items.map(i => i.id===product.id ? {...i, qty: i.qty+qty} : i)
        : [...state.items, { ...product, qty }];
      return { ...state, items };
    }
    case ACTIONS.REMOVE_ITEM:
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case ACTIONS.UPDATE_QTY: {
      const { id, qty } = action.payload;
      if (qty <= 0) return { ...state, items: state.items.filter(i => i.id !== id) };
      return { ...state, items: state.items.map(i => i.id===id ? {...i,qty} : i) };
    }
    case ACTIONS.APPLY_COUPON: {
      const { code } = action.payload;
      const discount = COUPONS[code.toUpperCase()] ?? 0;
      return { ...state, discount, coupon: discount > 0 ? code : null };
    }
    case ACTIONS.CLEAR_CART:
      return { items:[], discount:0, coupon:null };
    default:
      return state;
  }
}

// Store
function createStore(reducer, initialState) {
  let state      = initialState ?? reducer(undefined, { type: "@@INIT" });
  let listeners  = [];
  const history  = [];

  return {
    getState()          { return { ...state }; },
    dispatch(action) {
      const prev = state;
      state = reducer(state, action);
      history.push({ action, prev, next: state, time: Date.now() });
      listeners.forEach(fn => fn(state, prev));
      return action;
    },
    subscribe(fn)       { listeners.push(fn); return () => { listeners = listeners.filter(l => l!==fn); }; },
    getHistory()        { return [...history]; },
    // Computed selectors
    get subtotal()      { return state.items.reduce((s,i) => s+i.price*i.qty, 0); },
    get total()         {
      const sub = state.items.reduce((s,i) => s+i.price*i.qty, 0);
      return sub * (1 - state.discount);
    },
    get itemCount()     { return state.items.reduce((s,i) => s+i.qty, 0); },
  };
}

const store = createStore(cartReducer);

// Subscribe to state changes
const unsub = store.subscribe((state, prev) => {
  const prevCount = prev.items.reduce((s,i) => s+i.qty, 0);
  const newCount  = state.items.reduce((s,i) => s+i.qty, 0);
  if (newCount !== prevCount)
    console.log(`  🛒 Cart updated: ${newCount} items, total $${store.total.toFixed(2)}`);
});

// Dispatch actions
store.dispatch(addItem({ id:1, name:"Laptop",  price:999  }, 1));
store.dispatch(addItem({ id:2, name:"Mouse",   price:29   }, 2));
store.dispatch(addItem({ id:3, name:"Keyboard",price:79   }, 1));
store.dispatch(addItem({ id:1, name:"Laptop",  price:999  }, 1));  // qty increases
store.dispatch(updateQty(2, 3));
store.dispatch(applyCoupon("SAVE20"));
store.dispatch(removeItem(3));

const state = store.getState();
console.log("\n  Final Cart:");
state.items.forEach(i => console.log(`    ${i.name.padEnd(10)} x${i.qty} = $${(i.price*i.qty).toFixed(2)}`));
console.log(`  Coupon:   ${state.coupon ?? "none"} (${state.discount*100}% off)`);
console.log(`  Subtotal: $${store.subtotal.toFixed(2)}`);
console.log(`  Total:    $${store.total.toFixed(2)}`);
console.log(`  History:  ${store.getHistory().length} actions`);
unsub();  // unsubscribe
