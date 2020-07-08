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

const getTokenFromAuthorizationHeader = request => {
  const authorization = request.get('Authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7)
  }

  return null
}

blogsRouter.post('/', async (request, response) => {
  // adding new blogs is only possible if a valid token is sent with the HTTP POST request
  const token = getTokenFromAuthorizationHeader(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
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
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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