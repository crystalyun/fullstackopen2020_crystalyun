const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
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
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Crystal Blog',
      author: 'Crystal Yun',
      url: 'https://crystalyun.com/',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain('Crystal Blog')
  })

  test('likes property defaults to 0 if unspecified', async () => {
    const newBlog = {
      title: 'Miranda Blog',
      author: 'Miranda Kerr',
      url: 'https://mirandakerr.com/',
    }

    const savedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(savedBlog.body.likes).toBe(0)
  })

  test('if url property is missing from the request data, respond with 400 and the request fails', async() => {
    const newBlog = {
      title: 'Kim K Blog',
      author: 'Kim Kardashian',
      likes: 6
    }

    await api
      .post('/api/blogs')
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
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('delete \'/api/blogs/:id', () => {
  test('succeeds with status code 204 if id is in valid mongoose format and exists', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length -1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('succeeds with status code 204 if id is in valid mongoose format but does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log('valid none existing id: ', validNonexistingId)

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(204)
  })

  test('fails with status code 400 if id is in invalid format', async () => {
    const invalidId = '2'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('put \'/api/blogs/:id', () => {
  test('updates likes of a blog post', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        likes: 2
      })
      .expect(200)

    expect(updatedBlog.body.likes).toBe(2)
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
