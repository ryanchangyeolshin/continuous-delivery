const express = require('express')
const findAll = require('./todos-gateway')

module.exports = (db) => {
  const todos = db.collection('todos')
  const app = express()
  app
    .get('/', (req, res) => {
      res.json({
        name: 'continuous-delivery',
        description: 'A practice repository for testing and deployment'
      })
    })
    .get('/todos', async (req, res) => {
      const _todos = await findAll(todos)
      res.json(_todos)
    })
  return app
}
