const likesRouter = require('express').Router({
    mergeParams: true
})
const unlikesRouter = require('express').Router({
  mergeParams: true
})
const Blog = require('../models/blog')
const { authenticateJWT } = require('../utils/middleware')

// base for likesRouter is `/api/blogs/:blogId/like`.
likesRouter.post('/', authenticateJWT, async (request, response) => {
  const { user } = request

  const update = await Blog.findOneAndUpdate(
    { // update condition
      _id: request.params.blogId,
      likes: { "$ne":  user._id}
    },
    { // if update condition satisfies, then modify as :
      "$inc": { likesCount: 1 },
      "$push": { likes: user._id }
    },
    { 'new': true }
  )

  if (!update) {
    return response.status(400).json({ error: 'like request failed.'})
  }

  const result = {
    id: update._id,
    likesCount: update.likesCount,
    didUserLike: true
  }

  response.status(200).json(result)
})

// base for unlikesRouter is `/api/blogs/:blogId/unlike`.
unlikesRouter.post('/', authenticateJWT, async (request, response) => {
  const { user } = request

  const update = await Blog.findOneAndUpdate(
    {
      _id: request.params.blogId,
      likes: user._id
    },
    {
      "$inc": { likesCount: -1 },
      "$pull": { likes: user._id }
    },
    { 'new': true }
  )

  if (!update) {
    return response.status(400).json({ error: 'unlike request failed.'})
  }

  const result = {
    id: update._id,
    likesCount: update.likesCount,
    didUserLike: false
  }

  response.status(200).json(result)
})


module.exports = {
  likesRouter, unlikesRouter
}
