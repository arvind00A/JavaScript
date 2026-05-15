// ============================================================
// Section 13 — Events
// Run: node 13-events.js  (Node simulation)
// Open: 13-events-demo.html in browser for full demo
// ============================================================

// ── BROWSER HTML DEMO ─────────────────────────────────────
const fs   = require("fs");
const path = require("path");

fs.writeFileSync(path.join(__dirname, "13-events-demo.html"), `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Events Practice</title>
<style>
  body { font-family: Arial, sans-serif; padding: 2rem; max-width: 800px; margin: auto; }
  .box { width:150px; height:150px; background:#6366f1; color:#fff;
         display:flex; align-items:center; justify-content:center;
         cursor:pointer; border-radius:8px; user-select:none; font-size:1.2rem; }
  .parent { background:#e0e7ff; padding:1rem; border-radius:8px; cursor:pointer; }
  .child  { background:#6366f1; color:#fff; padding:0.5rem 1rem;
            border-radius:4px; display:inline-block; cursor:pointer; margin:0.5rem; }
  #log    { background:#f1f5f9; padding:1rem; border-radius:6px;
            height:180px; overflow-y:auto; font-family:monospace; font-size:0.85rem; }
  button  { padding:0.4rem 1rem; margin:0.3rem; cursor:pointer; }
  input   { padding:0.4rem; width:200px; }
  .kbd    { background:#e2e8f0; padding:0.1rem 0.4rem; border-radius:3px;
            font-family:monospace; border:1px solid #cbd5e1; }
</style>
</head>
<body>
<h1>🖱️ Events Demo</h1>

<section>
  <h2>Mouse Events</h2>
  <div class="box" id="mouseBox">Hover / Click</div>
  <p id="mouseOutput">Move mouse over the box...</p>
</section>

<section>
  <h2>Keyboard Events</h2>
  <input type="text" id="keyInput" placeholder="Type here...">
  <p>Last key: <kbd id="keyDisplay" class="kbd">—</kbd></p>
  <p id="keyOutput"></p>
</section>

<section>
  <h2>Event Bubbling Demo</h2>
  <div class="parent" id="parent">
    Parent div
    <span class="child" id="child">Child span</span>
  </div>
  <label><input type="checkbox" id="stopBubble"> Stop propagation</label>
  <p id="bubbleOutput"></p>
</section>

<section>
  <h2>Event Delegation — Dynamic List</h2>
  <ul id="delegationList" style="padding:0;list-style:none">
    <li>Item 1 <button data-action="delete" style="float:right;color:red">✕</button></li>
    <li>Item 2 <button data-action="delete" style="float:right;color:red">✕</button></li>
  </ul>
  <button id="addDelegationItem">+ Add Item</button>
</section>

<section>
  <h2>Form Events</h2>
  <form id="sampleForm">
    <input type="text" id="username" placeholder="Username" required>
    <input type="email" id="email" placeholder="Email" required>
    <button type="submit">Submit</button>
  </form>
  <p id="formOutput"></p>
</section>

<h3>Event Log</h3>
<div id="log"></div>
<button onclick="document.getElementById('log').innerHTML=''">Clear Log</button>

<script>
const log = (msg) => {
  const el = document.getElementById("log");
  const line = document.createElement("div");
  line.textContent = new Date().toLocaleTimeString() + " → " + msg;
  el.prepend(line);
};

// Mouse events
const box = document.getElementById("mouseBox");
const mouseOut = document.getElementById("mouseOutput");
box.addEventListener("mouseenter", () => { box.style.background = "#4f46e5"; mouseOut.textContent = "Mouse entered!"; });
box.addEventListener("mouseleave", () => { box.style.background = "#6366f1"; mouseOut.textContent = "Mouse left!"; });
box.addEventListener("click",      () => { log("Box: click"); mouseOut.textContent = "Clicked!"; });
box.addEventListener("dblclick",   () => { log("Box: dblclick"); });
box.addEventListener("contextmenu", e => { e.preventDefault(); log("Box: right-click"); });

// Keyboard events
const keyInput = document.getElementById("keyInput");
keyInput.addEventListener("keydown", e => {
  document.getElementById("keyDisplay").textContent = e.key;
  document.getElementById("keyOutput").textContent =
    \`key=\${e.key}, code=\${e.code}, ctrl=\${e.ctrlKey}, shift=\${e.shiftKey}\`;
  if (e.key === "Enter") { log("Enter pressed: " + e.target.value); e.target.select(); }
  if (e.ctrlKey && e.key === "a") { e.preventDefault(); log("Ctrl+A intercepted"); }
});
keyInput.addEventListener("input", e => log("input: " + e.target.value));

// Bubbling
document.getElementById("parent").addEventListener("click", e => {
  document.getElementById("bubbleOutput").textContent += " ← PARENT";
  log("Parent clicked (bubbled from: " + e.target.id + ")");
});
document.getElementById("child").addEventListener("click", e => {
  document.getElementById("bubbleOutput").textContent = "CHILD";
  if (document.getElementById("stopBubble").checked) {
    e.stopPropagation();
    document.getElementById("bubbleOutput").textContent += " (propagation stopped)";
  }
  log("Child clicked");
});

// Event delegation
let itemCount = 2;
const delegList = document.getElementById("delegationList");
delegList.addEventListener("click", e => {
  if (e.target.dataset.action === "delete") {
    e.target.closest("li").remove();
    log("Item deleted via delegation");
  }
});
document.getElementById("addDelegationItem").addEventListener("click", () => {
  const li = document.createElement("li");
  li.innerHTML = \`Item \${++itemCount} <button data-action="delete" style="float:right;color:red">✕</button>\`;
  delegList.appendChild(li);
  log("Item added: " + itemCount);
});

// Form events
document.getElementById("sampleForm").addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const email    = document.getElementById("email").value;
  document.getElementById("formOutput").textContent =
    \`Submitted: \${username} / \${email}\`;
  log("Form submitted: " + username);
});

// Window events
window.addEventListener("resize", () => {
  log(\`Window resized: \${window.innerWidth}×\${window.innerHeight}\`);
});

log("Events demo ready!");
</script>
</body>
</html>`);
console.log("✅ Created 13-events-demo.html — open in browser!");

// ── NODE.JS EVENT SYSTEM SIMULATION ───────────────────────
console.log("\n=== Node.js: Custom EventEmitter ===");

class EventEmitter {
  #events = {};

  on(event, listener) {
    (this.#events[event] ??= []).push({ listener, once: false });
    return this;
  }

  once(event, listener) {
    (this.#events[event] ??= []).push({ listener, once: true });
    return this;
  }

  off(event, listener) {
    if (this.#events[event])
      this.#events[event] = this.#events[event].filter(e => e.listener !== listener);
    return this;
  }

  emit(event, ...args) {
    const listeners = this.#events[event] ?? [];
    this.#events[event] = listeners.filter(e => {
      e.listener(...args);
      return !e.once;
    });
    return this;
  }

  listenerCount(event) { return (this.#events[event] ?? []).length; }
  eventNames()         { return Object.keys(this.#events); }
}

// ── EASY ──────────────────────────────────────────────────

// E1: Basic on/emit
console.log("=== E1: Basic Events ===");
const emitter = new EventEmitter();

emitter.on("greet", name => console.log(`Hello, ${name}!`));
emitter.on("greet", name => console.log(`Hi there, ${name}!`));
emitter.emit("greet", "Alice");   // fires both listeners
emitter.emit("greet", "Bob");

// E2: once — fires only one time
console.log("\n=== E2: once ===");
const counter = new EventEmitter();
let loginCount = 0;
counter.once("login", user => console.log(`Welcome back, ${user}! (first time only)`));
counter.on  ("login", user => console.log(`User logged in: ${user} (count: ${++loginCount})`));
counter.emit("login", "Alice");   // both fire
counter.emit("login", "Alice");   // only 'on' fires
counter.emit("login", "Bob");

// E3: off — remove listener
console.log("\n=== E3: off ===");
const bus = new EventEmitter();
const handler = data => console.log("Received:", data);
bus.on("data", handler);
bus.emit("data", "first");    // fires
bus.off("data", handler);
bus.emit("data", "second");   // does NOT fire

// ── MODERATE ──────────────────────────────────────────────

// M1: Build a reactive store using events
console.log("\n=== M1: Reactive Store ===");
class Store extends EventEmitter {
  #state;

  constructor(initial) {
    super();
    this.#state = { ...initial };
  }

  get state() { return { ...this.#state }; }

  setState(patch) {
    const prev = { ...this.#state };
    this.#state = { ...this.#state, ...patch };
    const changed = Object.keys(patch).filter(k => patch[k] !== prev[k]);
    changed.forEach(key => this.emit(`change:${key}`, this.#state[key], prev[key]));
    if (changed.length) this.emit("change", this.#state, prev);
  }
}

const store = new Store({ count: 0, user: null, theme: "light" });

store.on("change:count", (newVal, oldVal) =>
  console.log(`  count changed: ${oldVal} → ${newVal}`));
store.on("change:theme", (newVal) =>
  console.log(`  theme changed to: ${newVal}`));
store.on("change", (state) =>
  console.log(`  state:`, JSON.stringify(state)));

store.setState({ count: 1 });
store.setState({ count: 2, theme: "dark" });
store.setState({ count: 2 });   // no change — no events fired

// M2: Event bubbling simulation (DOM-like)
console.log("\n=== M2: Event Bubbling Simulation ===");
class DOMNode extends EventEmitter {
  constructor(name) {
    super();
    this.name     = name;
    this.parent   = null;
    this.children = [];
  }

  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  dispatchEvent(event) {
    // Capturing phase (root → target)
    const path = [];
    let node = this;
    while (node.parent) { path.unshift(node.parent); node = node.parent; }
    path.push(this);

    // Bubbling phase (target → root)
    for (const n of path) {
      n.emit(event.type, { ...event, target: this, currentTarget: n, phase: "bubble" });
      if (event.stopped) break;
    }
  }
}

const doc  = new DOMNode("document");
const body = new DOMNode("body");
const div  = new DOMNode("div");
const btn  = new DOMNode("button");

doc.appendChild(body);
body.appendChild(div);
div.appendChild(btn);

doc.on("click",  e => console.log(`  document caught click (bubbled from ${e.target.name})`));
div.on("click",  e => { console.log(`  div caught click`); e.stopped = true; /* stop here */ });
btn.on("click",  e => console.log(`  button caught click directly`));

console.log("Clicking button (bubbles up):");
btn.dispatchEvent({ type: "click" });

// M3: Debounced events
console.log("\n=== M3: Debounced Event Handler ===");
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

function throttle(fn, ms) {
  let lastRun = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastRun >= ms) { lastRun = now; fn.apply(this, args); }
  };
}

const debouncedSearch = debounce(q => console.log("  Searching for:", q), 300);
const throttledScroll = throttle(pos => console.log("  Scroll position:", pos), 100);

// Simulate rapid events
["h","he","hel","hell","hello"].forEach((q, i) =>
  setTimeout(() => debouncedSearch(q), i * 50));     // only last fires after 300ms

[100,200,250,300,350,450,500].forEach(pos =>
  setTimeout(() => throttledScroll(pos), pos));       // throttled to 100ms intervals

// ── HARD ──────────────────────────────────────────────────

// H1: Full pub/sub system with namespaces and wildcards
console.log("\n=== H1: Pub/Sub with Namespaces ===");
class PubSub {
  #topics = {};

  subscribe(topic, fn) {
    (this.#topics[topic] ??= new Set()).add(fn);
    return () => this.#topics[topic]?.delete(fn);  // returns unsubscribe fn
  }

  publish(topic, data) {
    // Exact match
    this.#topics[topic]?.forEach(fn => fn(data));
    // Wildcard: "user.*" matches "user.login", "user.logout"
    Object.keys(this.#topics).forEach(t => {
      if (t.includes("*") && this.#matchWildcard(t, topic))
        this.#topics[t]?.forEach(fn => fn(data));
    });
  }

  #matchWildcard(pattern, topic) {
    const re = new RegExp("^" + pattern.replace(".", "\\.").replace("*", ".*") + "$");
    return re.test(topic);
  }
}

const pubsub = new PubSub();
const unsub1 = pubsub.subscribe("user.login",  d => console.log("  Login handler:", d.user));
const unsub2 = pubsub.subscribe("user.*",      d => console.log("  Wildcard user.*:", d));
pubsub.subscribe("order.created", d => console.log("  New order:", d.id));

pubsub.publish("user.login",   { user: "Alice" });
pubsub.publish("user.logout",  { user: "Alice" });
pubsub.publish("order.created",{ id: 42, total: 99.99 });

unsub1();  // unsubscribe login handler
pubsub.publish("user.login", { user: "Bob" });  // wildcard still fires, exact doesn't

// H2: Custom drag-and-drop event system (simulated)
console.log("\n=== H2: Drag-Drop Simulation ===");
class DragDropManager extends EventEmitter {
  #dragging = null;
  #zones    = new Map();

  registerZone(id, el) { this.#zones.set(id, el); }

  startDrag(itemId, fromZone) {
    this.#dragging = { itemId, fromZone, startTime: Date.now() };
    this.emit("dragstart", this.#dragging);
  }

  drop(toZone) {
    if (!this.#dragging) return;
    if (!this.#zones.has(toZone)) {
      this.emit("dropreject", { ...this.#dragging, toZone, reason: "Invalid zone" });
      return;
    }
    const event = { ...this.#dragging, toZone, duration: Date.now() - this.#dragging.startTime };
    this.emit("drop", event);
    this.emit(`drop:${toZone}`, event);
    this.#dragging = null;
  }

  cancel() {
    if (this.#dragging) { this.emit("dragcancel", this.#dragging); this.#dragging = null; }
  }
}

const dnd = new DragDropManager();
dnd.registerZone("todo",  {});
dnd.registerZone("doing", {});
dnd.registerZone("done",  {});

dnd.on("dragstart",    e => console.log(`  Drag started: item=${e.itemId} from=${e.fromZone}`));
dnd.on("drop",         e => console.log(`  Dropped: item=${e.itemId} → ${e.toZone}`));
dnd.on("drop:done",    e => console.log(`  🎉 Item ${e.itemId} marked as DONE!`));
dnd.on("dropreject",   e => console.log(`  ❌ Drop rejected: ${e.reason}`));
dnd.on("dragcancel",   e => console.log(`  Drag cancelled: item=${e.itemId}`));

dnd.startDrag("task-1", "todo");
dnd.drop("doing");

dnd.startDrag("task-2", "doing");
dnd.drop("done");

dnd.startDrag("task-3", "todo");
dnd.drop("invalid-zone");   // rejected

dnd.startDrag("task-4", "todo");
dnd.cancel();
