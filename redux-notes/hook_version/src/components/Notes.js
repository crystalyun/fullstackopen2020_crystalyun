import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

/*
The useDispatch-hook provides any React component access to the dispatch-function of the redux-store defined in store.js. This allows all components to make changes to the state of the redux-store.

The component can access the notes stored in the store with the useSelector-hook of the react-redux library.

*/

// Redux applications introduce the concept of two different types of components: containers and UI components. Containers are higher-order components that talk to the store and pass pieces of its state as props down to the UI components, which keep track of little or no local state themselves.

// presentational component
const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong>{note.important ? 'important' : 'not important'}</strong>
    </li>
  )
}

// container component
const Notes = () => {
  const dispatch = useDispatch()

  // step 1 : retrieve all notes from state
  //const notes = useSelector(state => state.notes)

  // step 2: retrieve filtered notes based on filter values from state
  // const notes = useSelector(state => {
  //     if ( state.filter === 'ALL' ) {
  //         return state.notes
  //     }
  //     return state.filter === 'IMPORTANT'
  //       ? state.notes.filter(note => note.important)
  //       : state.notes.filter(note => !note.important)
  // })

  // step 3: destructure state object props received in useSelector
  const notes = useSelector(({ filter, notes }) => {
    if ( filter === 'ALL' ) {
      return notes
    }
    return filter === 'IMPORTANT'
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })

  return (
    <ul>
      {notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            dispatch(toggleImportanceOf(note))
          }
        />
      )}
    </ul>
  )
}

export default Notes