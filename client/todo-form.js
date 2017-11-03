import React from 'react'

export default function TodoForm({ handleSubmit }) {
  return (
    <form className="mt-lg-4" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input type="date" className="form-control" name="dueDate" id="dueDate" placeholder="Enter due date." />
      </div>
      <div className="form-group">
        <label htmlFor="task">Task</label>
        <input type="text" className="form-control" name="task" id="task" placeholder="Please enter task." />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}
