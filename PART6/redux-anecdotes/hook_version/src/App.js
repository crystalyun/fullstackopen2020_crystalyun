import React, { useEffect } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('render once')
    dispatch(initializeAnecdotes())
  }, [dispatch])


  // useEffect(() => {
  //   console.log('render once')
  //   anecdoteService
  //     .getAll()
  //     .then(anecdotes => dispatch(initializeAnecdotes(anecdotes)))
  // }, [dispatch])

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App

/*
state object schema

{
  anecdotes : [ {anecdote1}, {anecdote2}, {anecdote3} ], ; each object has props `content`, `id`, `votes`

  notification : "placeholder",

  filter : "placeholder2"
}

anecdotes
 - has anecdotesReducer
 - actions : `INCREMENT_VOTE`, `ADD_ANECDOTE`, 'INIT_ANECDOTES'

notification
  - has notificationReducer
  - actions : `DISPLAY_NOTIFICATION`, `REMOVE_NOTIFICATION`

filter
  - has filterReducer
  - actions : `UPDATE_FILTER_MESSAGE`

*/