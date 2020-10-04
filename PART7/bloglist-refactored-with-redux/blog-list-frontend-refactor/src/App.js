import React, { useEffect } from 'react'
import storage from './utils/storage'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from './features/auth/Login'
import { addCurrentUserFromLocalStorage } from './features/auth/authSlice'
import { fetchBlogs } from './features/blogs/blogsSlice'
import Header from './features/blogs/Header'
import { Route, Switch } from 'react-router-dom'
import Hero from './features/blogs/Home/Hero'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const user = storage.loadUser()
    if (user) {
        dispatch(addCurrentUserFromLocalStorage(user))
    }

    dispatch(fetchBlogs())
  })

  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/" component={Hero} />
        <Route path='/login' component={LoginForm} />
      </Switch>
    </>
  )
}

export default App
