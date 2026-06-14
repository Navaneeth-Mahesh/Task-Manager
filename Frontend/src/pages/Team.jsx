import { motion } from 'framer-motion'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { useApp } from '../context/AppContext'
import { RiUserAddLine } from 'react-icons/ri'

export default function Team() {
  const { tasks = [] } = useApp()

  const teamMembers = []

  const onlineCount = 0
  const totalTasks = tasks.filter(
    (task) => task.status !== 'completed'
  ).length

  const totalCompleted = tasks.filter(
    (task) => task.status === 'completed'
  ).length

  return (
    <DashboardLayout title="Team">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Team stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: 'Team Members',
              value: teamMembers.length,
              color: '#8B5CF6',
            },
            {
              label: 'Online Now',
              value: onlineCount,
              color: '#22C55E',
            },
            {
              label: 'Active Tasks',
              value: totalTasks,
              color: '#06B6D4',
            },
            {
              label: 'Total Shipped',
              value: totalCompleted,
              color: '#F59E0B',
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="card-hover text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <p
                className="font-display text-3xl font-bold mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </p>

              <p className="text-xs text-text-muted">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              All Members
            </h2>

            <p className="text-sm text-text-muted mt-0.5">
              {teamMembers.length} people · {onlineCount} online
            </p>
          </div>

          <motion.button
            className="btn-primary flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RiUserAddLine size={15} />
            Invite Member
          </motion.button>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {teamMembers.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <h3 className="text-white text-lg font-semibold">
                No Team Members Yet
              </h3>

              <p className="text-text-muted mt-2">
                Invite members using a Team Code.
              </p>
            </div>
          ) : (
            teamMembers.map((member, i) => (
              <MemberCard
                key={member.id}
                member={member}
                tasks={tasks}
                index={i}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}