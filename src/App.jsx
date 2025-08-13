import { useState, useEffect, useRef } from 'react'
import './App.css'

function getTodayKey() {
  const today = new Date()
  return today.toISOString().slice(0, 10)
}

const MOTIVATIONAL_TEXTS = [
  "Make today amazing!",
  "You got this!",
  "One step at a time.",
  "Stay productive!",
  "Keep moving forward!"
]

function App() {
  const todayKey = getTodayKey()
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const [motivation] = useState(
    MOTIVATIONAL_TEXTS[Math.floor(Math.random() * MOTIVATIONAL_TEXTS.length)]
  )
  const [theme, setTheme] = useState('light')

  // Load tasks from localStorage for today
  useEffect(() => {
    const saved = localStorage.getItem(`tasks-${todayKey}`)
    setTasks(saved ? JSON.parse(saved) : [])
  }, [todayKey])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`tasks-${todayKey}`, JSON.stringify(tasks))
  }, [tasks, todayKey])

  // Save theme to localStorage
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
      { id: Date.now(), text: input.trim(), done: false }
    ])
    setInput('')
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
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="todo-input"
          />
          <button type="submit" className="add-btn">+</button>
        </form>
        <ul className="todo-list">
          {tasks.length === 0 && (
            <li className="empty-list">No tasks yet. Enjoy your day!</li>
          )}
          {tasks.map(task => (
            <li key={task.id} className={`todo-card${task.done ? ' done' : ''}`}>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
