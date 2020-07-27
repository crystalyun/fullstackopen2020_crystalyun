import React from 'react'
import { useDispatch } from 'react-redux'
import { addAnecdoteOf } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.newAnecdote.value
        event.target.newAnecdote.value = ''
        dispatch(addAnecdoteOf(content))
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