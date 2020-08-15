import React from 'react'
import Comment from './Comment'

const Blog = ({ blog, handleIncrementLikesByOne }) => {
  
  if (!blog) {
    console.log('blog is not yet loaded from backend.')
    return null
  } else {
    console.log('blog is now loaded from backend.')
  }

  return (
    <>
      <h2>{blog.title} {blog.author}</h2>

      <a href={blog.url}>{blog.url}</a>

      <div>{blog.likes} likes <button onClick={() => handleIncrementLikesByOne(blog)}>like</button></div>

      added by {blog.user.name}
      
      <Comment blog={blog}/>
    </>
  )
}

export default Blog