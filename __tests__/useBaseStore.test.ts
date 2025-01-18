import { renderHook, act } from '@testing-library/react-hooks'
import { useBaseStore } from '../src/store/useBaseStore'
import { waitFor } from '@testing-library/react'

// Mock middleware for testing
const loggingMiddleware = jest.fn((_, nextState, next) => {
  next(nextState)
})

const validationMiddleware = jest.fn((_, nextState, next) => {
  if (nextState.count < 0) {
    throw new Error('Count cannot be negative')
  }
  next(nextState)
})

describe('useBaseStore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('initializes with the provided initial state', () => {
    const { result } = renderHook(() => useBaseStore({ count: 0 }))

    expect(result.current.state).toEqual({ count: 0 })
  })

  it('updates state using updateState with a partial update', () => {
    const { result } = renderHook(() => useBaseStore({ count: 0 }))

    act(() => {
      result.current.updateState({ count: 10 })
    })

    expect(result.current.state).toEqual({ count: 10 })
  })

  it('updates state using updateState with a function updater', async () => {
    const { result } = renderHook(() => useBaseStore({ count: 0 }))

    act(() => {
      result.current.updateState({ count: result.current.state.count + 5 })
    })

    await waitFor(() => { expect(result.current.state).toEqual({ count: 5 }) })
  })

  it('updates nested state using updateState with a partial update', async () => {
    const { result } = renderHook(() => useBaseStore({ user: { name: 'Alice', details: { age: 30 } } }))

    act(() => {
      result.current.updateState({ user: { ...result.current.state.user, details: { ...result.current.state.user.details, age: 31 } } })
    })

    await waitFor(() => { expect(result.current.state).toEqual({ user: { name: 'Alice', details: { age: 31 } } }) })
  })

  it('updates nested state using updateState with a function updater', async () => {
    const { result } = renderHook(() => useBaseStore({ user: { name: 'Alice', details: { age: 30 } } }))

    act(() => {
      result.current.updateState({
        user: {
          ...result.current.state.user,
          details: {
            ...result.current.state.user.details,
            age: result.current.state.user.details.age + 1,
          },
        },
      })
    })

    await waitFor(() => { expect(result.current.state).toEqual({ user: { name: 'Alice', details: { age: 31 } } }) })
  })

  it('calls middleware during state updates', () => {
    const { result } = renderHook(() =>
      useBaseStore({ count: 0 }, [loggingMiddleware])
    )

    act(() => {
      result.current.updateState({ count: 10 })
    })

    expect(loggingMiddleware).toHaveBeenCalledWith(
      { count: 0 },
      { count: 10 },
      expect.any(Function)
    )
  })

  it('supports async state updates with updateState', async () => {
    const { result } = renderHook(() => useBaseStore({ count: 0 }, []))

    await act(async () => {
      const increment = await Promise.resolve(5)
      await result.current.updateState(
        { count: result.current.state.count + increment }
      )
    })

    await waitFor(() => { expect(result.current.state).toEqual({ count: 5 }) })
  })

  it('throws an error if validation middleware fails', async () => {
    const { result } = renderHook(() =>
      useBaseStore({ count: 0 }, [validationMiddleware])
    )
  
    await expect(
      act(async () => {
        await result.current.updateState({ count: -1 })
      })
    ).rejects.toThrow('Count cannot be negative')
  })

  it('supports async updates for nested state', async () => {
    const { result } = renderHook(() => useBaseStore({ user: { name: 'Alice', details: { age: 30 } } }))

    await act(async () => {
      const newAge = await Promise.resolve(result.current.state.user.details.age + 1)
      await result.current.updateState(
        {
          ...result.current.state,
          user: {
            ...result.current.state.user,
            details: {
              ...result.current.state.user.details,
              age: newAge,
            },
          },
        }
      )
    })

    await waitFor(() => { expect(result.current.state).toEqual({ user: { name: 'Alice', details: { age: 31 } } }) })
  })

  it('allows subscribing to state changes', async () => {
    const { result } = renderHook(() => useBaseStore({ count: 0 }))

    const listener = jest.fn()

    act(() => {
      result.current.subscribe(listener)
      result.current.updateState({ count: 5 })
    })

    await waitFor(() => { expect(listener).toHaveBeenCalledWith({ count: 5 }) })
  })

  it('unsubscribe prevents further state change notifications', async () => {
    const { result } = renderHook(() => useBaseStore({ count: 0 }))

    const listener = jest.fn()
    let unsubscribe: () => void

    act(() => {
      unsubscribe = result.current.subscribe(listener)
      result.current.updateState({ count: 5 })
    })

    await waitFor(() => { expect(listener).toHaveBeenCalledWith({ count: 5 }) })

    act(() => {
      unsubscribe()
      result.current.updateState({ count: 10 })
    })

    await waitFor(() => { expect(listener).not.toHaveBeenCalledWith({ count: 10 }) })
  })

  it('updates state with DeepPartial updates', async () => {
    const { result } = renderHook(() =>
      useBaseStore({
        user: { name: 'Alice', details: { age: 30, address: '123 Street' } },
      })
    )
  
    act(() => {
      result.current.updateState({
        user: {
          ...result.current.state.user,
          details: {
            ...result.current.state.user.details,
            age: 31
          }
        }
      })
    })
  
    await waitFor(() => { expect(result.current.state).toEqual({
      user: { name: 'Alice', details: { age: 31, address: '123 Street' } },
    }) })
  })
  it('creates two different states and updates each correctly', () => {
    const { result: result1 } = renderHook(() => useBaseStore({ count: 0 }))
    const { result: result2 } = renderHook(() => useBaseStore({ count: 10 }))

    act(() => {
      result1.current.updateState({ count: 5 })
    })

    act(() => {
      result2.current.updateState({ count: 15 })
    })

    expect(result1.current.state).toEqual({ count: 5 })
    expect(result2.current.state).toEqual({ count: 15 })
  })
})
