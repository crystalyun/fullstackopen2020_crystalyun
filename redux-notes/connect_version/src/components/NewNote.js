import React from 'react'
import { createNote } from '../reducers/noteReducer'
import { connect } from 'react-redux'

const NewNote = (props) => {
  // The first function is a regular action creator whereas the second function contains the additional dispatch to the store that was added by connect.
  // console.log(createNote)
  // console.log(props.createNote)

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    props.createNote(content)
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

// connect() adds the automatic dispatch to action creator functions, so that in React components, you can just directly reference props.createNote
const ConnectedNewNote = connect(
  null,
  { createNote: createNote }
)(NewNote)

export default ConnectedNewNote