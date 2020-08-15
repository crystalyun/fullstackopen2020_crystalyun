// set mergeParams: true on the router if you want to access params from the parent router. in this case, `:blogId` param.

const commentsRouter = require('express').Router({ mergeParams: true })
const Comment = require('../models/comment')
const Blog = require('../models/blog')

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
commentsRouter.post('/', async (request, response) => {
    const { message } = request.body

    console.log('print out params ', request.params)

    const blog = await Blog.findById(request.params.blogId)

    const comment = new Comment({
      message,
      blog: blog._id
    })

    const savedComment = await comment.save()

    // remember to also update `Blog` model's `comments` field.
    blog.comments = blog.comments.concat(savedComment._id)
    await blog.save()

    response.status(201).json(savedComment)
})

commentsRouter.get('/', async (request, response) => {
    const comment = await Comment
      .find({})

    response.json(comment)
})





module.exports = commentsRouter