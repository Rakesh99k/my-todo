import React from 'react'
import './TaskInput.css'

function TaskInput({ input, setInput, descInput, setDescInput, addTask, inputRef, GojoImg }) {
  return (
    <form className="todo-input-card" onSubmit={addTask}>
      <div className="input-box">
        <label htmlFor="task-input" className="input-label">Task</label>
        <input
          id="task-input"
          ref={inputRef}
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="todo-input"
        />
      </div>
      <div className="input-box">
        <label htmlFor="desc-input" className="input-label">Description</label>
        <input
          id="desc-input"
          type="text"
          placeholder="Add description (optional)..."
          value={descInput}
          onChange={e => setDescInput(e.target.value)}
          className="todo-desc-input"
        />
      </div>
      <button type="submit" className="add-btn">
        <img
          src={GojoImg}
          alt="Add Task"
          className="gojo-btn-img"
        />
      </button>
    </form>
  )
}

export default TaskInput
