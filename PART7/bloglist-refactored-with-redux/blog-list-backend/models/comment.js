const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
})

// called when JSON.stringify() (=response.json()) is called. (converting JS object into JSON string object)
commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Comment', commentSchema)

