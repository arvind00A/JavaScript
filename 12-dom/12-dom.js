// ============================================================
// Section 12 — DOM (Document Object Model)
// NOTE: Run this in a browser — open index.html below
//       Or paste into browser DevTools console
// ============================================================

// ── BROWSER DEMO FILE ──────────────────────────────────────
// Create index.html and open it in a browser:

const HTML_DEMO = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DOM Practice</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: auto; }
    .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 0.5rem 0; }
    .highlight { background: #fef9c3; }
    .hidden { display: none; }
    button { padding: 0.4rem 1rem; margin: 0.2rem; cursor: pointer; }
    #output { background: #f1f5f9; padding: 1rem; border-radius: 6px; min-height: 60px; }
    .todo-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem; }
    .todo-item.done span { text-decoration: line-through; color: #999; }
  </style>
</head>
<body>
  <h1>DOM Practice</h1>

  <section id="s1">
    <h2>Section 1 — Selectors</h2>
    <p id="para1" class="text-para">First paragraph</p>
    <p id="para2" class="text-para">Second paragraph</p>
    <div class="card" data-id="1">Card 1</div>
    <div class="card" data-id="2">Card 2</div>
    <button onclick="runSelectors()">Run Selectors</button>
  </section>

  <section id="s2">
    <h2>Section 2 — Manipulation</h2>
    <p id="target">Change me!</p>
    <button onclick="changeText()">Change Text</button>
    <button onclick="changeStyle()">Change Style</button>
    <button onclick="toggleClass()">Toggle Highlight</button>
  </section>

  <section id="s3">
    <h2>Section 3 — Create & Delete</h2>
    <ul id="list"></ul>
    <button onclick="addItem()">Add Item</button>
    <button onclick="removeItem()">Remove Last</button>
    <button onclick="clearList()">Clear All</button>
  </section>

  <section id="s4">
    <h2>Section 4 — To-Do App</h2>
    <input type="text" id="todo-input" placeholder="Add a task..." style="padding:0.4rem;width:250px">
    <button onclick="addTodo()">Add</button>
    <div id="todo-list"></div>
    <p id="todo-count"></p>
  </section>

  <div id="output">Output will appear here...</div>

  <script>
// ── E1: Selectors ──────────────────────────────────────────
function runSelectors() {
  const output = [];
  output.push("getElementById: " + document.getElementById("para1").textContent);
  output.push("querySelector: " + document.querySelector(".card").textContent);
  output.push("querySelectorAll count: " + document.querySelectorAll(".card").length);
  output.push("data attribute: " + document.querySelector("[data-id='2']").dataset.id);
  // Traversal
  const section = document.getElementById("s1");
  output.push("firstElementChild: " + section.firstElementChild.tagName);
  output.push("children count: " + section.children.length);
  log(output.join("\\n"));
}

// ── E2: Manipulation ───────────────────────────────────────
let changeCount = 0;
function changeText() {
  const el = document.getElementById("target");
  el.textContent = "Changed! (count: " + ++changeCount + ")";
}
function changeStyle() {
  const el = document.getElementById("target");
  el.style.color = ["red","blue","green","purple"][changeCount % 4];
  el.style.fontSize = "1.2rem";
  el.style.fontWeight = "bold";
}
function toggleClass() {
  document.getElementById("target").classList.toggle("highlight");
}

// ── E3: Create & Delete ────────────────────────────────────
let itemCount = 0;
function addItem() {
  const li = document.createElement("li");
  li.textContent = "Item " + ++itemCount;
  li.style.cursor = "pointer";
  li.addEventListener("click", function() { this.classList.toggle("highlight"); });
  document.getElementById("list").appendChild(li);
  log("Added: Item " + itemCount);
}
function removeItem() {
  const list = document.getElementById("list");
  if (list.lastElementChild) { list.lastElementChild.remove(); log("Removed last item"); }
}
function clearList() { document.getElementById("list").innerHTML = ""; log("List cleared"); }

// ── E4 & M1: To-Do App ─────────────────────────────────────
let todos = [];
let nextId = 1;

function addTodo() {
  const input = document.getElementById("todo-input");
  const text = input.value.trim();
  if (!text) return;
  todos.push({ id: nextId++, text, done: false });
  input.value = "";
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) { todo.done = !todo.done; renderTodos(); }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

function renderTodos() {
  const container = document.getElementById("todo-list");
  const count     = document.getElementById("todo-count");
  container.innerHTML = "";
  todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo-item" + (todo.done ? " done" : "");
    div.innerHTML = \`
      <input type="checkbox" \${todo.done ? "checked" : ""}
             onchange="toggleTodo(\${todo.id})">
      <span>\${todo.text}</span>
      <button onclick="deleteTodo(\${todo.id})" style="margin-left:auto">✕</button>
    \`;
    container.appendChild(div);
  });
  const done = todos.filter(t => t.done).length;
  count.textContent = \`\${done}/\${todos.length} completed\`;
}

function log(msg) {
  document.getElementById("output").textContent = msg;
}
  </script>
</body>
</html>
`;

// Write the HTML file
const fs = require("fs");
const path = require("path");
const htmlPath = path.join(__dirname, "12-dom-demo.html");
fs.writeFileSync(htmlPath, HTML_DEMO);
console.log("✅ Created 12-dom-demo.html — open this file in a browser!");
console.log("   Path:", htmlPath);

// ── NODE.JS DOM SIMULATION ─────────────────────────────────
// Demonstrates DOM concepts without a browser using plain objects

console.log("\n=== DOM Concepts (Node.js simulation) ===");

// Simulated DOM tree
class MockElement {
  constructor(tag, attrs = {}) {
    this.tagName    = tag.toUpperCase();
    this.attributes = { ...attrs };
    this.children   = [];
    this.textContent = "";
    this.classList  = new Set(attrs.class ? attrs.class.split(" ") : []);
    this.style      = {};
    this._listeners = {};
  }

  setAttribute(name, val) { this.attributes[name] = val; }
  getAttribute(name)      { return this.attributes[name]; }
  hasAttribute(name)      { return name in this.attributes; }

  appendChild(child) { this.children.push(child); child.parentElement = this; return child; }
  remove()           { const p = this.parentElement; if(p) p.children = p.children.filter(c=>c!==this); }
  querySelector(sel) { return this._query(sel); }
  querySelectorAll(sel) { const r=[]; this._queryAll(sel,r); return r; }

  _query(sel) {
    for (const c of this.children) {
      if (this._matches(c, sel)) return c;
      const found = c._query?.(sel);
      if (found) return found;
    }
    return null;
  }
  _queryAll(sel, res) {
    for (const c of this.children) {
      if (this._matches(c, sel)) res.push(c);
      c._queryAll?.(sel, res);
    }
  }
  _matches(el, sel) {
    if (sel.startsWith("#")) return el.attributes.id === sel.slice(1);
    if (sel.startsWith(".")) return el.classList.has(sel.slice(1));
    return el.tagName === sel.toUpperCase();
  }

  addEventListener(event, fn) { (this._listeners[event] ??= []).push(fn); }
  dispatchEvent(event)        { this._listeners[event.type]?.forEach(fn => fn(event)); }
}

// Build a small DOM tree
const body     = new MockElement("body");
const header   = new MockElement("h1", { id:"title" });
const list     = new MockElement("ul", { id:"list" });
const item1    = new MockElement("li", { class:"item active", id:"item1" });
const item2    = new MockElement("li", { class:"item", id:"item2" });

header.textContent = "Hello DOM!";
item1.textContent  = "First item";
item2.textContent  = "Second item";

body.appendChild(header);
body.appendChild(list);
list.appendChild(item1);
list.appendChild(item2);

// Query
console.log("getElementById simulation:", body.querySelector("#title")?.textContent);
console.log("querySelector .item:",       list.querySelector(".item")?.textContent);
console.log("querySelectorAll count:",    list.querySelectorAll(".item").length);

// Modify
item1.classList.add("selected");
item1.style.color = "blue";
console.log("classList after add:", [...item1.classList]);
console.log("style.color:", item1.style.color);

// Add element
const item3 = new MockElement("li", { class:"item" });
item3.textContent = "Third item";
list.appendChild(item3);
console.log("children after append:", list.children.length);

// Remove element
item2.remove();
console.log("children after remove:", list.children.length);

// Events
item1.addEventListener("click", e => console.log("item1 clicked:", e.detail));
item1.dispatchEvent({ type: "click", detail: "from simulation" });
