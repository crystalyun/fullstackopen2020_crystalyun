const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)
//console.log(initialState)

const anecdoteReducer = (state = initialState, action) => {
  console.log('state now (anecdoteReducer): ', state)
  console.log('action (anecdoteReducer)', action)

  if (action.type === 'INCREMENT_VOTE') {
    const newState = state.map(ele => {
      if (ele.id === action.data.id) {
        return { ...ele, votes: ele.votes + 1 }
      } else { return ele }
    })
    return newState
  } else if (action.type === 'ADD_ANECDOTE') {
    const newAnecdote = asObject(action.data.content)
    return [ ...state, newAnecdote ]
  }



  return state
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

export default anecdoteReducer