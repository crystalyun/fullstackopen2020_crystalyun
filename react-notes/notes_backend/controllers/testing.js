// create a router for E2E testing to controll the state of the database
const router = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')

router.post('/reset', async (request, response) => {
    await Note.deleteMany({}) 
    await User.deleteMany({})

    response.status(204).end()
})

module.exports = router