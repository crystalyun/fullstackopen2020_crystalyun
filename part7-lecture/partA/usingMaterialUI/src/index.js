import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
  useHistory,
  useRouteMatch
} from "react-router-dom"

const Home = () => (
  <div> 
    <h2>TKTL notes app</h2> 
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p> 
  </div>
)

const Note = ({ note }) => {
  // // use useParams() react-router hook to access the url param.
  // const id = useParams().id
  // const note = notes.find(n => n.id === Number(id))
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'tärkeä' : ''}</strong></div>
    </div>
  )
}

// The ability to click a name is implemented with the component Link, and clicking the name of a note whose id is 3 would trigger an event that changes the address of the browser into notes/3.
const Notes = ({notes}) => (
  <div>
    <h2>Notes</h2>

    {/* before using Material UI
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>{note.content}</Link>
        </li>
      )}
    </ul> */}

    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
              </TableCell>
              <TableCell>
                {note.user}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

const Users = () => (
  <div>
    <h2>TKTL notes app</h2>
    <ul>
      <li>Matti Luukkainen</li>
      <li>Juha Tauriainen</li>
      <li>Arto Hellas</li>
    </ul>
  </div>
)

// With user log in, we call the push method of the history object. The history.push('/') call causes the browser's url to change to / and the application renders the corresponding component Home.
const Login = (props) => {
  const history = useHistory()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('mluukkai') // set `user` state to `mluukkai`.
    history.push('/')
  }

  return (
    <div>
      <h2>login</h2>

      {/* before using material UI
      <form onSubmit={onSubmit}>
        <div>
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form> */}

      <form onSubmit={onSubmit}>
        <div>
          <TextField label="username :)" />
        </div>
        <div>
          <TextField label="password :)" type="password" />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>

    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only Javascript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])

  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  const padding = {
    padding: 5
  }

  const match = useRouteMatch('/notes/:id')
  console.log('print out match', match)
  const note = match
  ? notes.find(note => note.id === Number(match.params.id))
  : null

  return (
    <Container>
      <div>

        {(message &&
          <Alert severity="success">
            {message}
          </Alert>
        )}

        {/* before using materialUI
        <div>
          <Link style={padding} to="/">home</Link>
          <Link style={padding} to="/notes">notes</Link>
          <Link style={padding} to="/users">users</Link>
          {user
            ? <em>{user} logged in</em>
            : <Link style={padding} to="/login">login</Link>
          }
        </div> */}

        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              home
            </Button>
            <Button color="inherit" component={Link} to="/notes">
              notes
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            {user
              ? <em>{user} logged in</em>
              : <Button color="inherit" component={Link} to="/login">
                login
              </Button>
            }           
          </Toolbar>
        </AppBar>

        {/* mapping between URL and React Components */}
        <Switch>
          <Route path="/notes/:id">
            <Note note={note} />
          </Route>
          <Route path="/notes">
            <Notes notes={notes} />
          </Route>
          <Route path="/users">
            {user ? <Users /> : <Redirect to="/login" />}
          </Route>
          <Route path="/login">
            <Login onLogin={login} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      {/* footer elements */}
        <div>
          <br />
          <em>Note app, Department of Computer Science 2020</em>
        </div>
      </div>
    </Container>
  )
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
)