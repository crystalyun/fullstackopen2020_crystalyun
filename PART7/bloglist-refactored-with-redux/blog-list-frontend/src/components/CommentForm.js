import React, { useState } from 'react'
import { Button, Grid, makeStyles, InputBase } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '55px'
  },
  commentsInput: {
    marginLeft: theme.spacing(1),
    fontSize: 'inherit',
    flex: '1',
    height: '55px',
    overflow: 'auto'
  },
  // alternate way of overriding style
  commentSubmitButton: {
    '& .MuiButton-label': {
      fontSize: '12.5px'
    }
  },
}))

const CommentForm = React.forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const [newComment, setNewComment] = useState('')
  const classes = useStyles()
  const blog = props.blog

  const addNewComment = async (event) => {
    event.preventDefault()
    console.log('user clicked `add comment` button.')

    const comment = {
      message: newComment
    }

    dispatch(addComment(blog.id, comment))
    setNewComment('')
  }


  return (
    <form onSubmit={addNewComment}>
      <Grid item className={classes.root}>
          <InputBase
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
            className={classes.commentsInput}
            placeholder="Add a comment..."
            multiline
            inputRef={ref}
          />
          <Button type="submit" color="primary" disabled={!newComment} className={classes.commentSubmitButton}>Post</Button>
      </Grid>
    </form>
  )
})

export default CommentForm