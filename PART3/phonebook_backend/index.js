require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const app = express()
const Person = require('./models/person')

// app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('requestBody', function(req, res) {
    if ( req.method === 'POST' ) {
        console.log(typeof req.body)
        return JSON.stringify(req.body);
    }

    return;
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestBody'));

app.get('/api/persons', (request, response) => {
    Person.find({}).then(allPeople => {
        response.json(allPeople)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(allPeople => {
        response.send(`<div>Phonebook has info for ${allPeople.length} people</div><div>${new Date()}</div>`)    
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
          console.log('person : ', person)
          if (person) {
              response.json(person)
          } else {
              response.status(404).end()
          }
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
          response.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    console.log('request.body is : ', request.body)
    const body = request.body 

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }

    const duplicateName = persons.find( ({ name }) => name === body.name)
    if (duplicateName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    // save to DB 
    person.save().then(savedPerson => {
        console.log('savedPerson is : ', savedPerson)
        console.log('type : ', typeof savedPerson)
        response.json(savedPerson)
    })
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body 

    // can only update number, but not name 
    const person = {
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
          console.log('updatedPerson : ', updatedPerson)
          if (updatedPerson) {
              response.json(updatedPerson)
          } else {
              response.status(404).end()
          }
        //   console.log('updatedPerson.toJSON(): ', updatedPerson.toJSON())
        //   console.log('typeof updatedPerson.toJSON(): ', typeof updatedPerson.toJSON()) // object

          // response.json(updatedPerson.toJSON()) also works, but it's redundant as response.json under the hood calls `JSON.stringify`, which in turn calls mongoose method `.toJSON` on the target object to perform any transformations (such as deleting ._id field) before returning JSON data to the client
      })
      .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log('middleware error handler')
    console.log('message : ' , error.message)
    console.log('name : ' , error.name)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)

// `process.env.PORT` allows Heroku (prod environment) to set its PORT on its own. 3001 is reserved for development
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})