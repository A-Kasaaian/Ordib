# ordib

**Ordib** is a lightweight, flexible, and highly performant state management library for React applications. Designed with simplicity and scalability in mind, it supports modern features such as middleware, selectors, immutability, and modular state stores.

Ordib comes from Ordibehesh which is second month of persian calendar. Ordibehesht means truth and it's Ordib goal

## Features

- **Lightweight**: Minimal API, easy setup, and fast performance.
- **Middleware Support**: Add logging, validation, or async workflows.
- **Selectors**: Subscribe to specific parts of the state to optimize rendering.
- **Immutability**: Built-in support for immutable state updates.
- **Persistence**: Save and restore state with optional persistence utilities.
- **Modularity**: Create multiple independent stores for scoped state management.
- **TypeScript Support**: Strong type safety for state, middleware, and selectors.

## Getting Started

### Installation

To install Ordib, run the following command:

```sh
npm install ordib
```

### Basic Usage

#### Creating a Simple Store

First, create a simple store using `createSharedStore`:

```tsx
import { createSharedStore } from 'ordib'

interface AppState {
  count: number
}

const initState = { count: 0 }
const useAppStore = createSharedStore<AppState>(initStore)

export useAppStore
```

#### Using the Store in a Component

Next, import the store into a component and use it to manage state:

```tsx
import React from 'react'
import { useAppStore } from './path/to/store'

const Counter: React.FC = () => {
  const { state, updateState } = useAppStore()

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => { updateState({ count: state.count + 1 }) }} >
        Increment
      </button>
    </div>
  )
}

export default Counter
```

### Nested State Updates

Ordib supports nested state updates seamlessly via `updateState` with partial updates.

#### Creating a Store with Nested State

Create a store with nested state:

```tsx
import { createSharedStore } from 'ordib'

interface UserState {
  name: string
  details: {
    age: number
    address: string
  }
}

const initState = {
  name: 'Alice',
  details: {
    age: 30,
    address: '123 Street'
  }
}

const useUserStore = createSharedStore<UserState>(initState)

export useUserStore
```

#### Using the Nested State Store in a Component

Import the nested state store into a component and update nested state:

```tsx
import React from 'react'
import { useUserStore } from './path/to/store'

const UserComponent: React.FC = () => {
  const { state, updateState } = useUserStore()

  const updateAge = () => {
    updateState({
        ...state,
        details: {
            ...state.details,
            age: state.details.age + 1
        }
    })
  }

  return (
    <div>
      <p>Name: {state.name}</p>
      <p>Age: {state.details.age}</p>
      <p>Address: {state.details.address}</p>
      <button onClick={updateAge}>Increase Age</button>
    </div>
  )
}

export default UserComponent
```

### Optimize Performance with Selectors

Selectors allow you to subscribe to only part of the state to avoid unnecessary re-renders.

#### Using Selectors to Scope Updates

Import the nested state store and add a selector to scope updates:

```tsx
import React from 'react'
import { createSharedStore } from 'ordib'

interface AppState {
  count: number
  name: string
}

const initStore = { count: 0, name: 'Ordib' }

const useAppStore = createSharedStore<AppState>(initStore)

const CountDisplay: React.FC = () => {
  const { state } = useAppStore((state) => state.count)

  return <div>Count: {state}</div>
}

const NameDisplay: React.FC = () => {
  const { state } = useAppStore((state) => state.name)

  return <div>Name: {state}</div>
}

const App: React.FC = () => (
  <div>
    <CountDisplay />
    <NameDisplay />
  </div>
)

export default App
```

## API Reference

### `createSharedStore`

- **Description**: Creates a shared store with optional middleware and persistence options.
- **Parameters**:
  - `initialState` - The initial state of the store.
  - `options` - Configuration options for middlewares and persistence.
    - `middlewares` - An array of middleware functions.
    - `persistenceOptions` - Options for state persistence.
      - `persistKey` - The key used to persist the state.
      - `storage` - The storage mechanism (default is `localStorage`).

### `useSharedStore`

- **Description**: Hook to access and update the shared store state.
- **Parameters**:
  - `selector` - A function to select a part of the state (default is the entire state).
- **Returns**:
  - `state` - The selected state.
  - `updateState` - Function to update the state.

### `useBaseStore`

- **Description**: Creates a base store with optional middleware.
- **Parameters**:
  - `initialState` - The initial state of the store.
  - `middlewares` - An array of middleware functions.
- **Returns**:
  - `state` - The current state.
  - `updateState` - Function to update the state.
  - `subscribe` - Function to subscribe to state changes.

## Advanced Features

### Middleware

Ordib supports middleware for logging, validation, or async workflows:

```tsx
import { createSharedStore } from 'ordib'

const loggerMiddleware = (store) => (next) => (action) => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const useAppStore = createSharedStore({ count: 0 }, { middlewares: [loggerMiddleware] })

export useAppStore
```

### Persistence

Persist and restore state with optional persistence utilities:

```tsx
import { createSharedStore } from 'ordib'

const useAppStore = createSharedStore(
  { count: 0 },
  {
    persistenceOptions: {
      persistKey: 'appState',
      storage: sessionStorage // Storage is optional. Default is localStorage.
    }
  }
)

export useAppStore
```

## FAQ

### How do I reset the state?

You can reset the state by calling `updateState` with the initial state:

```tsx
const resetState = () => {
  updateState({ count: 0 })
}
```

### Can I use Ordib with TypeScript?

Yes, Ordib has strong TypeScript support for state, middleware, and selectors.

### How do I subscribe to state changes?

You can subscribe to state changes using the `subscribe` function returned by `useBaseStore`:

```tsx
const { subscribe } = useAppStore()
subscribe((newState) => {
  console.log('State changed:', newState)
})
```

### How do I use multiple stores?

You can create multiple independent stores for scoped state management:

```tsx
const useUserStore = createSharedStore({ name: 'Alice' })
const useSettingsStore = createSharedStore({ theme: 'dark' })
```

### How do I persist state across sessions?

You can use the `persistenceOptions` parameter in `createSharedStore` to persist state across sessions:

```tsx
const initState = { count: 0 }
const useAppStore = createSharedStore(
  initState,
  {
    persistenceOptions: {
      persistKey: 'appState',
      storage: localStorage
    }
  }
)
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

🎉 Happy coding with Ordib! 🚀
