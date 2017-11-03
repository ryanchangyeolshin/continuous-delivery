require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, beforeEach, after, it } = require('mocha')
const { expect } = require('chai')
const uuid = require('uuid/v4')
const axios = require('axios')
const createApp = require('../server/create-app')

describe('app', () => {

  let _db
  let _todo
  let _todos
  let _repo
  let server

  before('connect to mongodb', done => {
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      if (err) {
        console.error(err)
        done(err)
      }
      _db = db
      _todo = { id: uuid(), dueDate: '1/1/2000', task: 'Read a book.' }
      _todos = db.collection('todos')
      _repo = { name: 'continuous-delivery', description: 'A practice repository for testing and deployment' }
      server = createApp(db)
        .listen(process.env.PORT, () => done())
    })
  })

  after('disconnect from mongodb', done => {
    _db.close()
    server.close(() => done())
  })

  beforeEach('delete all todos and insert a new one for each test', async () => {
    await _todos.deleteMany({})
    await _todos.insertOne(_todo)
  })

  describe('GET /api', () => {
    it('should return a json object with the repository name and description', async () => {
      const { data, status } = await axios.get(`http://localhost:${process.env.PORT}/api`)
      expect(data).to.deep.equal(_repo)
      expect(status).to.equal(200)
    })
  })

  describe('GET /api/todos', () => {
    it('should find and return a list of todos', async () => {
      const { status, data } = await axios.get(`http://localhost:${process.env.PORT}/api/todos`)
      const { id, dueDate, task } = data[0]
      expect(status).to.equal(200)
      expect(id).to.equal(_todo.id)
      expect(dueDate).to.equal(_todo.dueDate)
      expect(task).to.equal(_todo.task)
    })
  })

  describe('POST /api/todos', () => {
    it('should post a todo and return it', async () => {
      const inserted = { id: uuid(), dueDate: '3/28/2080', task: 'Finish learning C# basics.' }
      const { status, config: { data } } = await axios.post(`http://localhost:${process.env.PORT}/api/todos`, inserted)
      expect(status).to.equal(201)
      expect(data).to.deep.equal(JSON.stringify(inserted))
    })
  })
})
