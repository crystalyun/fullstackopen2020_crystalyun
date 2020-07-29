import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)

    const vote = ({ id, content }) => {
        dispatch(addVote(id))
        dispatch(displayNotification(`you voted '${content}'.`))
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
                <button onClick={() => vote(anecdote)}>vote</button>
              </div>
            </div>
           )}
        </>
    )
}

export default AnecdoteList
