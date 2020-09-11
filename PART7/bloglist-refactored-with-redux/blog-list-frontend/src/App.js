import React, { useEffect, useState } from 'react'
import Home from './components/Home'
import Notification from './components/Notification'
import Users from './components/Users'
import BlogModal from './components/BlogModal'
import Login from './components/Login'
import { useSelector, useDispatch } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { logOutUser, loadUser } from './reducers/signInUserReducer'
import { Link as RouterLink, Switch, Route, useRouteMatch, Redirect, useLocation } from 'react-router-dom'
import { makeStyles, Button, AppBar, Container, Toolbar, Typography, Link, CssBaseline, Dialog } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#FFFFFF',
  },
  link: {
    margin: theme.spacing(1, 1),
  },
}))

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const loggedOnUser = useSelector(state => state.signedInUser)
  const [blogModalOpen, setBlogModalOpen] = useState(true)
  const classes = useStyles()
  let location = useLocation()

  let modal = location.state && location.state.modal

  console.log('rerender App component...')

  const match = useRouteMatch('/blogs/:id')
  const blog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  useEffect(() => {
    if (loggedOnUser) {
      dispatch(initializeBlogs())
    }
  }, [dispatch, loggedOnUser])

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(logOutUser())
  }

  const handleClickOpenBlogModal = () => {
    setBlogModalOpen(true)
  }

  const handleClickCloseBlogModal = () => {
    setBlogModalOpen(false)
  }


  if (!loggedOnUser) {
    return (
      <>
        <Redirect to="/login" />
      </>
    )
  }


  return (
    <>
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Container maxWidth="lg">
          <Toolbar>
            <Typography variant="h6" style={{ margin: '0px 25px 0px 0px' }}>
              Blog
            </Typography>
            <Link to='/' component={RouterLink} className={classes.link}>HOME</Link>
            <Link to='/users' component={RouterLink} className={classes.link} style={{ flex: '1' }}>USERS</Link>
            <Typography variant="body2" style={{ color: '#442C2E', marginRight: '5px'}}><b>{loggedOnUser.name}</b> logged in</Typography>
            <Button color="primary" variant="contained" onClick={handleLogout}>Log out</Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Toolbar />

      <Container maxWidth="lg">
        <Notification notification={notification} />
      </Container>
      
      <Switch location={modal || location}>
        <Route exact path="/" children={<Home blogs={blogs} handleClickOpenBlogModal={handleClickOpenBlogModal}/>} />
        <Route path="/login" children={<Login />} />
        <Route path="/users" children={<Users />} />
        <Route path="/blogs/:id" children={<Container maxWidth="md" style={{ marginTop: '16px' }}><BlogModal blog={blog} /></Container>} />
      </Switch>

      {/* Show the modal when a modal is set */}
      {modal && <Route path="/blogs/:id" children={<Dialog open={blogModalOpen} onClose={handleClickCloseBlogModal} scroll='body' maxWidth='sm' fullWidth={true}><BlogModal blog={blog} /></Dialog>} />}

    </>
  )
}

export default App


