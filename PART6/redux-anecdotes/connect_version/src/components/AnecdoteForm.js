import React from 'react'
import { connect } from 'react-redux'
import { addAnecdoteOf } from '../reducers/anecdoteReducer'
import { showNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.newAnecdote.value
    event.target.newAnecdote.value = ''

    props.addAnecdoteOf(content)
    props.showNotificationWithTimeout(`you added '${content}' anecdote.`, 10)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="newAnecdote"/></div>
        <button type="submit">create</button>
      </form>
    </>
  )
} 

// redux connect() style 3
// when the dispatched actions need to reference the props of the component, you need to use this style to make it work
const mapDispatchToProps = (dispatch) => {
  return {
    addAnecdoteOf: (value) => {
      dispatch(addAnecdoteOf(value))
    },
    showNotificationWithTimeout: (message, seconds) => {
      dispatch(showNotificationWithTimeout(message, seconds))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(AnecdoteForm)