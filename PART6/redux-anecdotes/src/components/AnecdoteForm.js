import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdoteOf } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.newAnecdote.value
        event.target.newAnecdote.value = ''
        dispatch(addAnecdoteOf(content))
        dispatch(notificationChange(`you added '${content}' anecdote.`))
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

export default AnecdoteForm