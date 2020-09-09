import React, { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Users from './components/Users'
import BlogCard from './components/BlogCard'
import BlogModal from './components/BlogModal'
import { useSelector, useDispatch } from 'react-redux'
import { addBlog, initializeBlogs } from './reducers/blogReducer'
import { logInUser, logOutUser, loadUser } from './reducers/signInUserReducer'
import { Link as RouterLink, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom'
import { makeStyles, Button, AppBar, Container, Toolbar, Typography, Link, Grid, CssBaseline, Dialog } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#FFFFFF',
  },
  link: {
    margin: theme.spacing(1, 1),
  },
  cardText: {
    color: '#FFFFFF'
  },
  heroContent: {
    padding: '32px 16px 80px 24px',
    marginTop: '8px',
    marginBottom: '8px',
  },
}))

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const loggedOnUser = useSelector(state => state.signedInUser)
  const [formOpen, setFormOpen] = useState(false)
  const [blogModalOpen, setBlogModalOpen] = useState(true)
  const classes = useStyles()

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

  const handleLogin = ({ username, password }) => {
    dispatch(logInUser(username, password))
  }

  const handleLogout = () => {
    dispatch(logOutUser())
  }

  const handleCreateNewBlog = async (blogObject) => {
    handleClickClose()
    dispatch(addBlog(blogObject))
  }

  const handleClickOpen = () => {
    setFormOpen(true)
  }

  const handleClickClose = () => {
    setFormOpen(false)
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
        <AppBar className={classes.appBar}>
          <Container>
            <Toolbar>
              <Typography variant="h6" style={{ margin: '0px 25px 0px 0px' }}>
                Blog
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>

        <Toolbar />

        <Notification notification={notification} />

        <LoginForm handleLogin={handleLogin} />
        
      </>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

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
      
      <Switch>
        <Route path="/users">
            <Users />
        </Route>
        <Route path="/blogs/:id">
          {/* { 
            (!blogModalOpen) && <Redirect to="/" />
          } */}
          <Dialog open={blogModalOpen} onClose={handleClickCloseBlogModal} scroll='body' maxWidth='sm' fullWidth={true}>
            <BlogModal
              blog={blog}
            />
          </Dialog>
        </Route>
        <Route path="/">

          {/* Hero unit */}
          <Container maxWidth="lg">
          <Grid container id="hero" className={classes.heroContent}>
            <Grid item xs={12} sm={5}>
              <Typography variant="h3" className={classes.cardText} gutterBottom style={{ position: 'relative' }}>
                Tell us your story
              </Typography>
              <Typography variant="body1" className={classes.cardText} gutterBottom style={{ position: 'relative' }}>
                Tell us your unique and interesting stories. Rainy days in Paris with Baguette and Cigaratte... Or it could be a EDM filled club days in NYC...
              </Typography>
              <Button color="primary" variant="contained" fullWidth onClick={handleClickOpen} style={{ marginTop: '20px'}}>Share</Button>

              <Dialog open={formOpen} aria-labelledby="form-dialog-title">
                <BlogForm handleCreateNewBlog={handleCreateNewBlog} handleClickClose={handleClickClose}/>
              </Dialog>
            </Grid>
          </Grid>
          </Container>
          {/* Hero ends */}

          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {blogs.sort(byLikes).map(blog => 
                <BlogCard 
                  key={blog.id}
                  blog={blog}
                  handleClickOpenBlogModal={handleClickOpenBlogModal}
                />)}
            </Grid>
          </Container>

        </Route>
      </Switch>
    </>
  )
}

export default App

