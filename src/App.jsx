import { useState, useEffect, useRef } from 'react'
import './App.css'
import GojoImg from './assets/gojo.jpg' // import the Gojo image

const MOTIVATIONAL_TEXTS = [
  "Make today amazing!",
  "You got this!",
  "One step at a time.",
  "Stay productive!",
  "Keep moving forward!"
]

function App() {
  // Use functional initializer for tasks
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tasks')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const inputRef = useRef(null)
  const [motivation] = useState(
    MOTIVATIONAL_TEXTS[Math.floor(Math.random() * MOTIVATIONAL_TEXTS.length)]
  )
  const [theme, setTheme] = useState('light')

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  function addTask(e) {
    e.preventDefault()
    if (!input.trim()) return
    setTasks([
      ...tasks,
      { id: Date.now(), text: input.trim(), description: descInput.trim(), done: false }
    ])
    setInput('')
    setDescInput('')
    inputRef.current?.blur()
  }

  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id))
  }

  function handleThemeToggle() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className={`todo-bg${theme === 'dark' ? ' dark-theme' : ''}`}>
      <div className="todo-container">
        <header className="todo-header">
          <h1>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h1>
          <p className="motivation">{motivation}</p>
          <button onClick={handleThemeToggle} className="theme-toggle-btn">
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>

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

        <ul className="todo-list">
          {tasks.length === 0 && (
            <li className="empty-list">No tasks yet. Enjoy your day!</li>
          )}
          {tasks.map(task => (
            <li key={task.id} className={`todo-card${task.done ? ' done' : ''}`}>
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
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
