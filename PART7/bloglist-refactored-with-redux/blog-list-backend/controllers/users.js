const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// base binding will be /api/users
// user registration
usersRouter.post('/', async (request, response) => {
  const { password, username, name, role = 'USER' } = request.body

  if ( !password || (password.length < 3)) {
    return response.status(400).json({ error: 'password is a required field and 3 characters minimum' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    role,
    passwordHash,
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { user: 0, likes: 0 })

  response.json(users)
})

module.exports = usersRouter