const mongoose = require('mongoose')

// `Blog` Model's `comments` are a referenced model (`Comments`)
// whereas `likes` is an embedded array. (in Mongoose terms, `subdocuments`.)
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  likesCount: {
    type: Number,
    default: 0
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  commentsCount: {
    type: Number,
    default: 0
  },
  likes : [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],
}, { timestamps: true })

// called when JSON.stringify() (=response.json()) is called
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.likes
  }
})  



module.exports = mongoose.model('Blog', blogSchema)

