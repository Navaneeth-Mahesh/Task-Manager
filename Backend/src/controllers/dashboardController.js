import Task from '../models/Task.js'
import User from '../models/User.js'
import { asyncHandler, sendSuccess } from '../utils/ApiError.js'
import { TASK_STATUS, TASK_PRIORITY } from '../constants/index.js'

// ── GET /api/dashboard/stats ─────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const scope = {
    $or: [{ createdBy: userId }, { assignedTo: userId }],
  }

  const [total, completed, inProgress, review, pending, overdue] =
    await Promise.all([
      Task.countDocuments(scope),
      Task.countDocuments({ ...scope, status: TASK_STATUS.COMPLETED }),
      Task.countDocuments({ ...scope, status: TASK_STATUS.IN_PROGRESS }),
      Task.countDocuments({ ...scope, status: TASK_STATUS.REVIEW }),
      Task.countDocuments({ ...scope, status: TASK_STATUS.TODO }),
      Task.countDocuments({
        ...scope,
        dueDate: { $lt: new Date() },
        status: { $ne: TASK_STATUS.COMPLETED },
      }),
    ])

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  sendSuccess(
    res,
    {
      totalTasks: total,
      completed,
      inProgress,
      review,
      pending,
      overdue,
      completionRate,
    },
    'Dashboard stats fetched.'
  )
})

// ── GET /api/dashboard/analytics ─────────────────────────────────────────────
export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id
  const scope = { $or: [{ createdBy: userId }, { assignedTo: userId }] }

  // Tasks created per day — last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [weeklyActivity, priorityDistribution, statusDistribution, monthlyTrend] =
    await Promise.all([
      // Weekly: group by day
      Task.aggregate([
        {
          $match: {
            ...scope,
            createdAt: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            created: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Priority distribution
      Task.aggregate([
        { $match: scope },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Status distribution
      Task.aggregate([
        { $match: scope },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),

      // Monthly trend — last 6 months
      Task.aggregate([
        {
          $match: {
            ...scope,
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m', date: '$createdAt' },
            },
            tasks: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            month: '$_id',
            tasks: 1,
            completed: 1,
            productivity: {
              $cond: [
                { $gt: ['$tasks', 0] },
                { $multiply: [{ $divide: ['$completed', '$tasks'] }, 100] },
                0,
              ],
            },
          },
        },
      ]),
    ])

  sendSuccess(
    res,
    {
      weeklyActivity,
      priorityDistribution,
      statusDistribution,
      monthlyTrend,
    },
    'Analytics fetched.'
  )
})

// ── GET /api/dashboard/team (admin) ──────────────────────────────────────────
export const getTeamStats = asyncHandler(async (req, res) => {
  const members = await User.find({}).select('fullname email avatar role lastLogin')

  const memberStats = await Promise.all(
    members.map(async (member) => {
      const [assigned, completed] = await Promise.all([
        Task.countDocuments({
          assignedTo: member._id,
          status: { $ne: 'completed' },
        }),
        Task.countDocuments({ assignedTo: member._id, status: 'completed' }),
      ])
      return {
        ...member.toObject(),
        tasksAssigned: assigned,
        tasksCompleted: completed,
      }
    })
  )

  sendSuccess(res, { team: memberStats }, 'Team stats fetched.')
})
