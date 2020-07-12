import Blog from './Blog'
import React from 'react'

const BlogLists = ({blogs}) => {
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
}

export default BlogLists