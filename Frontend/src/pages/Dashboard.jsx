import { motion } from 'framer-motion'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useApp } from '../context/AppContext'
import { TaskCard } from '../components/TaskCard'
import { WEEKLY_ACTIVITY } from '../data'
import {
  RiTaskLine,
  RiCheckDoubleLine,
  RiTimeLine,
  RiLoader4Line,
  RiArrowUpLine,
  RiArrowRightLine,
  RiFlashlightLine,
} from 'react-icons/ri'
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts'
import { Link } from 'react-router-dom'

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  color,
  delay,
}) {
  return (
    <motion.div
      className="card-hover group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-text-muted">
          {label}
        </p>

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}25`,
          }}
        >
          <Icon size={17} style={{ color }} />
        </div>
      </div>

      <p className="font-display text-4xl font-bold text-white mb-2">
        {value}
      </p>

      {trend && (
        <p
          className={`text-xs flex items-center gap-1 ${
            trendUp
              ? 'text-status-success'
              : 'text-status-danger'
          }`}
        >
          <RiArrowUpLine
            size={12}
            className={trendUp ? '' : 'rotate-180'}
          />
          {trend} from last week
        </p>
      )}
    </motion.div>
  )
}

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null

  return (
    <div className="glass rounded-xl p-3 text-xs border border-border shadow-modal">
      <p className="text-text-muted mb-1">{label}</p>

      <p className="text-accent-purple font-medium">
        {payload[0]?.value} completed
      </p>

      {payload[1] && (
        <p className="text-accent-cyan font-medium">
          {payload[1]?.value} created
        </p>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { tasks, stats, currentUser } = useApp()

  const recentTasks = tasks.slice(0, 4)

  const onlineTeam = []

  const STAT_CARDS = [
    {
      icon: RiTaskLine,
      label: 'Total Tasks',
      value: stats.totalTasks,
      trend: '+2',
      trendUp: true,
      color: '#8B5CF6',
    },
    {
      icon: RiCheckDoubleLine,
      label: 'Completed',
      value: stats.completed,
      trend: '+1',
      trendUp: true,
      color: '#22C55E',
    },
    {
      icon: RiLoader4Line,
      label: 'In Progress',
      value: stats.inProgress,
      trend: '+1',
      trendUp: true,
      color: '#06B6D4',
    },
    {
      icon: RiTimeLine,
      label: 'Pending',
      value: stats.pending,
      trend: '-1',
      trendUp: false,
      color: '#F59E0B',
    },
  ]

  const firstname =
    currentUser?.name?.split(' ')[0] ||
    currentUser?.fullname?.split(' ')[0] ||
    'User'

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div>
            <h2 className="font-display text-2xl font-bold text-white">
              Good morning, {firstname}
            </h2>

            <p className="text-sm text-text-muted mt-1">
              You have{' '}
              <span className="text-accent-purple font-medium">
                {stats.inProgress} tasks in progress
              </span>{' '}
              and{' '}
              <span className="text-status-warning font-medium">
                {stats.pending} pending
              </span>
              .
            </p>
          </div>

          <Link to="/tasks">
            <motion.button
              className="btn-primary flex items-center gap-2 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RiFlashlightLine size={15} />
              Quick add
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card, i) => (
            <StatCard
              key={card.label}
              {...card}
              delay={0.1 + i * 0.08}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2 card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-white">
                  Weekly Activity
                </h3>

                <p className="text-xs text-text-muted mt-0.5">
                  Tasks completed vs created
                </p>
              </div>

              <span className="text-xs text-text-dim">
                This week
              </span>
            </div>

            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={WEEKLY_ACTIVITY}
                barGap={4}
              >
                <XAxis
                  dataKey="day"
                  tick={{
                    fill: '#6B7280',
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: 'rgba(255,255,255,0.02)',
                  }}
                />

                <Bar
                  dataKey="completed"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />

                <Bar
                  dataKey="created"
                  fill="rgba(6,182,212,0.3)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-white">
                Team Online
              </h3>

              <span className="text-xs px-2 py-0.5 rounded-full bg-status-success/10 text-status-success border border-status-success/20">
                0 active
              </span>
            </div>

            <div className="text-center py-10">
              <p className="text-sm text-text-muted">
                No team members yet
              </p>
            </div>

            <Link
              to="/team"
              className="block mt-4 text-center text-xs text-accent-purple hover:underline"
            >
              View all team members →
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-white">
              Recent Tasks
            </h3>

            <Link
              to="/tasks"
              className="text-xs text-accent-purple hover:underline flex items-center gap-1"
            >
              View all
              <RiArrowRightLine size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTasks.map((task, i) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                index={i}
                onEdit={() => {}}
                onDelete={() => {}}
                onView={() => {}}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}