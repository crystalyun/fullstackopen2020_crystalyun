const express = require('express')
const morgan = require('morgan')
// const cors = require('cors')
const app = express()


let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
    }
]

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

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
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<div>Phonebook has info for ${persons.length} people</div><div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('before delete : ', persons)
    persons = persons.filter(person => person.id !== id)
    console.log('after delete : ', persons)

    response.status(204).end()
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

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(10,1000)
    }
    
    persons = persons.concat(person)
    response.json(person)
})

// `process.env.PORT` allows Heroku (prod environment) to set its PORT on its own. 3001 is for development
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})