# ⏳ Section 17 — Asynchronous JavaScript

---

## Callbacks
```js
function fetchData(id, callback) {
  setTimeout(() => {
    const data = { id, name: "Alice" };
    callback(null, data);   // convention: (error, data)
  }, 1000);
}
fetchData(1, (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

## Callback Hell (Pyramid of Doom)
```js
// ❌ Hard to read and maintain
getUser(id, (err, user) => {
  getPosts(user.id, (err, posts) => {
    getComments(posts[0].id, (err, comments) => {
      getAuthor(comments[0].authorId, (err, author) => {
        console.log(author);   // buried 4 levels deep!
      });
    });
  });
});
```

## Promises
```js
// Create a promise
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) resolve("Data fetched!");
  else         reject(new Error("Failed!"));
});

// Consume
promise
  .then(data => console.log(data))     // on resolve
  .catch(err => console.error(err))    // on reject
  .finally(() => console.log("Done")); // always runs

// Promise chaining (fixes callback hell)
fetchUser(id)
  .then(user  => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(err => console.error(err));

// Promise combinators
Promise.all([p1, p2, p3])         // wait for ALL, fail-fast
Promise.allSettled([p1, p2, p3])  // wait for ALL (never rejects)
Promise.race([p1, p2, p3])        // first to settle wins
Promise.any([p1, p2, p3])         // first to RESOLVE wins
```

## async / await (ES2017)
```js
// async function always returns a Promise
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;       // re-throw to caller
  }
}

// Parallel execution (don't await sequentially if independent!)
async function loadAll() {
  // ❌ Sequential (slow — waits for each)
  const user  = await fetchUser(1);
  const posts = await fetchPosts(1);

  // ✅ Parallel (fast — both start at once)
  const [user2, posts2] = await Promise.all([
    fetchUser(1),
    fetchPosts(1)
  ]);
}
```

---
