# 🎯 Section 21 — Projects (Hands-on)

---

## Project Ideas by Difficulty

### Beginner
1. **Calculator** — DOM manipulation, event handling, basic math
2. **To-Do List** — CRUD operations, localStorage
3. **Quiz App** — Arrays, objects, scoring logic
4. **Random Quote Generator** — Arrays, DOM update
5. **Color Flipper** — Math.random, DOM style change

### Intermediate
1. **Weather App** — fetch API, JSON, async/await
2. **Notes App with LocalStorage** — CRUD, persistence
3. **Budget Tracker** — Classes, DOM, data aggregation
4. **Infinite Scroll** — Intersection Observer, API
5. **Modal/Slider Components** — Event handling, CSS transitions

### Advanced
1. **Real-time Chat** — WebSockets
2. **Drag & Drop Kanban Board** — Drag events, complex state
3. **Custom JS Framework (mini)** — Prototypes, closures
4. **Virtual DOM** — Diffing algorithm, reconciliation
5. **State Management** — Observer pattern, reducers

### Key Patterns to Practice
```js
// 1. Module pattern
const app = (() => {
  let state = { count: 0 };
  return {
    increment() { state.count++; render(); },
    getState()  { return { ...state }; }  // immutable copy
  };
})();

// 2. Observer pattern (pub/sub)
class EventBus {
  #events = {};
  on(event, fn) { (this.#events[event] ??= []).push(fn); }
  emit(event, data) { this.#events[event]?.forEach(fn => fn(data)); }
  off(event, fn) { this.#events[event] = this.#events[event]?.filter(f=>f!==fn); }
}
```

---
