import { useState, useRef } from "react"
import { Middleware } from "./types"

type Listener<State> = (state: State) => void

export const useBaseStore = <State>(
  initialState: State,
  middlewares: Middleware<State>[] = []
) => {
  const [state, setState] = useState<State>(initialState)
  const listeners = useRef<Listener<State>[]>([])

  const subscribe = (listener: Listener<State>) => {
    listeners.current.push(listener)
    return () => {
      listeners.current = listeners.current.filter((l) => l !== listener)
    }
  }

  const notifyListeners = (updatedState: State) => {
    listeners.current.forEach((listener) => listener(updatedState))
  }

  const runMiddlewares = (
    currentState: State,
    nextState: State,
    onComplete: (state: State) => void
  ) => {
    let index = 0

    const next = (updatedState: State) => {
      if (index < middlewares.length) {
        const middleware = middlewares[index]
        index += 1
        middleware(currentState, updatedState, next)
      } else {
        onComplete(updatedState)
      }
    }

    next(nextState)
  }

  const updateState = async (
    nextState: State
  ) => {
    runMiddlewares(state, nextState, (finalState) => {
      setState(finalState)
      notifyListeners(finalState)
    })
  }

  return {
    state,
    updateState,
    subscribe,
  }
}
