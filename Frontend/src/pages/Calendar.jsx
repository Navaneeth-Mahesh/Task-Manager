import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useApp } from '../context/AppContext'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, parseISO, startOfWeek, endOfWeek } from 'date-fns'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { getStatusConfig } from '../utils'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function Calendar() {
  const { tasks } = useApp()
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(null)

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const getTasksForDay = (day) =>
    tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day))

  const selectedTasks = selected ? getTasksForDay(selected) : []

  const upcomingTasks = tasks
    .filter(t => t.dueDate && parseISO(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  return (
    <DashboardLayout title="Calendar">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Calendar */}
        <motion.div
          className="lg:col-span-2 card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-white">
              {format(current, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                className="p-2 rounded-xl glass hover:border-accent-purple/30 text-text-muted hover:text-white transition-all"
              >
                <RiArrowLeftLine size={16} />
              </button>
              <button
                onClick={() => setCurrent(new Date())}
                className="px-3 py-1.5 text-xs rounded-xl glass hover:border-accent-purple/30 text-text-muted hover:text-white transition-all"
              >
                Today
              </button>
              <button
                onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                className="p-2 rounded-xl glass hover:border-accent-purple/30 text-text-muted hover:text-white transition-all"
              >
                <RiArrowRightLine size={16} />
              </button>
            </div>
          </div>

          {/* DOW headers */}
          <div className="grid grid-cols-7 mb-2">
            {DOW.map(d => (
              <div key={d} className="text-center text-xs font-medium text-text-dim py-2">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => {
              const dayTasks = getTasksForDay(day)
              const isCurrentMonth = day.getMonth() === current.getMonth()
              const isSelected = selected && isSameDay(day, selected)
              const today = isToday(day)

              return (
                <motion.button
                  key={day.toISOString()}
                  onClick={() => setSelected(isSameDay(day, selected) ? null : day)}
                  className={`relative rounded-xl p-2 min-h-[56px] flex flex-col items-center transition-all ${
                    isSelected ? 'bg-accent-purple/20 border border-accent-purple/40' :
                    today ? 'bg-bg-elevated border border-accent-purple/20' :
                    'hover:bg-bg-hover border border-transparent'
                  } ${!isCurrentMonth ? 'opacity-30' : ''}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                    today ? 'bg-accent-purple text-white' :
                    isSelected ? 'text-accent-purple' : 'text-text-secondary'
                  }`}>
                    {format(day, 'd')}
                  </span>

                  {dayTasks.slice(0, 2).map(t => (
                    <div
                      key={t.id}
                      className="w-full text-[9px] truncate px-1 rounded"
                      style={{ background: `${getStatusConfig(t.status).color}20`, color: getStatusConfig(t.status).color }}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[9px] text-text-dim mt-0.5">+{dayTasks.length - 2}</span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Right panel */}
        <div className="space-y-5">
          {/* Selected day tasks */}
          {selected && (
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-display font-semibold text-white mb-4">
                {format(selected, 'MMM d')} · {selectedTasks.length} tasks
              </h3>
              {selectedTasks.length === 0 ? (
                <p className="text-xs text-text-dim">No tasks due on this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedTasks.map(t => {
                    const status = getStatusConfig(t.status)
                    return (
                      <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: status.color }} />
                        <div>
                          <p className="text-sm font-medium text-white">{t.title}</p>
                          <span className={`text-xs ${status.className} mt-1 inline-block`}>{status.label}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* Upcoming deadlines */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-display font-semibold text-white mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {upcomingTasks.map(t => {
                const status = getStatusConfig(t.status)
                const dueDate = parseISO(t.dueDate)
                const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated hover:bg-bg-hover transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{t.title}</p>
                      <p className="text-xs text-text-muted">{format(dueDate, 'MMM d')}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      daysLeft <= 1 ? 'bg-status-danger/10 text-status-danger' :
                      daysLeft <= 3 ? 'bg-status-warning/10 text-status-warning' :
                      'bg-bg-card text-text-dim'
                    }`}>
                      {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
