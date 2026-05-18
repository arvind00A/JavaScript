# 🧪 Section 16 — Prototypes

---

## Prototype Chain
```js
// Every object has a [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf)
const arr = [1, 2, 3];
arr.__proto__ === Array.prototype          // true
Array.prototype.__proto__ === Object.prototype  // true
Object.prototype.__proto__ === null        // true (end of chain)

// Chain: arr → Array.prototype → Object.prototype → null
// When you call arr.push(), JS looks up the chain:
// arr → no push found → Array.prototype → push found! ✅
```

## How Inheritance Works Internally
```js
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return this.name + " speaks"; };

function Dog(name) { Animal.call(this, name); }     // borrow constructor
Dog.prototype = Object.create(Animal.prototype);    // set up chain
Dog.prototype.constructor = Dog;                    // fix constructor ref
Dog.prototype.bark = function() { return "Woof!"; };

const d = new Dog("Rex");
d.speak();  // "Rex speaks" — found on Animal.prototype via chain
d.bark();   // "Woof!"

// Object.getPrototypeOf
Object.getPrototypeOf(d) === Dog.prototype      // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype  // true
```

## Prototype Methods
```js
Object.create(proto)          // create object with given prototype
Object.getPrototypeOf(obj)    // get prototype
Object.setPrototypeOf(obj, p) // set prototype (avoid — slow)
obj.hasOwnProperty("key")     // check own (not inherited)
"key" in obj                  // check own AND inherited
Object.hasOwn(obj, "key")     // modern own check
```

---
