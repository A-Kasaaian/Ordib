import { renderHook, act } from '@testing-library/react-hooks'
import { createSharedStore } from '../src/store/useSharedStore'
import { waitFor } from '@testing-library/react'

// Mock persistence utilities
jest.mock('../src/utils/persist', () => ({
  persistState: jest.fn(),
  retrieveState: jest.fn()
}))

const { persistState, retrieveState } = require('../src/utils/persist')

describe('useSharedStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes state correctly with persistence', () => {
    retrieveState.mockReturnValueOnce({ count: 5 })

    const useCounterStore = createSharedStore({ count: 0 }, {
      persistenceOptions: { persistKey: 'counter' }
    })

    const { result } = renderHook(() => useCounterStore())

    expect(result.current.state).toEqual({ count: 5 })
  })

  it('updates state and persists it', () => {
    const useCounterStore = createSharedStore({ count: 0 }, {
      persistenceOptions: { persistKey: 'counter' }
    })

    const { result } = renderHook(() => useCounterStore())

    act(() => {
      result.current.updateState({ count: 10 })
    })

    expect(result.current.state).toEqual({ count: 10 })
    expect(persistState).toHaveBeenCalledWith('counter', { count: 10 }, localStorage)
  })

  it('handles nested state updates correctly', async () => {
    const useNestedStore = createSharedStore({ user: { name: 'Alice', details: { age: 30 } } })

    const { result } = renderHook(() => useNestedStore())

    act(() => {
      result.current.updateState({ user: { ...result.current.state.user, details: { age: 31 } } })
    })

    await waitFor(() => { expect(result.current.state).toEqual({ user: { name: 'Alice', details: { age: 31 } } }) })
  })

  it('allows two separate states to be initialized and updated independently', () => {
    const useCounterStore = createSharedStore({ count: 0 })
    const useUserStore = createSharedStore({ user: { name: 'Bob' } })

    const { result: counterResult } = renderHook(() => useCounterStore())
    const { result: userResult } = renderHook(() => useUserStore())

    act(() => {
      counterResult.current.updateState({ count: 10 })
    })

    act(() => {
      userResult.current.updateState({ user: { name: 'Alice' } })
    })

    expect(counterResult.current.state).toEqual({ count: 10 })
    expect(userResult.current.state).toEqual({ user: { name: 'Alice' } })
  })

  it('ensures multiple state updates in sequence work correctly', () => {
    const useCounterStore = createSharedStore({ count: 0 })

    const { result } = renderHook(() => useCounterStore())

    act(() => {
      result.current.updateState({ count: 5 })
      result.current.updateState({ count: 10 })
      result.current.updateState({ count: 15 })
    })

    expect(result.current.state).toEqual({ count: 15 })
  })

  it('shares state updates between components', () => {
    const useSharedCounterStore = createSharedStore({ count: 0 })

    const { result: result1 } = renderHook(() => useSharedCounterStore())
    const { result: result2 } = renderHook(() => useSharedCounterStore())

    act(() => {
      result1.current.updateState({ count: 10 })
    })

    expect(result1.current.state).toEqual({ count: 10 })
    expect(result2.current.state).toEqual({ count: 10 })

    act(() => {
      result2.current.updateState({ count: 20 })
    })

    expect(result1.current.state).toEqual({ count: 20 })
    expect(result2.current.state).toEqual({ count: 20 })
  })
})
