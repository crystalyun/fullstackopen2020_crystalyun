import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import BlogForm from './BlogForm'
import BlogCard from './BlogCard'
import { addBlog } from '../reducers/blogReducer'
import { makeStyles, Button, Container, Typography, Grid, Dialog } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  cardText: {
    color: '#FFFFFF'
  },
  heroContent: {
    padding: '32px 16px 80px 24px',
    marginTop: '8px',
    marginBottom: '8px',
  },
}))

const Home = ({ blogs, handleClickOpenBlogModal }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [formOpen, setFormOpen] = useState(false)

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

  const byLikes = (b1, b2) => b2.likes - b1.likes

  return (
    <>
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
    </>
  )
}

export default Home