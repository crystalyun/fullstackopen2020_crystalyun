const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Note = require('../models/note')

beforeAll(async () => {
  console.log('seeding User db')
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('rootpassword', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()

  const rootUserLogin = await api
  .post('/api/login')
  .send({
    username: 'root',
    password: 'rootpassword'
  })

  rootUserLoginSuccess = rootUserLogin.body
})

describe('when there is initiailly some notes saved', () => {
  beforeEach(async () => {
    console.log('beforeEach : seeding Notes db')
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes
      .map(note => new Note(note))

    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')

    const contents = response.body.map(r => r.content)

    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()

      const noteToView = notesAtStart[0]

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultNote.body).toEqual(noteToView)
    })

    test('fails with statuscode 400 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      console.log('valid none existing id : ', validNonexistingId)

      await api
        .get(`/api/notes/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
      const invalidId = '2'

      await api
        .get(`/api/notes/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data by a verified user', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)
      expect(contents).toContain(
        'async/await simplifies making async calls'
      )
    })

    test('fails with status code 400 if data invaild', async () => {
      const newNote = {
        important: true
      }

      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${rootUserLoginSuccess.token}`)
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)

    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length -1
      )

      const contents = notesAtEnd.map(r => r.content)

      expect(contents).not.toContain(noteToDelete.content)
    })
  })

  describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb() // .usersInDb() calls .toJSON() method under the hood. thus it will not have ._id, .__v, and .passwordHash. but it will have `id` prop

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/) // response.body will not have ._id, .__v, and passwordHash. but it will have `id` prop

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('`username` to be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

})



afterAll(() => {
  mongoose.connection.close()
})