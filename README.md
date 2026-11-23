# Diameter ⭕

> A lightweight, framework-agnostic feature store pattern designed to bridge reactive state management and application logic smoothly and flexibly.

Diameter acts as an expressive facade for feature slices in your application. It provides a clean, predictable API for reading reactive state, subscribing to updates, and executing business logic—without hard-coupling your UI or application code to any specific state library or engine framework.

---

## Key Features

- 🔌 **Framework & Library Agnostic**: Seamlessly works with plain JavaScript objects, **Radius**, Redux, Zustand, RxJS, Signals, or custom state stores.
- ⚙️ **Optional Engine Support**: Dynamically binds to action execution engines like **Vertex** when present, but remains completely functional on its own.
- 🔄 **Unified Subscription API**: Standardizes reactive state consumption across different reactivity primitives.
- 🛠️ **Flexible Action Definitions**: Define actions as simple objects or context-aware factory functions.
- 📦 **Zero Dependencies**: Lightweight, self-contained, and footprint-free.

---

## Installation

Simply copy `diameter.js` into your project source directory or import it as a module:

```javascript
import { createFeatureStore } from './diameter.js'
```

---

## Core Concepts

Diameter unifies three core capabilities of a feature module:
1. **State Reader (`store.state`)**: Access current state snapshot reactively or statically.
2. **Subscription (`store.subscribe`)**: Receive callbacks when feature state updates.
3. **Actions (`store.actions`)**: Invoke mutations, engine actions, or async workflows.

---

## Usage Guide

### 1. Minimal / Standalone Usage (Zero External Dependencies)

Create a store with a simple getter function and inline action definitions:

```javascript
import { createFeatureStore } from './diameter.js'

let count = 0

export const counterStore = createFeatureStore({
    name: 'counter',
    state: () => ({ count }),
    actions: {
        increment() {
            count++
        },
        decrement() {
            count--
        }
    }
})

// Read state
console.log(counterStore.state) // { count: 0 }

// Execute actions
counterStore.actions.increment()
console.log(counterStore.state) // { count: 1 }
```

---

### 2. Integration with State Stores (e.g., Radius)

Diameter automatically detects standard store methods like `.getState()` and `.watch()` or `.subscribe()`:

```javascript
import { createState } from './radius.js'
import { createFeatureStore } from './diameter.js'

const radiusStore = createState({
    user: { name: 'Alice', loggedIn: true }
})

export const userStore = createFeatureStore({
    name: 'user',
    state: radiusStore, // Automatically resolves radiusStore.getState('user')
    actions: {
        logout() {
            radiusStore.setState({ user: { name: null, loggedIn: false } })
        }
    }
})

// Subscribe to feature slice changes
const unsubscribe = userStore.subscribe((newUser, oldUser) => {
    console.log(`User state changed:`, newUser)
})

userStore.actions.logout()
```

---

### 3. Engine Integration (e.g., Vertex Engine)

When an engine like **Vertex** is supplied, Diameter lazily resolves registered controller actions or provides the engine instance directly to action factories:

```javascript
import { createEngine } from './createEngine.js'
import { createState } from './radius.js'
import { createFeatureStore } from './diameter.js'

const radiusStore = createState({ cart: { items: [], total: 0 } })
const vertexEngine = createEngine({ stateStore: radiusStore })

export const cartStore = createFeatureStore({
    name: 'cart',
    state: radiusStore,
    engine: vertexEngine, // Optional execution engine
    
    // Actions can be defined as factory functions receiving { name, state, engine }
    actions: ({ engine }) => ({
        addItem(item) {
            if (engine) {
                // Trigger event-driven workflow via engine event bus
                engine.events.emit('cart:item-added', item)
            } else {
                console.log('Engine not present; running standalone logic.')
            }
        }
    })
})

// Execute action
cartStore.actions.addItem({ id: 101, name: 'Headphones', price: 99 })
```

---

## API Reference

### `createFeatureStore(options)`

Creates and returns a Diameter feature store object.

#### Options (`options`)

| Option | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** | Unique key identifying the feature slice. |
| `state` | `Object \| Function` | No | Plain state object, getter function, or store instance with `.getState()`. |
| `subscribe` | `Function` | No | Custom subscription function `(callback) => cleanupFn`. |
| `actions` | `Object \| Function` | No | Action map object or factory function `({ name, state, engine, ...meta }) => actions`. |
| `engine` | `Object` | No | Execution engine instance (e.g., Vertex engine). |
| `...meta` | `any` | No | Any additional key/value context attached directly to the store instance. |

#### Return Value

| Property | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | Store slice name. |
| `state` | `any` | Getter returning the current state snapshot. |
| `subscribe(cb)` | `Function` | Sets up a listener for state changes and returns an unsubscribe function. |
| `actions` | `Object` | Map of bound actions available for execution. |

---

## License

MIT