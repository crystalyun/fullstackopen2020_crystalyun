// set mergeParams: true on the router if you want to access params from the parent router. in this case, `:blogId` param.
const commentsRouter = require('express').Router({ mergeParams: true })
const Comment = require('../models/comment')
const Blog = require('../models/blog')
const { authUserRequired, authenticateJWTandUserIfTokenExists } = require('../utils/middleware')

/*
refer to answer https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router

attach `commentsRouter` to the `blogsRouter`(whose base is /api/blogs) on the '/:blogId/comments route. So that commentsRouter base binding will be /api/blogs/:blogId/comments.

in this case,
  `commentsRouter` : child router (nested inside parent router `blogsRouter`)
  `blogsRouter` : parent router
*/


// when a POST request to `/api/blogs/:blogId/comment` arrives, 
// then update Comment model with blogId ref.
// AND also update Blog model by concatenating commentId to commentId ref array.
// 'blogId' param comes from `blogsRouter.use('/:blogId/comments', commentsRouter)` in blog controller.
commentsRouter.post('/', authUserRequired, authenticateJWTandUserIfTokenExists, async (request, response) => {
    const { user } = request
    const { message } = request.body

    console.log('print out params ', request.params)

    const blog = await Blog.findById(request.params.blogId)

    if (!blog) {
      return response.status(400).json({ error: 'A blog cannot be found in database.' })
    }

    // the user identified by the token is designated as the creator of the comment
    const comment = new Comment({
      message,
      blog: blog._id,
      user: user._id
    })

    const savedComment = await comment.save()

    // remember to also update `Blog` model's `comments` field.
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    // remember to also update `User` model's `comments` field.
    user.comments = user.comments.concat(savedComment._id)
    await user.save()

    const commentCreated = await Comment.findById(savedComment._id)
      .populate('user', { blogs: 0, comments: 0 })

    response.status(201).json(commentCreated.toJSON())
})

// find Comment by `any comments object whose prop `blog` ref ObjectId value is equal to `request.params.blogId`. 
commentsRouter.get('/', async (request, response) => {
    const comment = await Comment
      .find({ 'blog': request.params.blogId })
      .populate('user', { name: 1 })

    response.json(comment)
})

module.exports = commentsRouter