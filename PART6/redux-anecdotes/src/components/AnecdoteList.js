import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)

    const vote = (id) => {
        dispatch(addVote(id))
    }

    const byVotes = (a1, a2) => a2.votes - a1.votes
    const sortedAnecdotes = [ ...anecdotes ].sort(byVotes)

    return (
        <>
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
        </>
    )
}

export default AnecdoteList
