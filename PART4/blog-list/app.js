const cors = require('cors')
const express = require('express')
require('express-async-errors')
const app = express()
const config = require('./utils/config')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
console.log('port is ', config.PORT)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)



module.exports = app















