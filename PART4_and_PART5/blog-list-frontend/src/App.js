import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import storage from './utils/storage'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    error: false
  })

  console.log('rerender App component...')

  // references to components with ref
  const BlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const user = storage.loadUser()
    setUser(user)
  }, [])

  const notifyWith = ({ notificationMsg, isError }) => {
    setNotification({
      message: notificationMsg,
      error: isError
    })

    setTimeout(() => {
      setNotification({
        message: null,
        error: false
      })}, 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      console.log('user logged in is ', user) // `user` is a javascript object in the form of { token, username, name }

      storage.saveUser(user)
      setUser(user)
      notifyWith({
        notificationMsg: `${user.name} welcome back!`,
        isError: false
      })
    } catch (exception) {
      // alert user of unsuccessful login
      notifyWith({
        notificationMsg: exception.response.data.error,
        isError: true
      })
    }
  }

  const handleLogout = () => {
    storage.logoutUser()
    setUser(null)
  }

  const handleCreateNewBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      console.log('new blog posted', newBlog)
      setBlogs(blogs.concat(newBlog))
      notifyWith({
        notificationMsg: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        isError: false
      })
      // Close create new blog form by changing the component `Togglable` `visible` state to false
      BlogFormRef.current.toggleVisibility()
    } catch(exception) {
      console.log(exception)
    }
  }

  const handleIncrementLikesByOne = async (blogObject) => {
    console.log('blog object received in App component : ', blogObject)
    const { user, likes, author, title, url, id } = blogObject

    const blogObjectUpdated = {
      user: user.id,
      likes: likes + 1,
      author,
      title,
      url
    }

    console.log('blog object to be sent to the server', blogObjectUpdated)

    const response = await blogService.update(id, blogObjectUpdated)
    console.log('likes count updated : ', response)

    setBlogs(blogs.map((blog) => blog.id === response.id ? { ...blog, likes: response.likes } : blog))
  }

  const handleRemoveBlog = async ({ id, title, author }) => {
    console.log('remove button clicked. blog id to delete is ', id)

    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
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
      <Notification notification={notification}/>
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