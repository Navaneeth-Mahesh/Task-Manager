import { motion } from 'framer-motion'
import { DashboardLayout } from '../layouts/DashboardLayout'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import {
  WEEKLY_ACTIVITY,
  MONTHLY_TREND,
  STATUS_DISTRIBUTION,
} from '../data'
import { useApp } from '../context/AppContext'

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div className="glass rounded-xl p-3 text-xs border border-border shadow-modal">
      {label && <p className="text-text-muted mb-1">{label}</p>}
      {payload.map((p) => (
        <p
          key={p.name}
          style={{ color: p.color }}
          className="font-medium"
        >
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="mb-6">
        <h3 className="font-display font-semibold text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-text-muted mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </motion.div>
  )
}

export default function Analytics() {
  const { tasks = [] } = useApp()

  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (t) => t.status === 'completed'
  ).length

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100)

  const kpis = [
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      trend: '',
      color: '#22C55E',
    },
    {
      label: 'Avg Task Duration',
      value: totalTasks === 0 ? '0d' : '3d',
      trend: '',
      color: '#8B5CF6',
    },
    {
      label: 'Weekly Velocity',
      value: completedTasks,
      trend: '',
      color: '#06B6D4',
    },
    {
      label: 'Active Streak',
      value: totalTasks === 0 ? '0d' : '1d',
      trend: '',
      color: '#F59E0B',
    },
  ]

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              className="card-hover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <p className="text-xs text-text-muted mb-2">
                {k.label}
              </p>

              <p className="font-display text-3xl font-bold text-white">
                {k.value}
              </p>

              {k.trend && (
                <p
                  className="text-xs mt-1"
                  style={{ color: k.color }}
                >
                  {k.trend} vs last week
                </p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="Weekly Activity"
            subtitle="Completed vs created"
            delay={0.2}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={WEEKLY_ACTIVITY}
                barGap={4}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<Tip />}
                  cursor={{
                    fill: 'rgba(255,255,255,0.02)',
                  }}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#8B5CF6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />

                <Bar
                  dataKey="created"
                  name="Created"
                  fill="rgba(6,182,212,0.4)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="By Status"
            subtitle="Current distribution"
            delay={0.3}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={STATUS_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {STATUS_DISTRIBUTION.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip content={<Tip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {STATUS_DISTRIBUTION.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: s.color,
                    }}
                  />

                  <span className="text-xs text-text-muted">
                    {s.name}
                  </span>

                  <span className="text-xs font-medium text-white ml-auto">
                    {s.value}%
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <ChartCard
          title="Productivity Trends"
          subtitle="6-month overview"
          delay={0.4}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient
                  id="prodGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#8B5CF6"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#8B5CF6"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="taskGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#06B6D4"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#06B6D4"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<Tip />} />

              <Area
                type="monotone"
                dataKey="productivity"
                name="Productivity %"
                stroke="#8B5CF6"
                fill="url(#prodGrad)"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 3 }}
              />

              <Area
                type="monotone"
                dataKey="tasks"
                name="Tasks Closed"
                stroke="#06B6D4"
                fill="url(#taskGrad)"
                strokeWidth={2}
                dot={{ fill: '#06B6D4', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardLayout>
  )
}