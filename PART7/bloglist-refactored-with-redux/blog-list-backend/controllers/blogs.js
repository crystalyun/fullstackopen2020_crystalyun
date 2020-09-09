const commentsRouter = require('./comments')
const { likesRouter, unlikesRouter } = require('./likes')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { authenticateJWT } = require('../utils/middleware')
const { isArray } = require('lodash')

// base binding will be /api/blogs

blogsRouter.get('/', authenticateJWT, async (request, response) => {
  const { user } = request

  const blogs = await Blog
    .find({},{ 
      likes: { '$elemMatch': { '$eq': user._id } },
      title: 1,
      author: 1,
      url: 1,
      likesCount: 1
    })
    .populate('user', { blogs: 0, comments: 0 })
    .populate({
      path: 'comments',
      select: { blog: 0 },
      populate: {
        path: 'user',
        model: 'User',
        select: { blogs: 0, comments: 0 }
      },
    })
  
  // mongoose query results are frozen objects so immutable. Convert to regular JSON object from immutable mongoose document object to manipulate the query result. (in this case, to add new prop didUserLike and remove likes property.) 
  const blogToJSON = blogs.map(blog => blog.toJSON())
  const result = blogToJSON.map(b => b.likes.length ===1 ? { ...b, didUserLike: true, likes: undefined } : { ...b, didUserLike: false, likes: undefined })
  
  response.json(result)
})

blogsRouter.post('/', authenticateJWT, async (request, response) => {
  const { user } = request

  // the user identified by the token is designated as the creator of the blog
  const blog = new Blog({
    ...request.body,
    user: user._id
  })

  const savedBlog = await blog.save()

  // remember to also update `User` model's `blogs` field
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const blogCreated = await Blog.findById(savedBlog._id).populate('user', { blogs: 0 })
  response.status(201).json(blogCreated.toJSON())
  // response.status(201).json(blogCreated) will also just work
})

blogsRouter.delete('/:id', authenticateJWT, async (request, response) => {
  const { user } = request

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'A blog can be deleted only by the user who added the blog' })
  }

  await blog.remove()

  // remember to also update `User` model's `blogs` field
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', authenticateJWT, async (request, response) => {
  const { user } = request

  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(400).json({ error: 'A blog cannot be found in database.' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'A blog can be updated only by the user who added the blog' })
  }

  const { title, author, url } = request.body

  const blogObj = Object.assign({}, 
                    title? { title } : null,
                    author? { author } : null,
                    url? { url } :null,
                  )

  console.log('blogObj print out ', blogObj)

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogObj, { new: true })

  if (!updatedBlog) {
    return response.status(400).json({ error: 'A blog cannot be found in database.' })
  }

  response.json(updatedBlog.toJSON())
})



// nest `commentsRouter` router by attaching it to `blogsRouter` router as middleware.
blogsRouter.use('/:blogId/comments', commentsRouter)

// nest `likesRouter` router by attaching it to `blogsRouter` router as middleware.
blogsRouter.use('/:blogId/like', likesRouter)
blogsRouter.use('/:blogId/unlike', unlikesRouter)

module.exports = blogsRouter