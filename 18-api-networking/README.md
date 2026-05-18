# 🌍 Section 18 — API & Networking

---

## XMLHttpRequest (Old Way)
```js
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.example.com/data");
xhr.onload = function() {
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  }
};
xhr.onerror = () => console.error("Network error");
xhr.send();
```

## fetch API (Modern)
```js
// GET request
const response = await fetch("https://api.example.com/users");
const data = await response.json();

// POST request
const res = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alice", age: 30 })
});

// Full fetch with error handling
async function apiCall(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
```

## Working with JSON
```js
// Parse JSON string → JS object
const obj = JSON.parse('{"name":"Alice","age":30}');

// Stringify JS object → JSON string
const json = JSON.stringify(obj);
const pretty = JSON.stringify(obj, null, 2);    // pretty print

// Stringify with replacer
JSON.stringify(obj, ["name"]);                  // only include "name"
JSON.stringify(obj, (key, val) =>
  typeof val === "number" ? undefined : val);   // exclude numbers
```

---
