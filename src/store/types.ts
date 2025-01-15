export type Middleware<State> = (
    currentState: State,
    nextState: State,
    next: (updatedState: State) => void
) => void