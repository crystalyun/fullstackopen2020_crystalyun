import React, { useState, useEffect, useRef } from 'react'
import BlogLists from './components/BlogLists'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    error: false
  })

  // references to components with ref
  const BlogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({username, password})
      console.log('user logged in is ', user) // `user` is a javascript object in the form of { token, username, name }

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // alert user of unsuccessful login
      setNotification({ message: exception.response.data.error, error: true })

      setTimeout(() => {
        setNotification({ message: null, error: false })
        setUsername('')
        setPassword('')
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (blogObject) => {
    blogService.setToken(user.token)
    const response = await blogService.create(blogObject)
    console.log('new blog posted', response)

    setBlogs(blogs.concat(response))
    setNotification({message: `a new blog ${blogObject.title} by ${blogObject.author} added`, error: false})

    // close create new blog form by changing the component `Togglable` `visible` state to false
    BlogFormRef.current.toggleVisibility()

    setTimeout(() => {
      setNotification({ message: null, error: false })
    }, 5000)
  }

  if (user === null) {
    return (
      <>
        <Notification notification={notification}/>
        <LoginForm 
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </>
      
    )
  }

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

        
        <BlogLists
          blogs={blogs}
          user={user}
          handleLogout={handleLogout}
        />
      </>
      
  )
}

export default App