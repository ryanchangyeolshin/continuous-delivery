import React, { Component } from 'react'
import axios from 'axios'
import uuid from 'uuid/v4'

export default class TodoForm extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      id: uuid(),
      dueDate: formData.get('dueDate'),
      task: formData.get('task')
    }
    axios.post('/api/todos', data)
    e.target.reset()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input type="text" className="form-control" name="dueDate" id="dueDate" placeholder="Enter due date." />
        </div>
        <div className="form-group">
          <label htmlFor="task">Task</label>
          <input type="text" className="form-control" name="task" id="task" placeholder="Please enter task." />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    )
  }
}
