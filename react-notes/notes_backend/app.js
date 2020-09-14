/*
It's important that dotenv gets imported before the note model is imported. This ensures that the environment variables from the .env file are available globally before the code from the other modules is imported.
*/

const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB: ', error.message)
  })

app.use(cors())
/*
Middleware functions are called in the order that they're taken into use with the express server object's use method. Notice that json-parser is taken into use before the requestLogger middleware, because otherwise request.body will not be initialized when the logger is executed!
*/
app.use(express.static('build'))
app.use(express.json()) //this json-parser middleware parses `request.body` && `response.body`
app.use(middleware.requestLogger)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/notes', notesRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing.js')
  app.use('/api/testing', testingRouter)
}

/*
Middleware functions have to be taken into use before routes if we want them to be executed before the route event handlers are called. There are also situations where we want to define middleware functions after routes. In practice, this means that we are defining middleware functions that are only called if no route handles the HTTP request.

Let's add the following middleware after our routes, that is used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.
*/

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)

// handler of requests with result to errors
// error handler needs to come at the very end, after the unknown endpoints handler
app.use(middleware.errorHandler)

module.exports = app