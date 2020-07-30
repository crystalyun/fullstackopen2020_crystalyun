import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdoteOf } from '../reducers/anecdoteReducer'
import { displayNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.newAnecdote.value
    event.target.newAnecdote.value = ''

    dispatch(addAnecdoteOf(content))
    dispatch(displayNotification(`you added '${content}' anecdote.`))
  }

  // const addAnecdote = async (event) => {
  //   event.preventDefault()
  //   const content = event.target.newAnecdote.value
  //   event.target.newAnecdote.value = ''

  //   const newAnecdote = await anecdoteService.createNew(content)
  //   console.log('newAnecdote is ', newAnecdote)

  //   dispatch(addAnecdoteOf(newAnecdote))
  //   dispatch(displayNotification(`you added '${newAnecdote.content}' anecdote.`))
  // }

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

export default AnecdoteForm