import React from 'react'
import { connect } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong>{note.important ? 'important' : 'not important'}</strong>
    </li>
  )
}

// The Notes component can access the state of the store directly, e.g. through props.notes that contains the list of notes.

// `Notes` component is a presentaional component
const Notes = (props) => {
  return (
    <ul>
      {props.notes.map(note =>
        <Note
          key={note.id}
          note={note}
          handleClick={() =>
            props.toggleImportanceOf(note.id)
          }
        />
      )}
    </ul>
  )
}

const mapStateToProps = (state) => {
  if ( state.filter === 'ALL' ) {
    return {
      notes: state.notes
    }
  }
  return {
    notes: (state.filter === 'IMPORTANT'
      ? state.notes.filter(note => note.important)
      : state.notes.filter(note => !note.important)
    )
  }
} 

const mapDispatchToProps = {
  toggleImportanceOf : toggleImportanceOf
}

// ConnectedNotes component is a container component and also a High Order Component in that 
// ConnectedNotes component accepts a "regular" component as its paramter (aka `Notes`), that then returns a new "regular" component as its return value.
const ConnectedNotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notes)

export default ConnectedNotes