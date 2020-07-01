const mongoose = require('mongoose')

if (process.argv.lengh <3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'phonebook-app'

const url =
    `mongodb+srv://admin:${password}@cluster0-6kw3w.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// initialize Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// initialize Model
// Model name is `Person`, collection name is automatically set to `people` by Mongoose
// `Person` model is binded to `personSchema` data schema
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook: ')
    result.forEach(person => {
      console.log(person.name, person.number)
    })

    mongoose.connection.close()
  })
}


if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}