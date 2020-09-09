import React, { useState } from 'react'
import { TextField, Button, DialogActions, DialogTitle, DialogContent, DialogContentText  } from '@material-ui/core'

const BlogForm = ({ handleCreateNewBlog, handleClickClose }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    console.log('create new blog button clicked')

    const newBlog = {
      title,
      author,
      url
    }

    handleCreateNewBlog(newBlog)
    setUrl('')
    setTitle('')
    setAuthor('')
  }

  return (
    <>
      <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText color='colorPrimary'>
          To share your story with other uses, please type in Title, Author, and Url fields and click Submit!
        </DialogContentText>
        <form onSubmit={addNewBlog}>
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
            <Button type="submit" color="primary" disabled={!title || !author || !url}>Submit</Button>
          </DialogActions>
        </form>
      </DialogContent>
      
    </>
  )
}

export default BlogForm
