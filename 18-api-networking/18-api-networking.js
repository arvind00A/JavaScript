// ============================================================
// Section 18 — API & Networking
// fetch · JSON · XMLHttpRequest · Error handling
// Run: node 18-api-networking.js
// (Uses JSONPlaceholder public API — requires internet)
// ============================================================

// ── SETUP ─────────────────────────────────────────────────
// Node 18+ has native fetch. For older Node:
// npm install node-fetch  then:  import fetch from "node-fetch";

const BASE_URL = "https://jsonplaceholder.typicode.com";

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── EASY ──────────────────────────────────────────────────

// E1: Basic GET with fetch
async function e1_basicGet() {
  console.log("=== E1: Basic GET ===");
  try {
    const res  = await fetch(`${BASE_URL}/users/1`);
    const user = await res.json();
    console.log("User:", user.name, "|", user.email);
    console.log("Status:", res.status, res.statusText);
    console.log("Headers:", res.headers.get("content-type"));
  } catch(e) {
    console.log("Network error (offline?):", e.message);
  }
}

// E2: GET list
async function e2_getList() {
  console.log("\n=== E2: GET List ===");
  try {
    const res   = await fetch(`${BASE_URL}/posts?_limit=5`);
    const posts = await res.json();
    posts.forEach(p => console.log(`  [${p.id}] ${p.title.slice(0, 40)}...`));
  } catch(e) {
    console.log("Error:", e.message);
  }
}

// E3: JSON operations
function e3_json() {
  console.log("\n=== E3: JSON Operations ===");
  const data = {
    name:      "Alice",
    age:       30,
    scores:    [95, 87, 92],
    address:   { city: "NYC", zip: "10001" },
    createdAt: new Date(),
    fn:        function() {},   // functions are ignored in JSON
    sym:       Symbol("id"),    // symbols are ignored
    undef:     undefined,       // undefined is ignored
  };

  // Stringify
  const json   = JSON.stringify(data);
  const pretty = JSON.stringify(data, null, 2);
  const pick   = JSON.stringify(data, ["name","age","scores"]);  // whitelist

  console.log("json length:", json.length);
  console.log("pretty preview:", pretty.slice(0, 100) + "...");
  console.log("pick (name,age,scores):", pick);

  // Parse
  const parsed = JSON.parse(json);
  console.log("parsed name:", parsed.name);
  console.log("fn after JSON:", parsed.fn);      // undefined — stripped
  console.log("date after JSON:", parsed.createdAt); // string — not Date obj!

  // Reviver to restore types
  const withReviver = JSON.parse(json, (key, val) =>
    key === "createdAt" ? new Date(val) : val
  );
  console.log("date with reviver:", withReviver.createdAt instanceof Date);
}

// ── MODERATE ──────────────────────────────────────────────

// M1: Full CRUD with fetch
async function m1_crud() {
  console.log("\n=== M1: CRUD Operations ===");

  // CREATE (POST)
  try {
    const newPost = { title: "My Post", body: "Content here", userId: 1 };
    const res     = await fetch(`${BASE_URL}/posts`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(newPost),
    });
    const created = await res.json();
    console.log("POST created:", { id: created.id, title: created.title });

    // UPDATE (PUT — replace whole resource)
    const putRes = await fetch(`${BASE_URL}/posts/1`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...newPost, id: 1 }),
    });
    const updated = await putRes.json();
    console.log("PUT updated:", { id: updated.id, title: updated.title });

    // PATCH (partial update)
    const patchRes = await fetch(`${BASE_URL}/posts/1`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ title: "Updated Title Only" }),
    });
    const patched = await patchRes.json();
    console.log("PATCH patched:", { id: patched.id, title: patched.title });

    // DELETE
    const delRes = await fetch(`${BASE_URL}/posts/1`, { method: "DELETE" });
    console.log("DELETE status:", delRes.status);   // 200
  } catch(e) {
    console.log("CRUD Error:", e.message);
  }
}

// M2: API wrapper with error handling
async function m2_apiWrapper() {
  console.log("\n=== M2: API Wrapper ===");

  class ApiClient {
    #baseUrl;
    #defaultHeaders;
    #timeout;

    constructor(baseUrl, { headers = {}, timeout = 5000 } = {}) {
      this.#baseUrl         = baseUrl;
      this.#defaultHeaders  = { "Content-Type": "application/json", ...headers };
      this.#timeout         = timeout;
    }

    async #request(path, options = {}) {
      const url = `${this.#baseUrl}${path}`;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.#timeout);

      try {
        const res = await fetch(url, {
          ...options,
          headers: { ...this.#defaultHeaders, ...options.headers },
          signal:  controller.signal,
        });
        clearTimeout(timer);

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status}: ${res.statusText}${body ? " — " + body.slice(0,100) : ""}`);
        }
        return res.status === 204 ? null : res.json();
      } catch(err) {
        clearTimeout(timer);
        if (err.name === "AbortError") throw new Error(`Request timed out after ${this.#timeout}ms`);
        throw err;
      }
    }

    get(path, params)      {
      const qs = params ? "?" + new URLSearchParams(params) : "";
      return this.#request(`${path}${qs}`);
    }
    post(path, body)       { return this.#request(path, { method:"POST",   body: JSON.stringify(body) }); }
    put(path, body)        { return this.#request(path, { method:"PUT",    body: JSON.stringify(body) }); }
    patch(path, body)      { return this.#request(path, { method:"PATCH",  body: JSON.stringify(body) }); }
    delete(path)           { return this.#request(path, { method:"DELETE" }); }
  }

  const api = new ApiClient(BASE_URL);

  try {
    const users = await api.get("/users", { _limit: 3 });
    console.log("Users:", users.map(u => u.username).join(", "));

    const post = await api.post("/posts", { title: "Test", body: "Body", userId: 1 });
    console.log("Created post id:", post.id);
  } catch(e) {
    console.log("ApiClient error:", e.message);
  }
}

// M3: Parallel data fetching
async function m3_parallel() {
  console.log("\n=== M3: Parallel Fetching ===");
  try {
    const start = Date.now();
    const [users, posts, todos] = await Promise.all([
      fetch(`${BASE_URL}/users?_limit=3`).then(r => r.json()),
      fetch(`${BASE_URL}/posts?_limit=3`).then(r => r.json()),
      fetch(`${BASE_URL}/todos?_limit=3`).then(r => r.json()),
    ]);
    console.log(`Fetched in ${Date.now()-start}ms:`);
    console.log("  users:", users.length, "| posts:", posts.length, "| todos:", todos.length);

    // Join: get each user's todos
    const [allUsers, allTodos] = await Promise.all([
      fetch(`${BASE_URL}/users`).then(r => r.json()),
      fetch(`${BASE_URL}/todos`).then(r => r.json()),
    ]);
    const todosByUser = allTodos.reduce((acc, t) => {
      (acc[t.userId] ??= []).push(t);
      return acc;
    }, {});
    allUsers.slice(0, 3).forEach(u => {
      const done = (todosByUser[u.id] ?? []).filter(t => t.completed).length;
      const total = (todosByUser[u.id] ?? []).length;
      console.log(`  ${u.name}: ${done}/${total} todos done`);
    });
  } catch(e) {
    console.log("Error:", e.message);
  }
}

// ── HARD ──────────────────────────────────────────────────

// H1: Request deduplication + caching
async function h1_cache() {
  console.log("\n=== H1: Request Cache + Deduplication ===");

  class SmartFetch {
    #cache   = new Map();
    #pending = new Map();
    #ttl;

    constructor(ttl = 30000) { this.#ttl = ttl; }

    async get(url) {
      // Check cache
      const cached = this.#cache.get(url);
      if (cached && Date.now() < cached.expiresAt) {
        console.log(`  [CACHE HIT] ${url}`);
        return cached.data;
      }

      // Deduplicate in-flight requests
      if (this.#pending.has(url)) {
        console.log(`  [DEDUPED]   ${url}`);
        return this.#pending.get(url);
      }

      console.log(`  [FETCH]     ${url}`);
      const promise = fetch(url).then(r => r.json()).then(data => {
        this.#cache.set(url, { data, expiresAt: Date.now() + this.#ttl });
        this.#pending.delete(url);
        return data;
      });

      this.#pending.set(url, promise);
      return promise;
    }

    invalidate(url) { this.#cache.delete(url); }
    clear()         { this.#cache.clear(); }
    get size()      { return this.#cache.size; }
  }

  try {
    const fetcher = new SmartFetch(5000);
    const url     = `${BASE_URL}/users/1`;

    // Three concurrent requests to same URL — only ONE actual fetch
    const [r1, r2, r3] = await Promise.all([
      fetcher.get(url),
      fetcher.get(url),   // deduped
      fetcher.get(url),   // deduped
    ]);
    console.log("All same?", r1.id === r2.id && r2.id === r3.id);
    console.log("Cache size:", fetcher.size);

    // Second call — from cache
    await fetcher.get(url);
    console.log("After second call, cache size:", fetcher.size);
  } catch(e) {
    console.log("Error:", e.message);
  }
}

// H2: Streaming data simulation + abort
async function h2_streaming() {
  console.log("\n=== H2: Streaming + Abort ===");
  // Simulate a stream of events
  async function* streamData(count, interval) {
    for (let i = 1; i <= count; i++) {
      await delay(interval);
      yield { event: `event-${i}`, timestamp: Date.now(), data: Math.random().toFixed(3) };
    }
  }

  const results = [];
  for await (const event of streamData(5, 30)) {
    results.push(event);
    process.stdout.write(`  ${event.event} `);
  }
  console.log("\nStreamed:", results.length, "events");

  // Abort controller with fetch
  async function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return res.json();
    } catch(e) {
      clearTimeout(id);
      if (e.name === "AbortError") return { error: `Aborted after ${ms}ms` };
      return { error: e.message };
    }
  }

  const result = await fetchWithTimeout(`${BASE_URL}/users/1`, 5000);
  console.log("fetch result:", result?.name ?? result?.error);
}

// Run all
(async () => {
  await e1_basicGet();
  await e2_getList();
  e3_json();
  await m1_crud();
  await m2_apiWrapper();
  await m3_parallel();
  await h1_cache();
  await h2_streaming();
})().catch(console.error);
