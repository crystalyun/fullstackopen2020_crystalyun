const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.info('error is now being handled in middleware error handler')
  logger.error(error.message)

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  // In all other error situations, the middleware passes the error forward to the default Express error handler.
  next(error)
}

module.exports = {
  errorHandler
}