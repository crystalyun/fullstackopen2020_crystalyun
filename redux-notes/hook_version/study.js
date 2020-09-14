// before using thunks
/*

**noteReducer.js**
export const initializeNotes = (notes) => {
  return {
    type: 'INIT_NOTES',
    data: notes,
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
const App = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    noteService
      .getAll()
      .then(notes => dispatch(initializeNotes(notes)))
  }, [dispatch])

  return(
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}


*/