import React, { useEffect } from 'react'
import NewNote from './components/NewNote'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { initializeNotes } from './reducers/noteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()

  // The solution is elegant thanks to redux-thunk middleware. The initialization logic for the notes has been completely separated to outside the React component.
  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch])

  // useEffect(() => {
  //   noteService
  //     .getAll()
  //     .then(notes => dispatch(initializeNotes(notes)))
  // }, [dispatch])

  return(
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App