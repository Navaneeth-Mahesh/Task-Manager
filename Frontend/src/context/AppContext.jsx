import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authService, taskService, dashboardService } from '../services/api.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState({ totalTasks: 0, completed: 0, inProgress: 0, pending: 0, review: 0 })
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount — check if user is already logged in via cookie
  useEffect(() => {
    authService.me()
      .then(res => {
        setCurrentUser(res.data.user)
        setIsAuthenticated(true)
        return taskService.list()
      })
      .then(res => { if (res) setTasks(res.data || []) })
      .catch(() => {}) // not logged in — that's fine
      .finally(() => setLoading(false))
  }, [])

  // Refresh dashboard stats whenever tasks change
  useEffect(() => {
    if (!isAuthenticated) return
    dashboardService.stats()
      .then(res => setStats(res.data))
      .catch(() => {})
  }, [isAuthenticated, tasks.length])

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password)
    setCurrentUser(res.data.user)
    setIsAuthenticated(true)
    const tasksRes = await taskService.list()
    setTasks(tasksRes.data || [])
    return res
  }, [])

  const register = useCallback(async (fullname, email, password) => {
    const res = await authService.register(fullname, email, password)
    setCurrentUser(res.data.user)
    setIsAuthenticated(true)
    return res
  }, [])

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {})
    setIsAuthenticated(false)
    setCurrentUser(null)
    setTasks([])
  }, [])

  const addTask = useCallback(async (payload) => {
    const res = await taskService.create(payload)
    setTasks(prev => [res.data.task, ...prev])
    return res.data.task
  }, [])

  const updateTask = useCallback(async (id, payload) => {
    const res = await taskService.update(id, payload)
    setTasks(prev => prev.map(t => t._id === id ? res.data.task : t))
    return res.data.task
  }, [])

  const deleteTask = useCallback(async (id) => {
    await taskService.delete(id)
    setTasks(prev => prev.filter(t => t._id !== id))
  }, [])

  const moveTask = useCallback(async (id, newStatus) => {
    await taskService.updateStatus(id, newStatus)
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t))
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, background: '#8B5CF6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>⚡</div>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Loading TaskFlow…</p>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      isAuthenticated, login, register, logout,
      currentUser, setCurrentUser,
      tasks, addTask, updateTask, deleteTask, moveTask,
      stats,
      sidebarCollapsed, setSidebarCollapsed,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
