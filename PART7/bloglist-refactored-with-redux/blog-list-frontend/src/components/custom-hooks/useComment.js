import { useState, useEffect } from 'react'
import commentService from '../../services/comments'

// Comments API custom hook.
/*
`useComment` custom hook function does : 
  1) first fetches comments by blogID and save in `comments` internal state (which we also return as function output)

  2) then it also exposes an optional method that can be called externally, `createComment` that when called, it creates a comment for that blogID passed in from custom hook function input. `createComment` also updates `comment` internal state with additional created comment.

*/
const useComment = (blog) => {
  const [comments, setComments] = useState(null)

  // useEffect only run when blog is available and loaded from server.
  useEffect(() => {
      if (blog) {
        console.log('effect to fetch COMMENTS data once blog is loaded.')
        commentService
          .getAllByBlogId(blog.id)
          .then(response => {
          console.log('fetch COMMENTS promise fulfilled')
          setComments(response)
          })
      } else {
        console.log('wait fetch COMMENTS untill blog is fully loaded.')
      }
    }, [blog])

  const createComment = async (commentObject) => {
      const response = await commentService.create(blog.id, commentObject)
      console.log('post COMMENTS promise fulfilled.')
      setComments(comments.concat(response))
  }

  return [ comments, createComment ]
}

export default useComment