import React from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { makeStyles, Button, Typography, Link, Grid, Card, CardContent, CardActionArea, CardActions, CardMedia, IconButton } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import { likeBlog, unlikeBlog } from '../reducers/blogReducer'

const useStyles = makeStyles((theme) => ({
    cardMedia: {
      paddingTop: '80.25%', // 16:9
    },
    actionArea: {
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    },
    unliked: {
      color: theme.palette.grey[600]
    },
    liked: {
        color: theme.palette.secondary.main
    },
    card: {
        maxWidth: 300,
        height: 380,
        boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
        "&:hover": {
        boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.4)"
        },
        borderRadius: 12,
        position: 'relative'
    },
    cardActions: {
        position: 'absolute',
        bottom: 0,
    },
    cardContent : {
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical'  
    }
}))

const BlogCard = ({ blog, handleClickOpenBlogModal }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    let location = useLocation()

    const handleClickLikeButton = (blog) => {
      if (blog.didUserLike) {
        dispatch(unlikeBlog(blog.id))
      } else {
        dispatch(likeBlog(blog.id))
      }
    }

    const randomImageUrl = `https://source.unsplash.com/random?sig=${Math.floor(Math.random()*10)}`
    return (
      <Grid item xs={12} sm={6} md={3} align="center">
        <Card className={classes.card}>
          <CardActionArea className={classes.actionArea} component={RouterLink} to={{ pathname: `/blogs/${blog.id}`, state: { modal: location } }} onClick={handleClickOpenBlogModal}>
            <CardMedia
              className={classes.cardMedia}
              image={randomImageUrl}
            />
            <CardContent>
              <Typography className={classes.cardContent} gutterBottom variant="body1" component="h4" display='inline'>
                {blog.title}
              </Typography>
              <Typography className={classes.cardContent} gutterBottom variant="body2" component="p" display='inline'>
                &nbsp;by {blog.author}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions disableSpacing className={classes.cardActions}>
            <Button size="small" onClick={handleClickOpenBlogModal}>
              <Link to={{ pathname: `/blogs/${blog.id}`, state: { modal: location } }} component={RouterLink}>See More</Link>
            </Button>
            <IconButton className={blog.didUserLike ? classes.liked : classes.unliked} onClick={() => handleClickLikeButton(blog)} aria-label="add to favorites">
              <FavoriteIcon  />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
    )
}

export default BlogCard