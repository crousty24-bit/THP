import { useEffect, useState } from 'react'
import Header from './components/Header'
import TodoItem from './components/TodoItem'
import './App.css'

const TODO_API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=5'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTodos() {
      try {
        const response = await fetch(TODO_API_URL)

        if (!response.ok) {
          throw new Error('The todo API did not respond correctly.')
        }

        const apiTodos = await response.json()
        const cleanedTodos = apiTodos
          .filter((todo) => todo && todo.id && todo.title)
          .map((todo) => ({
            id: todo.id,
            title: todo.title,
            completed: Boolean(todo.completed),
          }))

        setTodos(cleanedTodos)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [])

  function handleAddTodo(event) {
    event.preventDefault()

    const title = newTodoTitle.trim()
    if (!title) return

    setTodos((currentTodos) => [
      {
        // Date.now is enough here because locally added tasks are not persisted.
        id: Date.now(),
        title,
        completed: false,
      },
      ...currentTodos,
    ])
    setNewTodoTitle('')
  }

  function handleToggleTodo(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <main className="app-shell">
      <Header title="React Todo Starter" />

      <section className="todo-panel" aria-labelledby="todo-heading">
        <div className="todo-panel__intro">
          <div>
            <p className="section-label">JSONPlaceholder API</p>
            <h2 id="todo-heading">Tasks</h2>
          </div>
          <p className="todo-count">
            {completedCount}/{todos.length} completed
          </p>
        </div>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <label htmlFor="new-todo">Add a local task</label>
          <div className="todo-form__controls">
            <input
              id="new-todo"
              type="text"
              value={newTodoTitle}
              onChange={(event) => setNewTodoTitle(event.target.value)}
              placeholder="Example: review React hooks"
            />
            <button type="submit">Add</button>
          </div>
        </form>

        {isLoading && <p className="status-message">Loading tasks...</p>}
        {error && <p className="status-message status-message--error">{error}</p>}

        {!isLoading && !error && (
          <ul className="todo-list" aria-label="Todo list">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={handleToggleTodo} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
