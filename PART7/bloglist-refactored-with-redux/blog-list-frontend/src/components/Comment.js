import React, { useState } from 'react'
import useComment from './custom-hooks/useComment'

const Comment = ({ blog }) => {
    const [comments, createComment] = useComment(blog)
    const [newComment, setNewComment] = useState('')

    const addNewComment = async (event) => {
      event.preventDefault()
      console.log('user clicked `add comment` button.')
    
      const commentObject = {
        message: newComment
      }
    
      await createComment(commentObject)
      setNewComment('')
    }

    if (!comments) {
        console.log('comments are not yet loaded from backend.')
        return null
    } else {
        console.log('all comments loaded from backend.')
    }

    return (
      <>
        <h4>comments</h4>

        <form onSubmit={addNewComment}>
          <input
            value={newComment}
            onChange={({ target }) => setNewComment(target.value)}
          />
          <button type="submit">add comment</button>
        </form>

        <ul>
          {comments.map(comment => <li key={comment.id}>{comment.message}</li>)}
        </ul>
      </>
    )
}

export default Comment