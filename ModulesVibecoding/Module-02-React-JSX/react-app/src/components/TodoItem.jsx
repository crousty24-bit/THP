function TodoItem({ todo, onToggle }) {
  return (
    <li className={todo.completed ? 'todo-item todo-item--done' : 'todo-item'}>
      {/* The whole row is clickable so the completion state is easy to toggle. */}
      <button
        type="button"
        className="todo-item__button"
        onClick={() => onToggle(todo.id)}
        aria-pressed={todo.completed}
      >
        <span className="todo-item__checkbox" aria-hidden="true">
          {todo.completed ? '✓' : ''}
        </span>
        <span>{todo.title}</span>
      </button>
    </li>
  )
}

export default TodoItem
