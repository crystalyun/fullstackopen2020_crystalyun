import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
  case 'INCREMENT_VOTE': {
    const voted = action.data
    return state.map(ele => ele.id === voted.id ? voted : ele)
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
    dispatch({
      type: 'INCREMENT_VOTE',
      data: updatedAnecdote
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