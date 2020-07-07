const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// base binding will be /api/users
// user registration
usersRouter.post('/', async (request, response) => {
  const body = request.body
  
  if ((body.password === undefined) || (body.password.length < 3)) {
    return response.status(400).json({ error: 'password is a required field and 3 characters minimum' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter