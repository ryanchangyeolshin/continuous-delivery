require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, beforeEach, after } = require('mocha')
const { expect } = require('chai')
const uuid = require('uuid/v4')
const createApp = require('../create-app')
const findAll = require('../todos-gateway')

describe('GET /todos', () => {
  let _todos
  let server

  before('connect to mongodb', done => {
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      if (err) {
        console.error(db)
        process.exit(1)
      }
      _repo = { name: 'continuous-delivery', description: 'A practice repository for testing and deployment' }
      server = createApp(db)
        .listen(process.env.PORT, () => done())
      })
    })
  })

  beforeEach('delete all todos and insert a new one for each test', async () => {
    await _todos.deleteMany({})
    await _todos.insertOne({
      id: uuid(),
      dueDate: '1/1/2000',
      task: 'Read a book.'
    })
  })

  after('disconnect from mongodb', done => {
    server.close(() => done())
  })

  describe('GET /todos', () => {
    it('should return an array of todo objects', async () => {
      const todos = await findAll()
      expect(todos).to.deep.equal([{
        id: uuid(),
        dueDate: '1/1/2000',
        task: 'Read a book.'
      }])
    })
  })
})
