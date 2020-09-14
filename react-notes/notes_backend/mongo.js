const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const dbName = 'node-app'

const url =
    `mongodb+srv://admin:${password}@cluster0-6kw3w.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

// create Schema first before creating Model
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

// `Note` model definition
// Mongoose automatically sets collection name to `notes`, the lowercased plural version of model, `Note`
// first param represents model(collection) name
// second param is the schema that you would want to base the model on
const Note = mongoose.model('Note', noteSchema)

// The parameter of the `find` method is an object expressing search conditions.
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// // model Note is a constructor function for creating individual records (documents) in `notes` collection
// const note = new Note({
//     content: 'Callback-functions suck',
//     date: new Date(),
//     important: true,
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })