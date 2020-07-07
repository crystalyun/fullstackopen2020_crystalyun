const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [{
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
}, {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
}]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title:'willremovethissoon', url:'http://willremovethissoon.com' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({}) // will have ._id, .__v, and .passwordHash
  return users.map(u => u.toJSON()) // will not have ._id, .__v and .passwordHash && will have 'id' prop
}

module.exports = {
  initialBlogs, blogsInDb, nonExistingId, usersInDb
}