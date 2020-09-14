const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router() // express router object
const Note = require('../models/note')
const User = require('../models/user')

//base binding will be /api/notes
notesRouter.get('/', async (request,response) => {
  const notes = await Note
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(notes.map(note => note.toJSON()))
  //response.json serializes `notes`, an arry of objects (WHICH IS, IN JAVASCRIPT, AN OBJECT), to JSON. calls JSON.stringify under the hood.
  // JSON.stringify then calls .toJSON attached to Note model which will remove ._id and .__v fields
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note.toJSON())
  } else {
    response.status(404).end()
  }
})

const getTokenFrom = request => {
  const authorization = request.get('Authorization') // returns bearer ejhgkGb...
  // if `Authorization` header exists and the value starts with `bearer`
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7) // return ejhgkGb
  }

  return null
}

// If the application has multiple interfaces requiring identification, JWT's validation should be separated into its own middleware.
// right now only notesRouter.post requires authentication. so we didn't separate it into a separate middleware
// in practice, this means convert function getTokenFrom into a middleware
// The middleware should take the token from the Authorization header and place it to the token field of the request object.
// refer to 4.20 exercise answer

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  // when the bearer token attached to Authorization header in request data is verfieid by jwt, it then
  // returns token schema defined {username, id(=user id saved in User model)} and iat (the time the JWT was issued)
  // eg. { username: 'Josh', id: '5f021db4542de7597c1ce0c4', iat: 1594088302 }
  // if not verified by jwt, it returns a `JsonWebTokenError` error.

  // when `Authorization` header is not attached in the request data (token missing) OR
  // when the user id is not identified, (token invalid)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // identity of the maker of the request is resolved from here 
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote.toJSON())
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// check this method later in Github if they've updated with async syntax
notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

module.exports = notesRouter