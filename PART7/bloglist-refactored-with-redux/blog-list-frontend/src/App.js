import React, { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import { useSelector, useDispatch } from 'react-redux'
import { addBlog, deleteBlog, addVote, initializeBlogs, showNotificationWithTimeout, logInUser, logOutUser, loadUser } from './index'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const loggedOnUser = useSelector(state => state.signedInUser)

  console.log('rerender App component...')
  console.log('loggedOnUser is ', loggedOnUser)

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
      <h2>blogs</h2>

      <Notification notification={notification} />

      <p>{loggedOnUser.name} logged in<button onClick={handleLogout}>logout</button></p>

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
    </>
  )
}

export default App