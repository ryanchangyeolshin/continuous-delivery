require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, after, it } = require('mocha')
const { expect } = require('chai')
const uuid = require('uuid/v4')
const axios = require('axios')
const createApp = require('../create-app')

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
      _todo = { _id: uuid(), dueDate: '1/1/2000', task: 'Read a book.' }
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

  describe('GET /', () => {
    it('should return a json object with the repository name and description', async () => {
      const { data } = await axios.get('http://localhost:3000/')
      expect(data).to.deep.equal(_repo)
    })
  })

  describe('GET /todos', () => {
    it('should find and return a list of todos', async () => {
      const { data } = await axios.get('http://localhost:3000/todos')
      expect(data[0])
        .to.include(_todo)
        .and.have.property('_id')
        .that.is.a('string')
    })
  })
})
