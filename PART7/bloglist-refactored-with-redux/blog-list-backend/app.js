const config = require('./utils/config')
const OpenApiValidator = require('express-openapi-validator')
const bodyParser = require('body-parser')
const path = require('path')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const app = express()
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const commentsRouter = require('./controllers/comments')
const apiSpec = path.join(__dirname, '/controllers/blogs.json')

const mongoUrl = config.MONGODB_URI

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.text())
app.use(bodyParser.json())

app.use('/spec', express.static(apiSpec))
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use(
  OpenApiValidator.middleware({
    apiSpec,
    // validateResponses: true,
  })
)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/test')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app















