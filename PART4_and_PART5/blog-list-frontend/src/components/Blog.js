import React, { useState } from 'react'
const Blog = ({ blog, handleIncrementLikesByOne, handleRemoveBlog, user }) => {
  const [ showDetails, setShowDetails ] = useState(false)

  const hideWhenShowDetails = { display: showDetails ? 'none' : '' }
  const showWhenShowDetails = { display: showDetails ? '' : 'none' }

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 5,
    border: 'solid',
    marginBottom: 5,
    borderWidth: 1
  }

  // reasons why i cannot reuse Togglable component
  // 1. div style stacking (eg. hideWhenShowDetails + blogStyle) required
  // 2. i need to add blog metadata within this component. such as
  // {blog.title} {blog.author} etc. Togglable component uses {props.children} which in this case not useful.
  // 3. also incrementing likes by 1 feature on clicking `like` butrton is not accomodated in Togglable component.

  return (
    <div>
      {/* need to stack style = {blogStyle} */}
      <div style={{ ...hideWhenShowDetails, ...blogStyle }} className='blogDefaultView'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={{ ...showWhenShowDetails, ...blogStyle }} className='blogDetailsView'>
        <div>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button></div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={() => handleIncrementLikesByOne(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={{ display: user.username === blog.user.username ? '' : 'none' }}>
          <button onClick={() => handleRemoveBlog(blog)}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog

// Otherwise you can do this way :) i think this way is more readable. the above implementation is simply to mock/practice Togglable implementation.
// import React, { useState } from 'react'
// const Blog = ({ blog }) => {
//   const [ showDetails, setShowDetails ] = useState(false)

//   const toggleVisibility = () => {
//     setShowDetails(!showDetails)
//   }

//   const blogStyle = {
//     paddingTop: 10,
//     paddingLeft: 5,
//     border: 'solid',
//     marginBottom: 5,
//     borderWidth: 1
//   }

//   console.log('rerendering Blog component...')

//   if (!showDetails) {
//     return (
//       <div style={blogStyle}>
//         {blog.title} {blog.author}
//         <button onClick={toggleVisibility}>view</button>
//       </div>
//     )
//   }

//   return (
//     <div style={blogStyle}>
//       <div>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button></div>
//       <div>{blog.url}</div>
//       <div>likes {blog.likes} <button>like</button></div>
//       <div>{blog.user.name}</div>
//     </div>
//   )

// }

// export default Blog
