import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch({
      type: 'INCREMENT_VOTE',
      data: { id }
    })
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.newAnecdote.value
    event.target.newAnecdote.value = ''
    dispatch({
      type: 'ADD_ANECDOTE',
      data: { content }
    })
  }

  const byVotes = (a1, a2) => a2.votes - a1.votes
  const sortedAnecdotes = [ ...anecdotes ].sort(byVotes)

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}> 
        <div><input name="newAnecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App