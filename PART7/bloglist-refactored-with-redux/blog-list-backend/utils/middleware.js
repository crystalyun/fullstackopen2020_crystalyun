const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  logger.info('error is now being handled in middleware error handler')
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  // In all other error situations, the middleware passes the error forward to the default Express error handler.
  next(error)
}

const tokenExtractor = (request, response, next) => {
  console.log('request reached tokenExtractor middleware.')
  const authorization = request.get('Authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7)
    request.token = token
  }

  next()
}

const authUserRequired = (request, response, next) => {
  // jwt token should be attached to request object from tokenExtractor middleware.
  console.log('request reached authUserRequired middleware. request.token added from tokenExtractor middleware is ', request.token)

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  next()
}

const authenticateJWTandUserIfTokenExists = async (request, response, next) => {
  if (!request.token) {
    console.log('token not attached to the request. call next().')
    next()
  } else {
    // if decodedToken is verified, format will be {username, id, iat}
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    console.log('decodedToken is ', decodedToken)
  
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
  
    // Once verified the token with JWT, attach the `user` object into the request and continue.
    const user = await User.findById(decodedToken.id)
  
    // user is null when decodedToken is valid {username, id, iat} with valid SECRET, but when a user does not exist in db.
    if (!user) {
      return response.status(401).json({ error: 'user identified from jwt does not exist in database.' })
    }
  
    request.user = user
    next()
  }
}

module.exports = {
  errorHandler, tokenExtractor, authUserRequired, authenticateJWTandUserIfTokenExists
}
