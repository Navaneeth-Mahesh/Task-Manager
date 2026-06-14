import { clsx } from 'clsx'

export function cn(...args) {
  return clsx(...args)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function isOverdue(dateStr) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function getDaysLeft(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getPriorityConfig(priority) {
  const map = {
    high: { label: 'High', className: 'badge-high', dot: '#EF4444' },
    medium: { label: 'Medium', className: 'badge-medium', dot: '#F59E0B' },
    low: { label: 'Low', className: 'badge-low', dot: '#22C55E' },
  }
  return map[priority] || map.low
}

export function getStatusConfig(status) {
  const map = {
    'todo': { label: 'Todo', className: 'status-todo', color: '#6B7280' },
    'in-progress': { label: 'In Progress', className: 'status-progress', color: '#06B6D4' },
    'review': { label: 'Review', className: 'status-review', color: '#F59E0B' },
    'completed': { label: 'Completed', className: 'status-done', color: '#22C55E' },
  }
  return map[status] || map.todo
}

export function getTeamMember(teamData, id) {
  return teamData.find(m => m.id === id)
}

export const STATUS_COLUMNS = [
  { id: 'todo', label: 'Todo', color: '#6B7280' },
  { id: 'in-progress', label: 'In Progress', color: '#06B6D4' },
  { id: 'review', label: 'Review', color: '#F59E0B' },
  { id: 'completed', label: 'Completed', color: '#22C55E' },
]
