import React, { useEffect, useState, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { addBlog, addVote, initializeBlogs, showNotificationWithTimeout, logInUser, logOutUser, loadUser } from './index'
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

const BlogInfo = ({ blog, handleIncrementLikesByOne }) => {
  const [comments, setComments] = useState(null)

  // useEffect only run when blog is available and loaded from server.
  useEffect(() => {
    if (blog) {
      console.log('effect to fetch COMMENTS data once blog is loaded.')
      axios
      .get(`/api/blogs/${blog.id}/comments`)
      .then(response => {
        console.log('fetch COMMENTS promise fulfilled')
        setComments(response.data)
      })
    } else {
      console.log('wait fetch COMMENTS untill blog is fully loaded.')
    }
  }, [blog])

  if (!blog || !comments) {
    console.log('not all blog and comments loaded from backend.')
    return null
  } else {
    console.log('both blog and comments loaded from backend.')
  }

  return (
    <>
      <h2>{blog.title} {blog.author}</h2>

      <a href={blog.url}>{blog.url}</a>

      <div>{blog.likes} likes <button onClick={() => handleIncrementLikesByOne(blog)}>like</button></div>

      added by {blog.user.name}

      <h4>comments</h4>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.message}</li>)}
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

  const padding = {
    padding: 5
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    marginBottom: 5,
    borderWidth: 1
  }

  const navBarStyle = {
    backgroundColor: 'grey'
  }

  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

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
      // Close `create new blog` form by changing the component `Togglable` `visible` state to false
      BlogFormRef.current.toggleVisibility()
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleIncrementLikesByOne = (blog) => {
    dispatch(addVote(blog))
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
      <div style={navBarStyle}>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/users">users</Link>
        <span>{loggedOnUser.name} logged in </span>
        <button onClick={handleLogout}>logout</button>
      </div>

      <h2>blogs</h2>

      <Notification notification={notification} />

      <Switch>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/blogs/:id">
          <BlogInfo blog={blog} handleIncrementLikesByOne={handleIncrementLikesByOne}/>
        </Route>
        <Route path="/">
          <Togglable buttonLabel="create new blog" ref={BlogFormRef}>
            <BlogForm
              handleCreateNewBlog={handleCreateNewBlog}
            />
          </Togglable>

          {blogs.sort(byLikes).map(blog =>
            <div style={blogStyle} key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </div>
          )}

        </Route>
      </Switch>
    </>
  )
}

export default App