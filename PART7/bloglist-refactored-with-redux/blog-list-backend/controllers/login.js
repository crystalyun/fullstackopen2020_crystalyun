const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  console.log('user is hoo', user)
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash) // if matches, then return true. otherwise, return false

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // write and sign
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, role: user.role, id: user._id })

})

module.exports = loginRouter