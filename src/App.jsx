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

const CATEGORIES = [
  { id: 'work', name: 'Work', color: '#3B82F6', emoji: '💼' },
  { id: 'personal', name: 'Personal', color: '#10B981', emoji: '🏠' },
  { id: 'shopping', name: 'Shopping', color: '#F59E0B', emoji: '🛒' },
  { id: 'health', name: 'Health', color: '#EF4444', emoji: '🏥' },
  { id: 'learning', name: 'Learning', color: '#8B5CF6', emoji: '📚' },
  { id: 'other', name: 'Other', color: '#6B7280', emoji: '📝' }
]

const PRIORITIES = {
  high: { name: 'High', color: '#EF4444', emoji: '🔴' },
  medium: { name: 'Medium', color: '#F59E0B', emoji: '🟡' },
  low: { name: 'Low', color: '#10B981', emoji: '🟢' }
}

function App() {
  // Use functional initializer for tasks
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('tasks')
      const parsedTasks = saved ? JSON.parse(saved) : []
      // Migrate old tasks to new structure if needed
      return parsedTasks.map(task => ({
        id: task.id,
        text: task.text,
        description: task.description || '',
        done: task.done,
        category: task.category || 'other',
        priority: task.priority || 'medium',
        dueDate: task.dueDate || null,
        subtasks: task.subtasks || [],
        createdAt: task.createdAt || Date.now()
      }))
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [descInput, setDescInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('other')
  const [priorityInput, setPriorityInput] = useState('medium')
  const [dueDateInput, setDueDateInput] = useState('')
  const [subtaskInput, setSubtaskInput] = useState('')
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  
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
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      description: descInput.trim(),
      category: categoryInput,
      priority: priorityInput,
      dueDate: dueDateInput || null,
      subtasks: [],
      done: false,
      createdAt: Date.now()
    }
    setTasks(prevTasks => [...prevTasks, newTask])
    setInput('')
    setDescInput('')
    setCategoryInput('other')
    setPriorityInput('medium')
    setDueDateInput('')
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

  function addSubtask(taskId, subtaskText) {
    if (!subtaskText.trim()) return
    setTasks(tasks.map(t =>
      t.id === taskId 
        ? { ...t, subtasks: [...t.subtasks, { id: Date.now(), text: subtaskText.trim(), done: false }] }
        : t
    ))
  }

  function toggleSubtask(taskId, subtaskId) {
    setTasks(tasks.map(t =>
      t.id === taskId 
        ? { ...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st) }
        : t
    ))
  }

  function deleteSubtask(taskId, subtaskId) {
    setTasks(tasks.map(t =>
      t.id === taskId 
        ? { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) }
        : t
    ))
  }

  function getTaskProgress(task) {
    if (task.subtasks.length === 0) return task.done ? 100 : 0
    const completedSubtasks = task.subtasks.filter(st => st.done).length
    return Math.round((completedSubtasks / task.subtasks.length) * 100)
  }

  function isTaskOverdue(task) {
    if (!task.dueDate) return false
    return new Date(task.dueDate) < new Date() && !task.done
  }

  function getFilteredTasks() {
    return tasks.filter(task => {
      const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'completed' && task.done) ||
                            (filterStatus === 'pending' && !task.done) ||
                            (filterStatus === 'overdue' && isTaskOverdue(task))
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus
    })
  }

  function handleThemeToggle() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const filteredTasks = getFilteredTasks()

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

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-row">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="filter-select">
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
              <option value="all">All Priorities</option>
              {Object.entries(PRIORITIES).map(([key, priority]) => (
                <option key={key} value={key}>{priority.emoji} {priority.name}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Tasks</option>
              <option value="pending">⏳ Pending</option>
              <option value="completed">✅ Completed</option>
              <option value="overdue">⚠️ Overdue</option>
            </select>
          </div>
        </div>

        {/* Add Task Form */}
        <form className="todo-input-card" onSubmit={addTask}>
          <div className="input-row">
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
                required
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
          </div>
          <div className="input-row">
            <div className="input-box">
              <label htmlFor="category-input" className="input-label">Category</label>
              <select 
                id="category-input"
                value={categoryInput} 
                onChange={e => setCategoryInput(e.target.value)}
                className="category-select"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                ))}
              </select>
            </div>
            <div className="input-box">
              <label htmlFor="priority-input" className="input-label">Priority</label>
              <select 
                id="priority-input"
                value={priorityInput} 
                onChange={e => setPriorityInput(e.target.value)}
                className="priority-select"
              >
                {Object.entries(PRIORITIES).map(([key, priority]) => (
                  <option key={key} value={key}>{priority.emoji} {priority.name}</option>
                ))}
              </select>
            </div>
            <div className="input-box">
              <label htmlFor="date-input" className="input-label">Due Date</label>
              <input
                id="date-input"
                type="date"
                value={dueDateInput}
                onChange={e => setDueDateInput(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
          <button type="submit" className="add-btn">
            <img
              src={GojoImg}
              alt="Add Task"
              className="gojo-btn-img"
            />
            Add Task
          </button>
        </form>

        {/* Task List */}
        <div className="task-stats">
          <span>Total: {filteredTasks.length}</span>
          <span>Completed: {filteredTasks.filter(t => t.done).length}</span>
          <span>Pending: {filteredTasks.filter(t => !t.done).length}</span>
          <span>Overdue: {filteredTasks.filter(t => isTaskOverdue(t)).length}</span>
        </div>

        <ul className="todo-list">
          {filteredTasks.length === 0 && (
            <li className="empty-list">
              {tasks.length === 0 ? "No tasks yet. Enjoy your day!" : "No tasks match your filters."}
            </li>
          )}
          {filteredTasks.map(task => {
            const category = CATEGORIES.find(c => c.id === task.category)
            const priority = PRIORITIES[task.priority]
            const progress = getTaskProgress(task)
            const overdue = isTaskOverdue(task)
            
            return (
              <li key={task.id} className={`todo-card${task.done ? ' done' : ''}${overdue ? ' overdue' : ''}`}>
                <div className="todo-card-header">
                  <div className="todo-main-row">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span className="task-text">{task.text}</span>
                    <div className="task-badges">
                      <span className="category-badge" style={{backgroundColor: category?.color}}>
                        {category?.emoji} {category?.name}
                      </span>
                      <span className="priority-badge" style={{color: priority.color}}>
                        {priority.emoji} {priority.name}
                      </span>
                      {task.dueDate && (
                        <span className={`due-date-badge${overdue ? ' overdue' : ''}`}>
                          📅 {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete task">×</button>
                    {task.done && (
                      <span className="done-anim" aria-label="Completed">🎉</span>
                    )}
                  </div>
                  {task.description && (
                    <span className="task-desc">{task.description}</span>
                  )}
                  {task.subtasks.length > 0 && (
                    <div className="progress-bar">
                      <div className="progress-fill" style={{width: `${progress}%`}}></div>
                      <span className="progress-text">{progress}% Complete</span>
                    </div>
                  )}
                </div>
                
                {/* Subtasks */}
                <div className="subtasks-section">
                  {task.subtasks.map(subtask => (
                    <div key={subtask.id} className={`subtask${subtask.done ? ' done' : ''}`}>
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={subtask.done}
                          onChange={() => toggleSubtask(task.id, subtask.id)}
                        />
                        <span className="checkmark"></span>
                      </label>
                      <span className="subtask-text">{subtask.text}</span>
                      <button 
                        className="delete-subtask-btn" 
                        onClick={() => deleteSubtask(task.id, subtask.id)}
                        title="Delete subtask"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="add-subtask">
                    <input
                      type="text"
                      placeholder="Add subtask..."
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSubtask(task.id, subtaskInput)
                          setSubtaskInput('')
                        }
                      }}
                      className="subtask-input"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        addSubtask(task.id, subtaskInput)
                        setSubtaskInput('')
                      }}
                      className="add-subtask-btn"
                      disabled={!subtaskInput.trim()}
                    >
                      +
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
