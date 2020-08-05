import React from 'react'
import { connect } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { showNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    props.addVote(anecdote)
    props.showNotificationWithTimeout(`you voted '${anecdote.content}'. vote count ${anecdote.votes}`, 10)
  }

  return (
    <>
      {props.anecdotes.map(anecdote =>
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

const mapStateToProps = (state) => {
  const byVotes = (a1, a2) => a2.votes - a1.votes

  const filteredAnecdotes = state.anecdotes.filter(ele => {
    return (ele.content.toLowerCase()).includes(state.filter.toLowerCase())
  })
  
  const sortedAnecdotes = [ ...filteredAnecdotes ].sort(byVotes)

  return {
    anecdotes: sortedAnecdotes, // if you want `presentational component` `AnecdoteList` to render all anecdotes without sorting, then just write `anecdotes: state.anecdotes`
    // this shows data-rendering logic is contained inside `ConnectedAnecdoteList` component, thus `ConnectedAnecdoteList` is a `container component`.
  }
}

const mapDispatchToProps = {
  addVote: addVote,
  showNotificationWithTimeout: showNotificationWithTimeout
}

// redux connect() style 1
const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
export default ConnectedAnecdoteList