import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { useApp } from '../../context/AppContext'
import { TEAM } from '../../data'

const EMPTY = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
  assignee: '',
  tags: '',
}

export function TaskModal({ isOpen, onClose, task = null }) {
  const { addTask, updateTask } = useApp()
  const [form, setForm] = useState(EMPTY)
  const isEdit = !!task

  useEffect(() => {
    if (task) setForm({ ...task, tags: task.tags?.join(', ') || '' })
    else setForm(EMPTY)
  }, [task])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const payload = {
  title: form.title,
  description: form.description,
  priority: form.priority,
  status: form.status,
  dueDate: form.dueDate || null,
  assignedTo: form.assignee || null,
  tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
  progress: form.progress || 0,
}
    if (isEdit) updateTask(task.id, payload)
    else addTask(payload)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Task' : 'New Task'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Title *</label>
          <input
            className="input-field"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="What needs to be done?"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Description</label>
          <textarea
            className="input-field resize-none"
            rows={3}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Add more details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Priority</label>
            <select className="input-field" value={form.priority} onChange={e => set('priority', e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Status</label>
            <select className="input-field" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Due Date</label>
            <input
              type="date"
              className="input-field"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Assignee</label>
            <select className="input-field" value={form.assignee} onChange={e => set('assignee', e.target.value)}>
              <option value="">Unassigned</option>
              {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">Tags (comma-separated)</label>
          <input
            className="input-field"
            value={form.tags}
            onChange={e => set('tags', e.target.value)}
            placeholder="frontend, design, urgent"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary">
            {isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
