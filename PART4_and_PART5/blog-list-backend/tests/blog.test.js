const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

let rootUserLoginSuccess
let superUserLoginSuccess
let rootUserId
let superUserId

beforeAll(async () => {
  await User.deleteMany({})
  const initialUsers = await helper.returnInitialUsers()

  const userObjects = initialUsers.map(user => new User(user))
  const promiseArray = userObjects.map(user => user.save())
  const users = await Promise.all(promiseArray)

  rootUserId = users[0]._id
  superUserId = users[1]._id

  const rootUserLogin = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'rootpassword'
    })

  rootUserLoginSuccess = rootUserLogin.body

  const superUserLogin = await api
    .post('/api/login')
    .send({
      username: 'superuser',
      password: 'superuserpassword'
    })

  superUserLoginSuccess = superUserLogin.body
})


beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog({
      ...blog,
      user: rootUserId
    }))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('get \'/api/blogs\'', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      'Go To Statement Considered Harmful'
    )
  })

  test('unique identifier property of the blog posts is named `id`, not default database property `_id`.', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0]['id']).toBeDefined()
  })
})

describe('post \'/api/blogs\'', () => {
  test('a valid blog can be added by a verified user', async () => {
    const newBlog = {
      title: 'Crystal Blog',
      author: 'Crystal Yun',
      url: 'https://crystalyun.com/',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain('Crystal Blog')
  })

  test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Crystal Blog',
      author: 'Crystal Yun',
      url: 'https://crystalyun.com/',
      likes: 4
    }

    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    expect(result.body).toEqual({ error: 'token missing' })

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('likes property defaults to 0 if unspecified', async () => {
    const newBlog = {
      title: 'Miranda Blog',
      author: 'Miranda Kerr',
      url: 'https://mirandakerr.com/',
    }

    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const added = blogsAtEnd.find(b => b.url === newBlog.url)

    expect(added.likes).toBe(0)
  })

  test('if url property is missing from the request data, respond with 400 and the request fails', async() => {
    const newBlog = {
      title: 'Kim K Blog',
      author: 'Kim Kardashian',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if title property is missing from the request data, respond with 400 and the request fails', async() => {
    const newBlog = {
      url: 'https://kimk.com/',
      author: 'Kim Kardashian',
      likes: 6
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('delete \'/api/blogs/:id', () => {
  test('succeeds with status code 204 if creator is the same person as the DELETE requester', async () => {
    // const blogsAtStart = await helper.blogsInDb()
    // const blogToDelete = blogsAtStart[0]

    // use array destructuring instead to teas out the first element in the array
    const [ blogToDelete ] = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length -1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('fails with status code 401 if creator is NOT the same person as the DELETE requester', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${superUserLoginSuccess.token}`)
      .expect(401)

    expect(result.body).toEqual({ error: 'A blog can be deleted only by the user who added the blog' })

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('fails with status code 400 if id is in invalid format', async () => {
    const invalidId = '2'

    const result = await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
      .expect(400)

    expect(result.body).toEqual({ error: 'malformatted id' })

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deleting a blog fails with 401 if token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    expect(result.body).toEqual({ error: 'token missing' })
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('put \'/api/blogs/:id', () => {
  test.only('updates likes of a blog post', async () => {
    // const blogsAtStart = await helper.blogsInDb()
    // const blogToUpdate = blogsAtStart[0]

    // instead of above two lines, i can just do array destructuring to retrieve first item in the array
    const [ blogToUpdate ] = await helper.blogsInDb()

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        likes: blogToUpdate.likes + 1
      })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const edited = blogsAtEnd.find(b => b.url === blogToUpdate.url)
    expect(edited.likes).toBe(blogToUpdate.likes + 1)
  })


  test('fails with status code 404 if id is in valid mongoose format but does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log('valid none existing id: ', validNonexistingId)

    await api
      .put(`/api/blogs/${validNonexistingId}`)
      .send({
        likes: 2
      })
      .expect(404)
  })

  test('fails with status code 400 if id is in invalid format', async () => {
    const invalidId = '2'

    await api
      .put(`/api/blogs/${invalidId}`)
      .send({
        likes: 2
      })
      .expect(400)
  })

})



afterAll(() => {
  mongoose.connection.close()
})
