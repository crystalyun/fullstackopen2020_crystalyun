import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
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

export const addVote = (anecdote) => {
  return async dispatch => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const updatedAnecdote = await anecdoteService.update(updated)
    const id = updatedAnecdote.id
    dispatch({
      type: 'INCREMENT_VOTE',
      data: { id }
    })
  }
}

export const addAnecdoteOf = (content) => {
  return async dispatch => {
    const newNote = await anecdoteService.createNew(content)
    dispatch({
      type: 'ADD_ANECDOTE',
      data: newNote
    })
  }
}

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