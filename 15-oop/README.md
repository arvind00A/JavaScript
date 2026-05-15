# 🧬 Section 15 — OOP (Object-Oriented Programming)

---

## Constructor Functions (Old Way)
```js
function Animal(name, sound) {
  this.name  = name;
  this.sound = sound;
}
Animal.prototype.speak = function() {
  return `${this.name} says ${this.sound}`;
};
const dog = new Animal("Rex", "Woof");
dog.speak();  // "Rex says Woof"
```

## Classes (ES6+)
```js
class Animal {
  #secret = "private field";   // private field (ES2022)

  constructor(name, sound) {
    this.name  = name;
    this.sound = sound;
  }

  speak() {
    return `${this.name} says ${this.sound}`;
  }

  get info() {               // getter
    return `${this.name} (${this.sound})`;
  }

  set newName(val) {         // setter
    this.name = val.trim();
  }

  static create(name, sound) {  // static method
    return new Animal(name, sound);
  }
}

const cat = new Animal("Whiskers", "Meow");
cat.speak();                // "Whiskers says Meow"
cat.info;                   // "Whiskers (Meow)"
Animal.create("Dog","Woof"); // static call
```

## Inheritance
```js
class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Woof");    // call parent constructor
    this.breed = breed;
  }

  fetch(item) {
    return `${this.name} fetches the ${item}!`;
  }

  speak() {
    return super.speak() + " (excitedly)";  // call parent method
  }
}

const rex = new Dog("Rex", "Labrador");
rex.speak();   // "Rex says Woof (excitedly)"
rex.fetch("ball");
rex instanceof Dog;     // true
rex instanceof Animal;  // true
```

## Encapsulation & Static
```js
class BankAccount {
  #balance;                  // truly private
  static #count = 0;        // private static

  constructor(initial) {
    this.#balance = initial;
    BankAccount.#count++;
  }

  deposit(amt) {
    if (amt > 0) this.#balance += amt;
    return this;             // method chaining
  }

  get balance() { return this.#balance; }
  static getCount() { return BankAccount.#count; }
}

const acc = new BankAccount(1000);
acc.deposit(500).deposit(200);  // chaining
acc.balance;                     // 1700
BankAccount.getCount();          // 1
```

---
