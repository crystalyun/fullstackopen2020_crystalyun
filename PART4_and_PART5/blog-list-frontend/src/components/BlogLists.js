import Blog from './Blog'
import React from 'react'

const BlogLists = ({ blogs, handleIncrementLikesByOne, handleRemoveBlog, user }) => {
  return (
    <div className='blogList'>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleIncrementLikesByOne={handleIncrementLikesByOne}
          handleRemoveBlog={handleRemoveBlog}
          user={user}
        />
      )}
    </div>
  )
}

export default BlogLists