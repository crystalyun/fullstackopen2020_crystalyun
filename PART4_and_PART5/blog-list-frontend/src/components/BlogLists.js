import Blog from './Blog'
import React from 'react'

const BlogLists = ({ blogs, handleIncrementLikesByOne }) => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog 
            key={blog.id}
            blog={blog}
            handleIncrementLikesByOne={handleIncrementLikesByOne} 
          />
        )}
      </div>
    )
}

export default BlogLists