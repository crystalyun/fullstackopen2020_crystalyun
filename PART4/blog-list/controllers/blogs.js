const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// base binding will be /api/blogs

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { blogs: 0 })
  response.json(blogs.map(blog => blog.toJSON()))
  //response.json serializes `blogs`, an arry of objects (WHICH IS, IN JAVASCRIPT, AN OBJECT), to JSON. calls JSON.stringify under the hood.
  // JSON.stringify then calls .toJSON attached to Blog model which will remove ._id and .__v fields
})

blogsRouter.post('/', async (request, response) => {
  // adding new blogs is only possible if a valid token is sent with the HTTP POST request
  console.log('request.token added from tokenExtractor middleware', request.token)

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  // if decodedToken is verified, format will be {username, id, iat}
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  // the user identified by the token is designated as the creator of the blog
  const blog = new Blog({
    ...request.body,
    user: user._id
  })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  console.log('request.token added from tokenExtractor middleware', request.token)

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  // if decodedToken is verified, format will be {username, id, iat}
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  const creatorId = blog.user.toString()

  if (creatorId === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'A blog can be deleted only by the user who added the blog' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })

  if (updatedBlog) {
    response.json(updatedBlog.toJSON())
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter