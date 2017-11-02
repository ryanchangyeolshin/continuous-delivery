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
  let server

  before('connect to mongodb', done => {
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      if (err) {
        console.error(err)
        done(err)
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

  describe('GET /todos', () => {
    it('should find and return a list of todos', async () => {
      const todos = await axios.get('http://localhost:3000/todos')
      expect(todos.status).to.equal(200)
      expect(todos.data[0])
        .to.include(_todo)
        .and.have.property('_id')
        .that.is.a('string')
    })
  })

  describe('POST /todos', () => {
    it('should post a todo and return it', async () => {
      const inserted = { _id: uuid(), dueDate: '3/28/2080', task: 'Finish learning C# basics.' }
      const todo = await axios.post('http://localhost:3000/todos', inserted)
      expect(todo.status).to.equal(201)
      expect(todo.config.data).to.deep.equal(JSON.stringify(inserted))
    })
  })
})
