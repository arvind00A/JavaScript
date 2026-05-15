# 🌐 Section 12 — DOM (Document Object Model)

---

## What is the DOM?
The DOM is a programming interface for HTML documents. It represents the page as a tree of nodes that JS can manipulate.
```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1 "Hello"
        ├── p  "World"
        └── div
            └── span
```

## Selecting Elements
```js
// Single element
document.getElementById("myId")
document.querySelector(".myClass")         // first match
document.querySelector("div > p.text")    // CSS selector

// Multiple elements (NodeList/HTMLCollection)
document.querySelectorAll(".item")         // NodeList (static)
document.getElementsByClassName("item")   // HTMLCollection (live)
document.getElementsByTagName("p")        // HTMLCollection

// Traversal
element.parentElement
element.children          // HTMLCollection of child elements
element.firstElementChild
element.lastElementChild
element.nextElementSibling
element.previousElementSibling
```

## Manipulating HTML & CSS
```js
// Content
el.textContent = "New text"     // sets text (no HTML parsing)
el.innerHTML   = "<b>Bold</b>"  // parses HTML (⚠️ XSS risk)
el.innerText   = "Visible text" // respects CSS visibility

// Attributes
el.getAttribute("src")
el.setAttribute("src", "img.png")
el.removeAttribute("disabled")
el.hasAttribute("required")
el.id          // get/set id
el.className   // get/set class string

// CSS classes
el.classList.add("active")
el.classList.remove("active")
el.classList.toggle("active")
el.classList.contains("active")
el.classList.replace("old", "new")

// Styles
el.style.color = "red"
el.style.backgroundColor = "blue"  // camelCase!
el.style.cssText = "color:red; font-size:16px"
getComputedStyle(el).color          // computed (read-only)
```

## Creating & Deleting Elements
```js
// Create
const div  = document.createElement("div")
const text = document.createTextNode("Hello")
div.appendChild(text)

// Insert
parent.appendChild(newEl)         // add at end
parent.insertBefore(new, ref)     // before reference
parent.prepend(newEl)             // add at start
parent.append(newEl)              // add at end (accepts strings too)
el.insertAdjacentHTML("beforeend", "<p>new</p>")  // positions: beforebegin, afterbegin, beforeend, afterend
el.replaceWith(newEl)

// Remove
el.remove()                       // modern
parent.removeChild(child)         // classic
el.innerHTML = ""                 // remove all children
```

---
