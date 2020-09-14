// before using thunks

/*
**noteReducer.js**

export const createNote = (data) => {
  return {
    type: 'NEW_NOTE',
    data,
  }
}

const noteReducer = (state = [], action) => {
  switch(action.type) {
  case 'NEW_NOTE':
    return [...state, action.data]
  case 'INIT_NOTES':
    return action.data
  default:
    return state

**NewNote.js**
//  it is not great that the communication with the server happens inside the functions of the components. It would be better if the communication could be abstracted away from the components, such that they don't have to do anything else but call the appropriate action creator. 


const NewNote = (props) => {
  const dispatch = useDispatch()

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''

    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}
*/