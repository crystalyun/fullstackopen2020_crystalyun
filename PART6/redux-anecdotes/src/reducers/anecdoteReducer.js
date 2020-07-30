import anecdoteService from '../services/anecdotes'

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

  case 'ADD_ANECDOTE': 
    return [ ...state, action.data ]

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

// before using redux-thunk
// export const addAnecdoteOf = (data) => {
//   return {
//     type: 'ADD_ANECDOTE',
//     data
//   }
// }

export const addAnecdoteOf = (content) => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch({
      type: 'ADD_ANECDOTE',
      data: newNote
    })
  }
}

// before using redux-thunk
// export const initializeAnecdotes = (anecdotes) => {
//   return {
//     type: 'INIT_ANECDOTES',
//     data: anecdotes
//   }
// }

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES', 
      data: anecdotes,
    })
  }
}

export default anecdoteReducer