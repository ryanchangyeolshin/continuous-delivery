require('dotenv/config')
const { MongoClient } = require('mongodb')
const { describe, before, beforeEach, after, it } = require('mocha')
const { expect } = require('chai')
const uuid = require('uuid/v4')
const todosGateway = require('../server/todos-gateway')

describe('todos-gateway', () => {

  let findTodos, insertTodo
  let _db
  let _todo
  let _todos

  before('connect to mongodb', done => {
    MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
      if (err) {
        console.error(err)
        done(err)
      }
      _db = db
      _todo = { id: uuid(), dueDate: '1/1/2000', task: 'Read a book.' }
      _todos = db.collection('todos')
      findTodos = todosGateway(_todos).findTodos
      insertTodo = todosGateway(_todos).insertTodo
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

  describe('findTodos()', () => {
    it('should find and return a list of todos', async () => {
      const todos = await findTodos()
      expect(todos[0]).to.deep.equal(_todo)
    })
  })

  describe('insertTodo()', () => {
    it('return the insertedTodo', async () => {
      const data = { _id: uuid(), dueDate: '1/1/2018', 'task': 'Go for a jog.' }
      const todo = await insertTodo(data)
      expect(todo).to.deep.equal(data)
    })
  })
})
