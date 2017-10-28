require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, beforeEach, after } = require('mocha')
const { expect } = require('chai')
const uuid = require('uuid/v4')
const axios = require('axios')
const createApp = require('../create-app')
const findAll = require('../todos-gateway')

describe('todos-gateway', () => {

  let _db
  let _todos
  let _todo
  let server

  before('connect to mongodb', done => {
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      _db = db
      _todo = { _id: uuid(), dueDate: '1/1/2000', task: 'Read a book.' }
      _todos = db.collection('todos')
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

  describe('findAll()', () => {
    it('should find and return a todo object', async () => {
      const todos = await findAll(_todos)
      expect(todos[0]).to.deep.equal(_todo)
    })
  })

  describe('GET /todos', () => {
    it('should find and return a todo object', async () => {
      const { data } = await axios.get('http://localhost:3000/todos')
      expect(data[0])
        .to.include(_todo)
        .and.have.property('_id')
        .that.is.a('string')
    })
  })
})
