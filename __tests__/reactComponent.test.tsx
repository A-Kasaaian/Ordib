import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { createSharedStore } from '../src/store/useSharedStore'

// Test 1: Does not re-render when unrelated state part updates
it('does not re-render when unrelated state part updates', async () => {
  const useStore = createSharedStore({
    user: { name: 'Alice', details: { age: 30 } },
    count: 0,
  })

  const renderCount = jest.fn()

  const DisplayName: React.FC = () => {
    const { state } = useStore((state) => state.user.name)
    renderCount()
    return <div data-testid="name">{state}</div>
  }

  const DisplayCount: React.FC = () => {
    const { state } = useStore((state) => state.count)
    return <div data-testid="count">{state}</div>
  }

  const { result } = renderHook(() => useStore())
  render(<>
        <DisplayCount />
        <DisplayName />
    </>)

  act(() => {
    result.current.updateState({ ...result.current.state, count: 1 })
  })

  await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'))
  expect(renderCount).toHaveBeenCalledTimes(1)
})

// Test 2: Re-renders when subscribed state part updates
it('re-renders when subscribed state part updates', async () => {
  const useStore = createSharedStore({
    user: { name: 'Alice', details: { age: 30 } },
    count: 0,
  })

  const renderCount = jest.fn()

  const DisplayAge: React.FC = () => {
    const { state } = useStore((state) => state.user.details.age)
    renderCount()
    return <div data-testid="age">{state}</div>
  }

  const { result } = renderHook(() => useStore())
  render(<DisplayAge />)

  act(() => {
    result.current.updateState({
        ...result.current.state,
        user: {
            ...result.current.state.user,
            details: {
            ...result.current.state.user.details,
            age: result.current.state.user.details.age + 1,
            },
        },
    })
  })

  await waitFor(() => expect(screen.getByTestId('age').textContent).toBe('31'))
  expect(renderCount).toHaveBeenCalledTimes(2)
})
