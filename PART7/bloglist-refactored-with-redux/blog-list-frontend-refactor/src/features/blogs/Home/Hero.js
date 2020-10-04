import React, { useState } from 'react'
import { makeStyles, Button, Container, Typography, Grid, Dialog } from '@material-ui/core'
import AddBlogForm from '../AddBlogForm'
import { useSelector } from 'react-redux'

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

const Hero = () => {
  const currentUser = useSelector(state => state.auth.currentUser)

  if (currentUser.name) {
    return (
      <>
        <UserHero />
      </>
    )
  }

  return null
}

const UserHero = () => {
  const classes = useStyles()
  const [formOpen, setFormOpen] = useState(false)

  const handleClickOpen = () => {
      setFormOpen(true)
  }

  const handleClickClose = () => {
      setFormOpen(false)
  }

  return (
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
            <AddBlogForm handleClickClose={handleClickClose}/>
          </Dialog>
        </Grid>
      </Grid>
      </Container>
  )
}

export default Hero