import React, { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { addBlog, deleteBlog, addVote, initializeBlogs, showNotificationWithTimeout, logInUser, logOutUser, loadUser } from './index'
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'
import axios from 'axios'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    console.log('effect to fetch USER data')
    const baseUrl = '/api/users'
    axios
      .get(baseUrl)
      .then(response => {
        console.log('fetch USER promise fulfilled')
        setUsers(response.data)
      })
  },[])

  const headings = [
    '',
    'blogs created'
  ]

  const match = useRouteMatch('/users/:id')
  const user = match
    ? users.find(user => user.id === match.params.id)
    : null

  return (
    <>
      <Switch>
        <Route path='/users/:id'>
          <User user={user} />
        </Route>
        <Route path='/users'> 
        <h2>Users</h2>
          <table>
            <thead>
              <tr>
                {headings.map(h => 
                  <th key={h}>{h}</th>           
                )}
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                return (
                  <tr key={user.id}>  
                    <td>
                      <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </td>
                    <td>
                      {user.blogs.length}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Route>
      </Switch>
    </>
  )
}

/*
NB: you will almost certainly stumble across the following error message during this exercise: TypeError: Cannot read property 'name' of undefined

The error message will occur if you refresh the page for an individual user.

The cause of the issue is that when we navigate directly to the page of an individual user, the React application has not yet received the data from the backend. One solution for fixing the problem is to use conditional rendering:

*/


const User = ({ user }) => {
  if (!user) {
    console.log('entered !user condition')
    return null
  } else {
    console.log('did not enter !user condition')
    console.log('user object print out ', user)
  }


  return (
    <>
      <h2>{user.name}</h2>

      <h4>added blogs</h4>

      <ul>
        {user.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)}
      </ul>
    </>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const loggedOnUser = useSelector(state => state.signedInUser)

  console.log('rerender App component...')
  console.log('loggedOnUser is ', loggedOnUser)

  const padding = {
    padding: 5
  }

  // references to components with ref
  const BlogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  const handleLogin = ({ username, password }) => {
    try {
      dispatch(logInUser(username, password))
        .then(user => {
          dispatch(showNotificationWithTimeout({
            message: `${user.name} welcome back!`,
            error: false,
            seconds: 10
          }))
        })
    } catch (exception) {
      // alert user of unsuccessful login
      dispatch(showNotificationWithTimeout({
        message: exception.response.data.error,
        error: true,
        seconds: 10
      }))
    }
  }

  const handleLogout = () => {
    dispatch(logOutUser())
  }

  const handleCreateNewBlog = async (blogObject) => {
    try {
      dispatch(addBlog(blogObject))

      dispatch(showNotificationWithTimeout({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        error: false,
        seconds: 10
      }))

      // Close create new blog form by changing the component `Togglable` `visible` state to false
      BlogFormRef.current.toggleVisibility()
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleIncrementLikesByOne = (blog) => {
    dispatch(addVote(blog))
  }

  const handleRemoveBlog = async ({ id, title, author }) => {
    console.log('remove button clicked. blog id to delete is ', id)

    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      dispatch(deleteBlog(id))
    }
  }

  if (!loggedOnUser) {
    return (
      <>
        <Notification notification={notification}/>
        <LoginForm
          handleLogin={handleLogin}
        />
      </>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/users">users</Link>
      </div>

      <h2>blogs</h2>

      <Notification notification={notification} />

      <p>{loggedOnUser.name} logged in<button onClick={handleLogout}>logout</button></p>

      <Switch>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create new blog" ref={BlogFormRef}>
            <BlogForm
              handleCreateNewBlog={handleCreateNewBlog}
            />
          </Togglable>

          {blogs.sort(byLikes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              handleIncrementLikesByOne={handleIncrementLikesByOne}
              handleRemoveBlog={handleRemoveBlog}
              user={loggedOnUser}
            />
          )}
        </Route>
      </Switch>
    </>
  )
}

export default App