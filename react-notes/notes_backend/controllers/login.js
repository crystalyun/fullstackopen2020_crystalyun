const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

//base binding will be /api/login
loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
    // passwordCorrect will return false when the user does not exist OR
    // user exists but password was incorrect
    // passwordCorrect will return true when the user exist and the password is correct

  // when user does not exist or user exists but password was incorrect
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // when the password is correct ...
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  
  // token is created. the token contains the username and the user id in a digitally signed form
  // The token has been digitally signed using a string from the environment variable SECRET as the secret. The digital signature ensures that only parties who know the secret can generate a valid token. The value for the environment variable must be set in the .env file.
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
