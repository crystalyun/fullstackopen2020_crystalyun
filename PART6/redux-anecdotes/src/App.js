import React from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
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
 - actions : `INCREMENT_VOTE`, `ADD_ANECDOTE`

notification
  - has notificationReducer
  - actions : `DISPLAY_NOTIFICATION`, `REMOVE_NOTIFICATION`

filter
  - has filterReducer
  - actions : `UPDATE_FILTER_MESSAGE`

*/