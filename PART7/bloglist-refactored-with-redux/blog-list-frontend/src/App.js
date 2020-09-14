import React, { useEffect, useState } from 'react'
import Home from './components/Home'
import Users from './components/Users'
import { BlogModalFullPageView, BlogModalPopUpView } from './components/BlogModal'
import Login from './components/Login'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { loadUser } from './reducers/signInUserReducer'
import { Switch, Route, useRouteMatch, Redirect, useLocation, useHistory } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'

// https://ui.dev/react-router-v4-protected-routes-authentication/
const PrivateRoute = ({ component: Component, isUserFoundInLocalStorage, ...rest }) => {
  if (isUserFoundInLocalStorage === null) {
    return null
  }

  return (
    <Route {...rest} render={(props) => (
      isUserFoundInLocalStorage
    ? <Component {...props} {...rest} />
    : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    )} />
  )
}

const App = () => {
  const dispatch = useDispatch()
  const mystate = useSelector(state => state)
  const blogs = useSelector(state => state.blogs)
  const loggedOnUser = useSelector(state => state.signedInUser)
  const isUserFoundInLocalStorage = useSelector(state => state.isUserFoundInLocalStorage)
  const [blogModalOpen, setBlogModalOpen] = useState(true)
  const location = useLocation()
  const history = useHistory()

  let modal = location.state && location.state.modal
  

  console.log('rerender App component...')
  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  useEffect(() => {
    dispatch(loadUser())
     .then((result) => {
       console.log(result)
       console.log('foo', mystate)
     })
  }, [dispatch])

  useEffect(() => {
    if (loggedOnUser) {
      console.log('fetching ?')
      dispatch(initializeBlogs())
    }
  }, [dispatch, loggedOnUser])

  const handleClickOpenBlogModal = () => {
    setBlogModalOpen(true)
  }

  const handleClickCloseBlogModal = () => {
    setBlogModalOpen(false)
    history.push('/')
  }

  return (
    <>
      <CssBaseline />

      <Switch location={modal || location}>
        <PrivateRoute exact path="/" component={Home} isUserFoundInLocalStorage={isUserFoundInLocalStorage} blogs={blogs} handleClickOpenBlogModal={handleClickOpenBlogModal}/>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/users" component={Users} isUserFoundInLocalStorage={isUserFoundInLocalStorage}/>
        <PrivateRoute path="/blogs/:id" component={BlogModalFullPageView} isUserFoundInLocalStorage={isUserFoundInLocalStorage} blog={blog} />  
      </Switch>

      {/* Show the modal when a modal is set */}
      {modal && <PrivateRoute path="/blogs/:id" component={BlogModalPopUpView} isUserFoundInLocalStorage={isUserFoundInLocalStorage} blog={blog} blogModalOpen={blogModalOpen} handleClickCloseBlogModal={handleClickCloseBlogModal} />}

    </>
  )
}

export default App
