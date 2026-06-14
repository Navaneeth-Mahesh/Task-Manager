import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useApp } from '../context/AppContext'
import { TaskCard } from '../components/TaskCard'
import { TaskModal } from '../components/modals/TaskModal'
import { DeleteModal } from '../components/modals/DeleteModal'
import { TaskDetailModal } from '../components/modals/TaskDetailModal'
import { STATUS_COLUMNS, getPriorityConfig, getStatusConfig } from '../utils'
import { RiAddLine, RiLayoutGridLine, RiListCheck2, RiFilterLine } from 'react-icons/ri'

function KanbanColumn({ column, tasks, onEdit, onDelete, onView }) {
  return (
    <div className="flex-shrink-0 w-72">
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
        <h3 className="text-sm font-semibold text-white">{column.label}</h3>
        <span className="ml-auto text-xs text-text-dim bg-bg-elevated px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>

      <div className="space-y-3 min-h-[200px] p-3 rounded-2xl bg-bg-secondary border border-border">
        <AnimatePresence>
          {tasks.map((task, i) => (
            <TaskCard key={task._id} task={task} index={i} onEdit={onEdit} onDelete={onDelete} onView={onView} />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-text-dim border border-dashed border-border rounded-xl">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}

export default function Tasks() {
  const { tasks } = useApp()
  const [view, setView] = useState('list') // list | kanban
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [deleteTask, setDeleteTask] = useState(null)
  const [viewTask, setViewTask] = useState(null)

  const filtered = tasks.filter(t => {
    const statusMatch = filter === 'all' || t.status === filter
    const priorityMatch = priorityFilter === 'all' || t.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  return (
    <DashboardLayout title="My Tasks">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            {/* Status filter */}
            <select
              className="input-field w-auto text-sm py-2"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="input-field w-auto text-sm py-2"
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <span className="text-xs text-text-dim px-2">{filtered.length} tasks</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="glass rounded-xl flex p-1">
              {[{ id: 'list', icon: RiListCheck2 }, { id: 'kanban', icon: RiLayoutGridLine }].map(v => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`p-2 rounded-lg transition-all ${view === v.id ? 'bg-accent-purple text-white' : 'text-text-muted hover:text-white'}`}
                >
                  <v.icon size={16} />
                </button>
              ))}
            </div>

            <motion.button
              className="btn-primary flex items-center gap-2 text-sm"
              onClick={() => setCreateOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RiAddLine size={16} /> New Task
            </motion.button>
          </div>
        </div>

        {/* List view */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((task, i) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={i}
                  onEdit={t => setEditTask(t)}
                  onDelete={t => setDeleteTask(t)}
                  onView={t => setViewTask(t)}
                />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <motion.div
                className="col-span-3 text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-text-dim text-sm">No tasks match your filters.</p>
                <button onClick={() => setCreateOpen(true)} className="mt-3 text-accent-purple text-sm hover:underline">
                  Create one →
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Kanban view */}
        {view === 'kanban' && (
          <div className="kanban-scroll">
            {STATUS_COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={filtered.filter(t => t.status === col.id)}
                onEdit={t => setEditTask(t)}
                onDelete={t => setDeleteTask(t)}
                onView={t => setViewTask(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TaskModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <TaskModal isOpen={!!editTask} onClose={() => setEditTask(null)} task={editTask} />
      <DeleteModal
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        taskId={deleteTask?._id}
        taskTitle={deleteTask?.title}
      />
      <TaskDetailModal isOpen={!!viewTask} onClose={() => setViewTask(null)} task={viewTask} />
    </DashboardLayout>
  )
}
