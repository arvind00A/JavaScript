# 🖱️ Section 13 — Events

---

## Event Handling
```js
// 1. Inline (avoid)
// <button onclick="handleClick()">Click</button>

// 2. DOM property (replaces existing)
el.onclick = function() { console.log("clicked"); };

// 3. addEventListener (preferred — can add multiple)
el.addEventListener("click", function(event) {
  console.log("clicked!", event.target);
});
el.addEventListener("click", handler, { once: true });  // fires once
el.removeEventListener("click", handler);
```

## Event Object
```js
el.addEventListener("click", (e) => {
  e.target           // element that was clicked
  e.currentTarget    // element the listener is attached to
  e.type             // "click"
  e.preventDefault() // stop default browser action (links, forms)
  e.stopPropagation() // stop bubbling
  e.clientX / e.clientY   // mouse position
  e.key / e.code           // keyboard key
  e.keyCode               // deprecated, use e.key
});
```

## Common Events
```js
// Mouse
"click"       // single click
"dblclick"    // double click
"mousedown"   // button pressed
"mouseup"     // button released
"mouseover"   // pointer enters (including children)
"mouseenter"  // pointer enters (not children)
"mouseleave"  // pointer leaves
"mousemove"   // pointer moves

// Keyboard
"keydown"     // key pressed
"keyup"       // key released
"keypress"    // (deprecated)

// Form
"submit"      // form submitted
"change"      // value changed (fires on blur)
"input"       // value changed (fires on every keystroke)
"focus"       // element focused
"blur"        // element loses focus

// Window/Document
"load"        // page fully loaded
"DOMContentLoaded"  // DOM ready (before images/css)
"resize"      // window resized
"scroll"      // page scrolled
```

## Event Bubbling & Capturing
```js
// Bubbling (default): event travels from target UP to root
// Capturing: event travels from root DOWN to target

// By default, listeners are in BUBBLE phase
el.addEventListener("click", handler);                  // bubble phase
el.addEventListener("click", handler, true);            // capture phase
el.addEventListener("click", handler, {capture: true}); // same

// Event delegation: use bubbling to handle many children at once
document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    console.log("Clicked:", e.target.textContent);
  }
});
```

---
