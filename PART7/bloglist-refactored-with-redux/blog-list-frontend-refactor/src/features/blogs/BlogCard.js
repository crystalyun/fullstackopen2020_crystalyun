import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, Button, Typography, Link, Grid, Card, CardContent, CardActionArea, CardActions, CardMedia, IconButton } from '@material-ui/core'
import { selectPostById } from './posts/postsSlice'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ModeCommentIcon from '@material-ui/icons/ModeComment'
import { toggleLikeBlog } from './blogsSlice'
import PostAuthor from './PostAuthor'
import TimeAgo from './TimeAgo'

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
        maxWidth: 284,
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

const BlogCard = ({ postId, handleClickOpenBlogModal }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const post = useSelector(state => selectPostById(state, postId))
    let location = useLocation()

    const randomImageUrl = `https://source.unsplash.com/random?sig=${Math.floor(Math.random()*10)}`

    const handleClickLikeButton = (post) => {
        dispatch(toggleLikeBlog(post))
    }

    return (
        <Grid item xs={12} sm={6} md={3} align="center">
            <Card className={classes.card}>
                <CardActionArea className={classes.actionArea} component={RouterLink} to={{ pathname: `/blogs/${post.id}`, state: { modal: location } }} onClick={handleClickOpenBlogModal}>
                    <CardMedia
                    className={classes.cardMedia}
                    image={randomImageUrl}
                    />
                    <CardContent>
                    <Typography className={classes.cardContent} gutterBottom variant="body1" component="h4" display='inline'>
                        {post.title}
                    </Typography>
                    <Typography className={classes.cardContent} gutterBottom variant="body2" component="p" display='inline'>
                        <PostAuthor userId={post.user} />
                        <TimeAgo ISOtimestampStr={post.createdAt} />
                    </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing className={classes.cardActions}>
                    <IconButton
                        onClick={handleClickOpenBlogModal}
                        component={RouterLink}
                        to={{ pathname: `/blogs/${post.id}`, state: { modal: location } }}>
                        <ModeCommentIcon />
                    </IconButton>
                    <Typography component='p'>{post.comments.length}</Typography>

                    <IconButton className={post.didUserLike ? classes.liked : classes.unliked} onClick={() => handleClickLikeButton(post)} aria-label="add to favorites">
                        <FavoriteIcon  />
                    </IconButton>
                    <Typography component='p'>{post.likesCount}</Typography>
                </CardActions>
            </Card>
      </Grid>
    )
}

export default BlogCard