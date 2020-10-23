const commentsRouter = require('./comments')
const { likesRouter, unlikesRouter } = require('./likes')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { authenticateJWTandUserIfTokenExists, authUserRequired } = require('../utils/middleware')
const { isAdminOrAuthorSelf } = require('../permissions')
const querystring = require('querystring')
// base binding will be /api/blogs

blogsRouter.get('/', authenticateJWTandUserIfTokenExists, async (request, response) => {
  const { user } = request
  const limit = request.query.limit
  const column = request.query.sort
  const order = request.query.order
  const comparison = (order === 'desc') ? "$lt" : "$gt"

  console.log('sort: ', column, 'order: ', order, 'limit : ', limit)
  console.log('comparison: ', comparison)

  let nextValue
  let nextId
  let cursor = {}

  if (request.query.next) {
    nextValue = request.query.next.split('_')[0]
    nextId = request.query.next.split('_')[1]
    cursor = {
      $or: [
        { [column]: { [comparison]: nextValue } },
        // If the nextValue is an exact match, we need a tiebreaker, so we use the _id field from the cursor.
        { [column]: nextValue, _id: { $lt: nextId } }
      ]
    }
  } 

  console.log('nextValue', nextValue)
  console.log('nextId', nextId)
  console.log('cursor', cursor)

  const blogsData = await Blog
    .find({...cursor}, {
      likes: { '$elemMatch': { '$eq': user._id } },
      title: 1,
      author: 1,
      url: 1,
      likesCount: 1,
      commentsCount: 1,
      createdAt: 1,
    })
    .sort({
      [column]: order,
      _id: 'desc'
    })
    .limit(limit)
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

  let toSend
  if (blogsData.length === 0) {
    // last page
    toSend = {
      blogs: blogsData,
      next: null,
      hasNext: false
    }
  } else {    
    const blogs = blogsData.map(blog => {
      if (user.role === 'GUEST') {
        return { ...blog.toJSON(), didUserLike: null }
      }

      if (blog.likes.length === 1) {
        return { ...blog.toJSON(), didUserLike: true }
      } else if (blog.likes.length === 0) {
        return { ...blog.toJSON(), didUserLike: false }
      }
    })

    const base = request.protocol + '://' + request.get('host') + request.originalUrl // full request url
    const path = new URL(base).pathname // /api/blogs

    lastItem = blogsData[blogsData.length -1]
    const nextCursor = (column === 'createdAt')
     ? lastItem[column].toISOString() + "_" + lastItem['_id']
     : lastItem[column]+ "_" + lastItem['_id']

    console.log('nextCursor', nextCursor)

    console.log('original query params, ', request.query)
    const params = {
      ...request.query,
      next: nextCursor
    }

    console.log('next query params', params)

    const paramsEncoded = querystring.stringify(params)
    console.log('paramsEncoded', paramsEncoded)

    const next = request.protocol + '://' + request.get('host') + path + "?" + paramsEncoded
    console.log('next url ', next)

    toSend = {
      blogs,
      next,
      hasNext: true
    }

  }
  
  console.log('so token attached ? ', request.token)
  console.log('user? ', user)
  response.status(200).json(toSend)
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

blogsRouter.post('/', authUserRequired, authenticateJWTandUserIfTokenExists, async (request, response) => {
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

  const blogCreated = await Blog.findById(savedBlog._id).populate('user', { blogs: 0, comments: 0 })

  await sleep(5000)
  response.status(201).json(blogCreated.toJSON())
})

blogsRouter.delete('/:id', authUserRequired, authenticateJWTandUserIfTokenExists, async (request, response) => {
  const { user } = request

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({ error: 'This blog looks like it is already deleted in database.' })
  }

  if (!isAdminOrAuthorSelf(user, blog)) {
    return response.status(401).json({ error: 'A blog can be deleted only by the user who added the blog or by ADMIN.' })
  }

  await blog.remove()

  // remember to also update `User` model's `blogs` field
  user.blogs = user.blogs.filter(b => b.toString() !== request.params.id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', authUserRequired, authenticateJWTandUserIfTokenExists, async (request, response) => {
  const { user } = request

  const blog = await Blog.findById(request.params.id)
  
  if (!blog) {
    return response.status(400).json({ error: 'This blog is not found in database.' })
  }

  if (!isAdminOrAuthorSelf(user, blog)) {
    return response.status(401).json({ error: 'A blog can be deleted only by the user who added the blog or by ADMIN.' })
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