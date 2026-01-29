import { useState, useEffect, useRef } from 'react'
import GojoImg from './assets/gojo.jpg'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'

const MOTIVATIONAL_TEXTS = [
  "Make today amazing!",
  "You got this!",
  "One step at a time.",
  "Stay productive!",
  "Keep moving forward!"
]

function App() {
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
  const [theme, setTheme] = useState('gojo')

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
    setTheme(theme === 'gojo' ? 'itachi' : 'gojo')
  }

  return (
    <div className={`todo-bg theme-${theme}`}>
      <div className="todo-container">
        <header className="todo-header">
          <h1>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</h1>
          <p className="motivation">{motivation}</p>
          <button onClick={handleThemeToggle} className="theme-toggle-btn">
            {theme === 'gojo' ? 'Itachi' : 'Gojo'}
          </button>
        </header>
        <TaskInput
          input={input}
          setInput={setInput}
          descInput={descInput}
          setDescInput={setDescInput}
          addTask={addTask}
          inputRef={inputRef}
          GojoImg={GojoImg}
        />
        <TaskList
          tasks={tasks}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  )
}

export default App
