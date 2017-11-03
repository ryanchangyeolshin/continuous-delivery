module.exports = collection => {
  return {
    async findTodos() {
      const todos = await collection.find({}).toArray()
      return todos
    },
    async insertTodo(data) {
      const todo = await collection.insertOne(data)
      return todo.ops[0]
    }
  }
}
