import isEqual from "lodash.isequal"
import { useState, useEffect } from "react"

import { persistState, retrieveState } from "../utils/persist"
import { Middleware } from "./types"
import { useBaseStore } from "./useBaseStore"

type StoreRef<State> = {
  current: ReturnType<typeof useBaseStore<State>> | null
}

interface PersistenceOptions {
  persistKey: string
  storage?: Storage // Default is localStorage
}

interface StoreOptions<State> {
  middlewares?: Middleware<State>[]
  persistenceOptions?: PersistenceOptions
}

export const createSharedStore = <State>(
  initialState: State,
  options: StoreOptions<State> = {} // Default to empty options
) => {
  const { middlewares = [], persistenceOptions } = options
  const storeRef: StoreRef<State> = { current: null }

  const useSharedStore = <SelectedState = State>(
    selector: (state: State) => SelectedState = (state) => state as unknown as SelectedState
  ) => {
    const persistentState = persistenceOptions
      ? retrieveState<State>(persistenceOptions.persistKey, persistenceOptions.storage)
      : null
    
    const baseStore = useBaseStore(persistentState || initialState, middlewares)

    storeRef.current = storeRef.current ? storeRef.current : baseStore

    // Automatically persist state if persistence is enabled
    if (persistenceOptions) {
      const { persistKey, storage = localStorage } = persistenceOptions
      storeRef.current.subscribe((newState: State) => {
        persistState<State>(persistKey, newState, storage)
      })
    }

    const { state, updateState, subscribe } = storeRef.current

    const [selectedState, setSelectedState] = useState(() => selector(state))

    useEffect(() => {
      const listener = (newState: State) => {
        const newSelectedState = selector(newState)
        if(!isEqual(newSelectedState, selectedState)) {
          setSelectedState(newSelectedState)
        }
      }

      const unsubscribe = subscribe(listener)
      return () => unsubscribe()
    }, [selector, selectedState])

    return {
      state: selectedState,
      updateState
    }
  }

  return useSharedStore
}
