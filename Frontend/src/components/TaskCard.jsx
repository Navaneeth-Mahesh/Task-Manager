import { motion } from 'framer-motion'
import {
  RiCalendarLine,
  RiMoreLine,
  RiEditLine,
  RiDeleteBinLine,
  RiEyeLine,
} from 'react-icons/ri'
import { useState } from 'react'
import {
  getPriorityConfig,
  getStatusConfig,
  formatDate,
  getDaysLeft,
} from '../utils'

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onView,
  index = 0,
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const priority = getPriorityConfig(task.priority)
  const status = getStatusConfig(task.status)
  const daysLeft = getDaysLeft(task.dueDate)

  return (
    <motion.div
      className="card-hover relative group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
      }}
      whileHover={{ y: -2 }}
      onClick={() => onView?.(task)}
    >
      <div
        className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full"
        style={{
          backgroundColor: priority.dot,
        }}
      />

      <div className="pl-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-white leading-snug flex-1 line-clamp-2">
            {task.title}
          </h3>

          <div
            className="relative flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/5 text-text-muted hover:text-white transition-all"
            >
              <RiMoreLine size={15} />
            </button>

            {menuOpen && (
              <motion.div
                className="absolute right-0 top-8 w-36 glass-strong rounded-xl shadow-modal border border-border overflow-hidden z-50"
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
              >
                <button
                  onClick={() => {
                    onView?.(task)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:text-white hover:bg-white/5"
                >
                  <RiEyeLine size={13} />
                  View
                </button>

                <button
                  onClick={() => {
                    onEdit?.(task)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:text-white hover:bg-white/5"
                >
                  <RiEditLine size={13} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    onDelete?.(task)
                    setMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-status-danger hover:bg-white/5"
                >
                  <RiDeleteBinLine size={13} />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-text-dim border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className={priority.className}>
              {priority.label}
            </span>

            <span className={status.className}>
              {status.label}
            </span>
          </div>
        </div>

        {task.dueDate && (
          <div
            className={`flex items-center gap-1.5 text-[11px] ${
              daysLeft !== null && daysLeft < 0
                ? 'text-status-danger'
                : daysLeft !== null && daysLeft <= 2
                ? 'text-status-warning'
                : 'text-text-dim'
            }`}
          >
            <RiCalendarLine size={11} />

            {formatDate(task.dueDate)}

            {daysLeft !== null &&
              daysLeft < 0 &&
              ` · ${Math.abs(daysLeft)}d overdue`}

            {daysLeft === 0 && ' · Due today'}
          </div>
        )}

        {task.progress > 0 && (
          <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  'linear-gradient(90deg,#8B5CF6,#06B6D4)',
              }}
              initial={{ width: 0 }}
              animate={{
                width: `${task.progress}%`,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}