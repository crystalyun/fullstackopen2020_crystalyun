const logger = require('./logger')

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
  console.log('enter middleware?')
  const authorization = request.get('Authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7)
    request.token = token
  }

  next()
}


module.exports = {
  errorHandler, tokenExtractor
}
