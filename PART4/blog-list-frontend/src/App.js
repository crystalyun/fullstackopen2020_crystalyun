import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

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


const BlogLists = ({blogs, user}) => {
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({username, password})
      console.log('user logged in is ', user)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      // alert user of unsuccessful login
    }
    
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
      <BlogLists
        blogs={blogs}
        user={user}
      />
  )
}

export default App