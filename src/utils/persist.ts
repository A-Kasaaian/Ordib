export const persistState = <State>(key: string, state: State, storage: Storage = localStorage) => {
    storage.setItem(key, JSON.stringify(state))
}
  
export const retrieveState = <T>(key: string, storage: Storage = localStorage): T | null => {
    const storedState = storage.getItem(key)
    return storedState ? (JSON.parse(storedState) as T) : null
}