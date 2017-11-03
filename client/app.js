import React, { Component } from 'react'
import TodoForm from './todo-form'
import TodoList from './todo-list'
import axios from 'axios'
import uuid from 'uuid/v4'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { todos: [] }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    const { data } = await axios.get('/api/todos')
    this.setState({ todos: data })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const todoData = {
      id: uuid(),
      dueDate: formData.get('dueDate'),
      task: formData.get('task')
    }
    e.target.reset()
    const { data } = await axios.post('/api/todos', todoData)
    this.setState({ todos: this.state.todos.concat(data) })
  }

  render() {
    return (
      <div>
        <TodoForm handleSubmit={this.handleSubmit} />
        <TodoList todos={this.state.todos} />
      </div>
    )
  }
}
