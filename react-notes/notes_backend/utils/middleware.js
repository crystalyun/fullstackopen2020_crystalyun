const logger = require('./logger')

// Let's implement our own middleware that prints information about every request that is sent to the server.
const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('Header: ', request.headers)
  logger.info('---')
  next() // the `next` function yields control to the next middleware
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.info('error is now being handled in middleware error handler')
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid tokem' })
  }

  // In all other error situations, the middleware passes the error forward to the default Express error handler.
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}