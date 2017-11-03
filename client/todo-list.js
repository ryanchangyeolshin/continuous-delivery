import React from 'react'

function renderTodo({ id, task, dueDate }, index) {
  return (
    <a key={ index } className="list-group-item list-group-item-action flex-column align-items-start mb-lg-3">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">Task: { task }</h5>
      </div>
      <p key={ index } className="mb-1">Due Date: { dueDate }</p>
    </a>
  )
}

export default function TodoList({ todos }) {
  return (
    <div className="list-group mt-lg-4">
      { todos.map(renderTodo) }
    </div>
  )
}
