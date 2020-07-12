import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Axios from 'axios'

const LoginForm = (props) => {
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={props.handleLogin}>
        <div>
          username
            <input
              type="text"
              value={props.username}
              name="Username"
              onChange={({ target }) => props.setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
              type="password"
              value={props.password}
              name="Password"
              onChange={({ target }) => props.setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}


const BlogLists = ({blogs}) => {
  return (
    <div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

const BlogForm = (props) => {
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={props.handleCreateNewBlog}>
        <div>
          title:
            <input 
              type="text"
              value={props.title}
              name="Title"
              onChange={({ target }) => props.setTitle(target.value)}
            />
        </div>
        <div>
          author:
            <input 
              type="text"
              value={props.author}
              name="Author"
              onChange={({ target }) => props.setAuthor(target.value)}
            />
        </div>
        <div>
          url:
            <input 
              type="text"
              value={props.url}
              name="Url"
              onChange={({ target }) => props.setUrl(target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

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
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    console.log('create new blog button clicked')

    blogService.setToken(user.token)
    const response = await blogService.create({ title, author, url })
    console.log('new blog posted', response)

    setBlogs(blogs.concat(response))

    setUrl('')
    setTitle('')
    setAuthor('')
  }

  if (user === null) {
    return (
      <LoginForm 
        handleLogin={handleLogin}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
      />
    )
  }

  return (
      <>
        <h2>blogs</h2>
        <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
        <BlogForm 
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
          handleCreateNewBlog={handleCreateNewBlog}
        />
        <BlogLists
          blogs={blogs}
          user={user}
          handleLogout={handleLogout}
        />
      </>
      
  )
}

export default App