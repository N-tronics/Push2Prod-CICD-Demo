import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:3000'

export default function App() {
  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch(`${API}/todos`).then(r => r.json()).then(setTodos)
  }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!task.trim()) return
    const res = await fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task }),
    })
    const newTodo = await res.json()
    setTodos(prev => [...prev, newTodo])
    setTask('')
  }

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}`, { method: 'PUT' })
    const updated = await res.json()
    setTodos(prev => prev.map(t => t.id === id ? updated : t))
  }

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: 'DELETE' })
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filtered = todos.filter(t =>
    filter === 'active' ? !t.completed :
    filter === 'done' ? t.completed : true
  )

  const doneCount = todos.filter(t => t.completed).length
  const progress = todos.length ? Math.round((doneCount / todos.length) * 100) : 0

  return (
    <div className="page">
      <div className="app">
        <div className="top">
          <h1>Tasks</h1>
          <p className="sub">{todos.length - doneCount} left to do</p>
        </div>

        {todos.length > 0 && (
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span className="progress-label">{progress}%</span>
          </div>
        )}

        <form onSubmit={addTodo} className="form">
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Add a new task..."
            autoFocus
          />
          <button type="submit">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </form>

        <div className="tabs">
          {[['all','All'], ['active','Active'], ['done','Done']].map(([val, label]) => (
            <button
              key={val}
              className={filter === val ? 'tab active' : 'tab'}
              onClick={() => setFilter(val)}
            >{label}</button>
          ))}
        </div>

        <ul className="list">
          {filtered.length === 0 && (
            <div className="empty">
              <span>✓</span>
              <p>Nothing here</p>
            </div>
          )}
          {filtered.map(todo => (
            <li key={todo.id} className={`row ${todo.completed ? 'done' : ''}`}>
              <button className={`circle ${todo.completed ? 'on' : ''}`} onClick={() => toggleTodo(todo.id)}>
                {todo.completed && <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
              <span className="task-text">{todo.task}</span>
              <button className="del" onClick={() => deleteTodo(todo.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </li>
          ))}
        </ul>

        {doneCount > 0 && filter !== 'active' && (
          <p className="summary">{doneCount} of {todos.length} completed</p>
        )}
      </div>
    </div>
  )
}

