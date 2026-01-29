import React from 'react'
import TaskItem from './TaskItem'
import './TaskList.css'

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul className="todo-list">
      {tasks.length === 0 && (
        <li className="empty-list">No tasks yet. Enjoy your day!</li>
      )}
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList
