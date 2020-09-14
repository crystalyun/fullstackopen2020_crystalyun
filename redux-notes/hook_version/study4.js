// after using thunks

/*
**noteReducer.js**

export const createNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch({
      type: 'NEW_NOTE',
      data: newNote,
    })
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

**App.js**
const NewNote = () => {
  const dispatch = useDispatch()
  
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    
    dispatch(createNote(content))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">lisää</button>
    </form>
  )
}

*/