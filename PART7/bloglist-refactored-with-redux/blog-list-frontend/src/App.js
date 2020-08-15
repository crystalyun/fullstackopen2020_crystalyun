import React, { useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import Users from './components/Users'
import Blog from './components/Blog'
import { useSelector, useDispatch } from 'react-redux'
import { addBlog, addVote, initializeBlogs } from './reducers/blogReducer'
import { showNotificationWithTimeout } from './reducers/notificationReducer'
import { logInUser, logOutUser, loadUser } from './reducers/signInUserReducer'
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const loggedOnUser = useSelector(state => state.signedInUser)

  console.log('rerender App component...')
  console.log('App rerender : loggedOnUser redux store state is : ', loggedOnUser)

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
          <Blog blog={blog} handleIncrementLikesByOne={handleIncrementLikesByOne}/>
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