import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import loginService from './services/login'
import storage from './utils/storage'
import { useSelector, useDispatch } from 'react-redux'
import { addBlog, deleteBlog, addVote, initializeBlogs, showNotificationWithTimeout } from './index'

const App = () => {
  const [user, setUser] = useState(null)
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)

  console.log('rerender App component...')

  // references to components with ref
  const BlogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])


  useEffect(() => {
    const user = storage.loadUser()
    setUser(user)
  }, [])

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      console.log('user logged in is ', user) // `user` is a javascript object in the form of { token, username, name }

      storage.saveUser(user)
      setUser(user)
      dispatch(showNotificationWithTimeout({
        message: `${user.name} welcome back!`,
        error: false,
        seconds: 10
      }))
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
    storage.logoutUser()
    setUser(null)
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

  if (!user) {
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

      <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>

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
          user={user}
        />
      )}
    </>
  )
}

export default App