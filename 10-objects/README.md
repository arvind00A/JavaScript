# 🏗️ Section 10 — Objects

---

## Object Creation
```js
// Object literal (most common)
const person = {
  name: "Alice",
  age: 30,
  greet() { return `Hi, I'm ${this.name}`; }
};

// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const p = new Person("Bob", 25);

// Object.create (set prototype)
const proto = { greet() { return "hello"; } };
const obj = Object.create(proto);
```

## Accessing & Modifying Properties
```js
// Dot notation
person.name    // "Alice"
person.name = "Bob"
person.email = "bob@co.com"  // add new property
delete person.age             // remove property

// Bracket notation (for dynamic keys)
const key = "name";
person[key]                  // "Alice"
person["first name"]         // keys with spaces

// Optional chaining
person?.address?.city        // undefined instead of error
person?.greet?.()            // safe method call
```

## Nested Objects
```js
const user = {
  name: "Alice",
  address: {
    city: "NYC",
    zip: "10001",
    coords: { lat: 40.7, lng: -74.0 }
  }
};
console.log(user.address.coords.lat);   // 40.7
```

## Object Methods
```js
Object.keys(obj)            // array of keys
Object.values(obj)          // array of values
Object.entries(obj)         // array of [key, value] pairs
Object.assign({}, src)      // shallow copy / merge
Object.freeze(obj)          // prevent modifications
Object.isFrozen(obj)        // check if frozen
Object.hasOwn(obj, "key")   // own property check (modern)
obj.hasOwnProperty("key")   // own property check (classic)
```

## Destructuring
```js
const { name, age } = person;       // basic destructuring
const { name: n, age: a } = person; // rename while destructuring
const { name = "Unknown" } = {};    // default value

// Nested destructuring
const { address: { city } } = user;

// Function parameter destructuring
function display({ name, age = 0 }) {
  console.log(name, age);
}
display(person);

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
```

## Spread & Rest
```js
// Spread — expand object/array
const merged = { ...obj1, ...obj2 };     // shallow merge
const copy   = { ...original };          // shallow copy
const arr    = [...arr1, ...arr2];       // array merge

// Rest — collect remaining
const { a, b, ...others } = obj;         // others = remaining props
const [head, ...tail] = array;           // tail = remaining items
```

---
