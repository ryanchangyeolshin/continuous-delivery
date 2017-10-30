require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, after } = require('mocha')
const { expect } = require('chai')
const uuid = require('uuid/v4')
const createApp = require('../create-app')
const findAll = require('../todos-gateway')

describe('todos-gateway', () => {

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
      done()
    })
  })

  after('disconnect from mongodb', done => {
    _db.close(() => done())
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
})
