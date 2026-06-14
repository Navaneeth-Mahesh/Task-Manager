import { Modal } from '../ui/Modal'
import { getPriorityConfig, getStatusConfig, formatDate, getDaysLeft } from '../../utils'
import { TEAM } from '../../data'
import { Avatar } from '../ui/Avatar'
import { RiCalendarLine, RiTimeLine } from 'react-icons/ri'

export function TaskDetailModal({ isOpen, onClose, task }) {
  if (!task) return null
  const priority = getPriorityConfig(task.priority)
  const status = getStatusConfig(task.status)
  const assignee = TEAM.find(m => m.id === task.assignee)
  const daysLeft = getDaysLeft(task.dueDate)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-display font-semibold text-white mb-2">{task.title}</h3>
          <p className="text-sm text-text-muted leading-relaxed">{task.description}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={priority.className}>{priority.label} Priority</span>
          <span className={status.className}>{status.label}</span>
          {task.tags?.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg-elevated rounded-xl p-4 space-y-1">
            <p className="text-xs text-text-dim flex items-center gap-1.5"><RiCalendarLine size={12} /> Due Date</p>
            <p className="text-sm font-medium text-white">{formatDate(task.dueDate)}</p>
            {daysLeft !== null && (
              <p className={`text-xs ${daysLeft < 0 ? 'text-status-danger' : daysLeft <= 2 ? 'text-status-warning' : 'text-text-muted'}`}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
              </p>
            )}
          </div>

          {assignee && (
            <div className="bg-bg-elevated rounded-xl p-4 space-y-2">
              <p className="text-xs text-text-dim">Assignee</p>
              <div className="flex items-center gap-2">
                <Avatar initials={assignee.avatar} color={assignee.avatarColor} size="sm" />
                <div>
                  <p className="text-sm font-medium text-white">{assignee.name}</p>
                  <p className="text-xs text-text-muted">{assignee.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-xs text-text-muted">Progress</span>
            <span className="text-xs font-medium text-white">{task.progress || 0}%</span>
          </div>
          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${task.progress || 0}%`, background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }}
            />
          </div>
        </div>

        <div className="text-xs text-text-dim flex items-center gap-1">
          <RiTimeLine size={12} /> Created {formatDate(task.createdAt)}
        </div>
      </div>
    </Modal>
  )
}
