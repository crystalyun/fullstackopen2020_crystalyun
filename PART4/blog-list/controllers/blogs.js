const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// base binding will be /api/blogs

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
  //response.json serializes `blogs`, an arry of objects (WHICH IS, IN JAVASCRIPT, AN OBJECT), to JSON. calls JSON.stringify under the hood.
  // JSON.stringify then calls .toJSON attached to Blog model which will remove ._id and .__v fields
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})




module.exports = blogsRouter