import React from 'react'
import './TaskItem.css'

function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <li className={`todo-card${task.done ? ' done' : ''}`}>
      <div className="todo-card-row">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
          />
          <span className="checkmark"></span>
        </label>
        <span className="task-text">{task.text}</span>
        <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete task">×</button>
        {task.done && (
          <span className="done-anim" aria-label="Completed">🎉</span>
        )}
      </div>
      {task.description && (
        <span className="task-desc">{task.description}</span>
      )}
    </li>
  )
}

export default TaskItem
