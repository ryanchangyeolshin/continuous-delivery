const express = require('express')
const todosGateway = require('./todos-gateway')
const bodyParser = require('body-parser')
const path = require('path')

module.exports = (db) => {
  const todos = db.collection('todos')
  const app = express()
  const { findTodos, insertTodo } = todosGateway(todos)
  const publicPath = path.join(__dirname, 'public')
  console.log(__dirname)

  app
    .use(express.static(publicPath))
    .use(bodyParser.json())
    .get('/todos', async (req, res) => {
      const _todos = await findTodos(todos)
      res.status(200).json(_todos)
    })
    .post('/todos', async (req, res) => {
      const todo = await insertTodo(req.body)
      res.status(201).json(todo)
    })
  return app
}
