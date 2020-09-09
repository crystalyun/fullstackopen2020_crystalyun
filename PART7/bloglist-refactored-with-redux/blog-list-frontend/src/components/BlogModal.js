import React, { useRef } from 'react'
import { Grid, makeStyles, CssBaseline, Paper, Avatar, Typography, Divider, IconButton, Link } from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import CommentView from './CommentView'
import CommentForm from './CommentForm'
import helper from '../utils/helper'
import { likeBlog, unlikeBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(2,2),
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  top : {
    padding: '16px',
    display: 'flex',
    alignItems: 'center'
  },
  topTypography: {
    fontWeight: '600',
    marginLeft: '14px',
    fontSize: '12.5px'
  },
  middle: {
    height: '420px',
    wordBreak: 'break-word',
    padding: '16px 12px',
    overflowX: 'hidden',
    overflowY: 'scroll',
    "&::-webkit-scrollbar": {
      display: 'none'
    },
    "scrollbar-width": "none" /* Firefox hide scollbar */
  },
  content: {
    marginBottom: '16px'
  },
  contentLabelTypography: {
    fontWeight: '600'
  },
  contentBodyTypography: {
    padding: theme.spacing(1)
  },
  contentLinkTypography: {
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    fontWeight: '600'
  },
  unliked: {
    color: theme.palette.grey[600]
  },
  liked: {
      color: theme.palette.secondary.main
  },
}))

const BlogModal = ({ blog }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const avatarSrc = helper.randomAvatarImageGenerator(1, 71)

  const ref = useRef(null)

  const handleClickFocus = () => {
    ref.current.focus()
  }

  const handleClickLikeButton = (blog) => {
    if (blog.didUserLike) {
      dispatch(unlikeBlog(blog.id))
    } else {
      dispatch(likeBlog(blog.id))
    }
  }

  if (!blog) {
    console.log('blog not yet fetched from the server.')
    return null
  }

  return (
    <Grid container>
      <CssBaseline />
      
      <Grid item xs={false} sm={6} md={7} className={classes.image} />

      <Grid item xs={12} sm={6} md={5} component={Paper}>

        {/* Top part with avatar and username in bold */}
        <Grid item className={classes.top}>
          <Avatar src={avatarSrc} />
          <Typography variant="body2" className={classes.topTypography}>{blog.user.name}</Typography>
        </Grid>
        <Divider light/>

        {/* Middle part with main content and comments with scroll*/}
        <Grid item className={classes.middle}>

          {/* Middle - main content */}
          <div className={classes.content}>
            <Typography variant="body2" className={classes.contentLabelTypography}>Title</Typography>
            <Typography variant="body2" className={classes.contentBodyTypography}>{blog.title}</Typography>
            <Typography variant="body2" className={classes.contentLabelTypography}>Written by</Typography>
            <Typography variant="body2" className={classes.contentBodyTypography}>{blog.author}</Typography>
            <Typography variant="body2" display="inline" className={classes.contentLinkTypography}>
              <Link href={blog.url} target="_blank" rel="noopener" color="inherit">
                Go visit 
              </Link>
            </Typography>
          </div>

          {/* Middle - comment part */}
          {blog.comments.map(comment => 
            <CommentView key={comment.id} comment={comment}/>
          )}


          

        

        </Grid>
        <Divider light/>
        
        {/* Footer part with like and comment button, and comment write form */}
        <Grid item>
          <IconButton className={blog.didUserLike ? classes.liked : classes.unliked} onClick={() => handleClickLikeButton(blog)} aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton onClick={handleClickFocus}>
            <ModeCommentIcon />
          </IconButton>
          <Typography variant="body2" style={{padding: '0px 12px'}}>Liked by {blog.likesCount} users</Typography>
        </Grid>


        <Divider light/>
        
        <CommentForm blog={blog} ref={ref}/>

      </Grid>
    </Grid>
  )
}

export default BlogModal

