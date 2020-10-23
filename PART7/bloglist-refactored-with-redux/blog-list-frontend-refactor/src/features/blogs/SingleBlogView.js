import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, makeStyles, CssBaseline, Paper, Avatar, Typography, Divider, IconButton, Link, Container, Dialog } from '@material-ui/core'
import helper from '../../utils/helper'
import PostAuthor from './PostAuthor'
import CommentsList from './comments/CommentsList'
import { toggleLikeBlog } from './blogsSlice'
import { selectPostById } from './posts/postsSlice'
import CommentForm from './comments/CommentForm'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ModeCommentIcon from '@material-ui/icons/ModeComment'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
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


const SingleBlogView = ({ post }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const avatarSrc = helper.randomAvatarImageGenerator(1, 71)
    const ref = useRef(null)

    const handleClickFocus = () => {
        ref.current.focus()
    }

    const handleClickLikeButton = (post) => {
        dispatch(toggleLikeBlog(post))
    }

    if (!post) {
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
            <Typography variant="body2" className={classes.topTypography}>
                <PostAuthor userId={post.user} />
            </Typography>
          </Grid>
          <Divider light/>
  
          {/* Middle part with main content and comments with scroll*/}
          <Grid item className={classes.middle}>
  
            {/* Middle - main content */}
            <div className={classes.content}>
              <Typography variant="body2" className={classes.contentLabelTypography}>Title</Typography>
              <Typography variant="body2" className={classes.contentBodyTypography}>{post.title}</Typography>
              <Typography variant="body2" className={classes.contentLabelTypography}>Author</Typography>
              <Typography variant="body2" className={classes.contentBodyTypography}>
                <PostAuthor userId={post.user} />
              </Typography>
              <Typography variant="body2" display="inline" className={classes.contentLinkTypography}>
                <Link href={post.url} target="_blank" rel="noopener" color="inherit">
                  Go visit 
                </Link>
              </Typography>
            </div>
  
            {/* Middle - comment part */}
            <CommentsList postId={post.id} />

          </Grid>
          <Divider light/>
          
          {/* Footer part with like and comment button, and comment write form */}
          <Grid item>
            <IconButton className={post.didUserLike ? classes.liked : classes.unliked} onClick={() => handleClickLikeButton(post)} aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton onClick={handleClickFocus}>
              <ModeCommentIcon />
            </IconButton>
            <Typography variant="body2" style={{padding: '0px 12px'}}>Liked by {post.likesCount} users</Typography>
          </Grid>
  
  
          <Divider light/>
          
          <CommentForm postId={post.id} ref={ref}/>
  
        </Grid>
      </Grid>
    )
}

export const SingleBlogFullPageView = ({ match }) => {
  const { blogId } = match.params

  const post = useSelector(state => selectPostById(state, blogId))

  return (
    <Container maxWidth="md" style={{ marginTop: '16px' }}>
      <SingleBlogView post={post} />
    </Container>
  )
}

export const SingleBlogPopupView = ({ match }) => {
  const history = useHistory()
  const { blogId } = match.params
  const [modalOpen, setModalOpen] = useState(true)

  const post = useSelector(state => selectPostById(state, blogId))

  const handleClickOpenModal = () => {
    setModalOpen(true)
  }

  const handleClickCloseModal = () => {
    setModalOpen(false)
    history.push('/')
  }

  return (
    <Dialog
      open={modalOpen}
      onClose={handleClickCloseModal}
      scroll='body'
      maxWidth='sm'
      fullWidth={true}
    >
      <SingleBlogView post={post} />
    </Dialog>
  )
}