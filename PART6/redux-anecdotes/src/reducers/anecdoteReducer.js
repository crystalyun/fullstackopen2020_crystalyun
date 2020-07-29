const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteReducer = (state = [], action) => {
  console.log('state now (anecdoteReducer): ', state)
  console.log('action (anecdoteReducer)', action)

  switch (action.type) {
  case 'INCREMENT_VOTE': {
    const newState = state.map(ele => {
      if (ele.id === action.data.id) {
        return { ...ele, votes: ele.votes + 1 }
      } else { return ele }
    })
    return newState
  }

  case 'ADD_ANECDOTE': {
    const newAnecdote = asObject(action.data.content)
    return [ ...state, newAnecdote ]
  }

  case 'INIT_ANECDOTES':
    return action.data

  default:
    return state
  }
}

// define two functions that create action-objects
export const addVote = (id) => {
  return {
    type: 'INCREMENT_VOTE',
    data: { id }
  }
}

export const addAnecdoteOf = (content) => {
  return {
    type: 'ADD_ANECDOTE',
    data: { content }
  }
}

export const initializeAnecdotes = (anecdotes) => {
  return {
    type: 'INIT_ANECDOTES',
    data: anecdotes
  }
}

export default anecdoteReducer