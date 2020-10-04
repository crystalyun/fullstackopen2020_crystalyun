import React, { useState } from 'react'
import { TextField, Button, DialogActions, DialogTitle, DialogContent, DialogContentText  } from '@material-ui/core'
import { addNewBlog } from './blogsSlice'
import { useDispatch, useSelector } from 'react-redux'

const AddBlogForm = ({ handleClickClose }) => {
  const dispatch = useDispatch()
  const addRequestStatus = useSelector(state => state.blogs.status.addOne.status)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  // It would be good if we can at least disable the "Save Post" button while we're waiting for the request, so the user can't accidentally try to save a post twice. 
  const canSave = 
    [title, author, url].every(Boolean) && addRequestStatus !== 'pending'

  const onSaveBlogClicked = async (event) => {
    event.preventDefault()

    if (canSave) {
        await dispatch(addNewBlog({
            title, author, url
        }))
        setUrl('')
        setTitle('')
        setAuthor('')
    }
  }

  return (
    <>
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText color='colorPrimary'>
          To share your story with other uses, please type in Title, Author, and Url fields and click Submit!
        </DialogContentText>
        <form onSubmit={onSaveBlogClicked}>
          <TextField
            label="Title"
            margin="dense"
            fullWidth
            autoFocus
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="Author"
            margin="dense"
            fullWidth
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="Url"
            margin="dense"
            fullWidth
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <DialogActions>
            <Button color="secondary" onClick={handleClickClose}>Cancel</Button>
            <Button type="submit" color="primary" disabled={!canSave}>Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
      
    </>
  )
}

export default AddBlogForm