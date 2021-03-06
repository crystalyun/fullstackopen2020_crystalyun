const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

//base binding will be /api/users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 }) // will have ._id, .__v, and passwordHash
  response.json(users.map(u => u.toJSON()))
  // .toJSON() deletes ._id, .__v, and passwordHash
  // however, since mongoose automatically calls .toJSON() for you when calling response.json()
  // therefore, response.json(users) will still just work
})





usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save() // will have ._id, .__v, and passwordHash

  response.json(savedUser.toJSON()) // savedUser.toJSON() does not have ._id, .__v, and .passwordHash. but it will have `id` prop
  // mongoose under the hood calls .toJSON() automatically for you when calling response.json
  // so you can just type response.json(savedUser) and it will still work
})

module.exports = usersRouter