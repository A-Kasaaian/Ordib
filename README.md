
# ordib

Ordib - Lightweight State Management for React. Ordib comes from Ordibehesh which is second month of persian calendar. Ordibehesht means truth and it's Ordib goal

================================================

  

**Ordib** is a lightweight, flexible, and highly performant state management library for React applications. Designed with simplicity and scalability in mind, it supports modern features such as middleware, selectors, immutability, and modular state stores.

  

**Features**

------------

  

-  **Lightweight**: Minimal API, easy setup, and fast performance.

-  **Middleware Support**: Add logging, validation, or async workflows.

-  **Selectors**: Subscribe to specific parts of the state to optimize rendering.

-  **Immutability**: Built-in support for immutable state updates.

-  **Persistence**: Save and restore state with optional persistence utilities.

-  **Modularity**: Create multiple independent stores for scoped state management.

-  **TypeScript Support**: Strong type safety for state, middleware, and selectors.

  

**Installation**

----------------

  

Add Ordib to your project:

  

```bash

yarn  add  ordib

```

  

**Getting Started**

-------------------

  

### 1\. Create a Shared Store

  

A shared store manages the global or feature-specific state:

  

```
import { createSharedStore } from "ordib"

interface CounterState { count: number }

export const useCounterStore = createSharedStore({ count: 0 })
```

  

### 2\. Use the Store in Components

  

Access and update the state using the useCounterStore hook in your components.

  

#### Update the State:

  

```
import React, { useEffect } from "react"
import { useCounterStore } from "./stores/counterStore"

const CounterComponent: React.FC = () => {
	const { state, updateState } = useCounterStore()

	useEffect(() => {
		setInterval(() => updateState(state => state.count + 1), 1000)
	}, [])

	return <div > {state.count} </div>
}

export default CounterComponent
```

  

### 3\. Optimize Performance with Selectors

  

Subscribe to only part of the state using a selector to avoid unnecessary re-renders:

  

```
import React from "react"
import { createSharedStore } from "ordib"

import { useCounterStore } from "./stores/counterStore"

interface UserState { name: string, details: { age: number } }

const useUserStore = createSharedStore({ name: 'Bob', details: { age: 30 } })

const UserNameDisplay: React.FC = () => {
	const { state: name } = useUserStore((state) => state.name)

	return <div> {name} </div>
}

export default UserNameDisplay
```

In the above example the component won't re-render if any part of the state other than name gets updated.

### 4\. Use Middleware

  

Middleware lets you intercept state updates for logging, validation, or async workflows.

  

#### Add Middleware:

  

```
import { createSharedStore } from "ordib"
import { Middleware } from "ordib"

interface CounterState { count: number }

const loggingMiddleware: Middleware = (currentState, nextState, next) => {
	console.log("Previous State:", currentState)
	console.log("Next State:", nextState)
	next(nextState) // Proceed with the update
}

export const useCounterStore = createSharedStore( { count: 0 }, { middlewares: [loggingMiddleware] } ) 
```

  

### 5\. Persist State

  

Save and restore state to/from localStorage or other storage mechanisms.

  

#### Enable Persistence:

  

```
import { createSharedStore } from "ordib"

interface CounterState { count: number }

export const useCounterStore = createSharedStore({ count: 0 }, { persistenceOptions: { persistKey: "counterState" } } ) 
```

  

### 6\. Modular State Management

  

You can create multiple independent stores for different application features.

  

#### Example:

  

```
import { createSharedStore } from "ordib"

interface UserState { name: string }
interface ThemeState { darkMode: boolean }

export const useUserStore = createSharedStore({ name: "Guest", })

export const useThemeStore = createSharedStore({ darkMode: false, }) 
```

  

### 7\. Share State Between Components

  

Multiple components can share the same state seamlessly.

  

#### Example:

  

```
import React from "react"
import { createSharedStore } from "ordib"

interface CounterState { count: number }

export const useCounterStore = createSharedStore({ count: 0 })

const IncrementButton: React.FC = () => {
	const { updateState, state } = useCounterStore()
	return <button onClick={() => updateState({ count: state.count + 1 })}>Increment</button>
}

const CountDisplay: React.FC = () => {
	const { state: count } = useCounterStore((state) => state.count)
	return <div>Count: {count}</div>
}

const App: React.FC = () => (
	<>
		<CountDisplay />
		<IncrementButton />
	</>
)
```

  

**Advanced Features**

---------------------

  

### Nested State Updates

  

Ordib supports nested state updates seamlessly via updateState with partial updates:

  

```
import { createScopedStore } from "ordib";

interface ScopedState { loggedIn: boolean; }

export const useAuthStore = createScopedStore("auth", { loggedIn: false, });
```

  

**API Reference**

-----------------

  

### createSharedStore(initialState, options?)

  

*  **Description**: Creates a shared store with optional middleware and persistence options.

*  **Parameters**:

* initialState - The initial state of the store.

* options - Configuration options for middlewares and persistence.

  

### updateState(updater: Partial)

  

*  **Description**: Updates the state immutably.

*  **Parameters**:

* updater - Partial object to merge into the state.

  

### Middleware Signature

  

` (currentState: State, nextState: State, next: (state: State) => void) => void; `

  

**FAQ**

-------

  

### Q: Does Ordib support TypeScript?

  

Yes, Ordib is fully type-safe with TypeScript support.

  

### Q: Can I use multiple stores in the same app?

  

Absolutely! You can create as many independent stores as needed.

  

### Q: How is Ordib different from Redux or Zustand?

  

*  **Simpler API**: No reducers, actions, or complex boilerplate.

*  **Built-in Middleware**: Easily add logging, validation, or async logic.

*  **Selectors**: Optimized rendering by subscribing to specific state slices.

  

**Contributing**

----------------

  

We welcome contributions! Feel free to fork the repository, make changes, and submit a pull request.

  

1. Fork the repo.

2. git checkout -b feature/new-feature

3. Commit changes and open a pull request.

  

**License**

-----------

  

Ordib is licensed under the [MIT License](https://chatgpt.com/c/LICENSE).

  

**Acknowledgments**

-------------------

  

Inspired by modern React state management patterns and ancient Persian mythology, Ordib aims to deliver wisdom, simplicity, and unity to your React applications.

  

🎉 Happy coding with **Ordib**! 🚀
