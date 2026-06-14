import Task from '../models/Task.js'
import { ApiError, asyncHandler, sendSuccess, sendPaginated } from '../utils/ApiError.js'
import { buildTaskQuery } from '../utils/queryBuilder.js'
import { SOCKET_EVENTS } from '../constants/index.js'

/**
 * Emit a socket event to all connected clients in the user's workspace.
 * io is attached to req by app.js via: app.set('io', io)
 */
const emit = (req, event, payload) => {
  const io = req.app.get('io')
  if (io) io.emit(event, payload)
}

// ── POST /api/tasks ───────────────────────────────────────────────────────────
export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    createdBy: req.user._id,
  })

  await task.populate([
    { path: 'createdBy', select: 'fullname email avatar' },
    { path: 'assignedTo', select: 'fullname email avatar' },
  ])

  emit(req, SOCKET_EVENTS.TASK_CREATED, { task })

  sendSuccess(res, { task }, 'Task created successfully.', 201)
})

// ── GET /api/tasks ────────────────────────────────────────────────────────────
export const getTasks = asyncHandler(async (req, res) => {
  const { filter, sort, skip, limit, page } = buildTaskQuery(req.query)

  // Scope to the authenticated user's tasks (created by OR assigned to)
  filter.$or = [
    { createdBy: req.user._id },
    { assignedTo: req.user._id },
  ]

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'fullname email avatar')
      .populate('assignedTo', 'fullname email avatar')
      .lean({ virtuals: true }),
    Task.countDocuments(filter),
  ])

  const totalPages = Math.ceil(total / limit)

  sendPaginated(
    res,
    tasks,
    { total, page, limit, totalPages, hasNext: page < totalPages },
    'Tasks fetched successfully.'
  )
})

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('createdBy', 'fullname email avatar')
    .populate('assignedTo', 'fullname email avatar')
    .lean({ virtuals: true })

  if (!task) throw new ApiError('Task not found.', 404)

  // Ensure user has access
  const userId = req.user._id.toString()
  const hasAccess =
    task.createdBy._id.toString() === userId ||
    task.assignedTo?._id?.toString() === userId ||
    req.user.role === 'admin'

  if (!hasAccess) throw new ApiError('Access denied.', 403)

  sendSuccess(res, { task }, 'Task fetched successfully.')
})

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
export const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id)
  if (!task) throw new ApiError('Task not found.', 404)

  // Only creator or admin can update
  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError('Not authorized to update this task.', 403)
  }

  const allowedUpdates = [
    'title', 'description', 'status', 'priority',
    'dueDate', 'assignedTo', 'tags', 'progress',
  ]
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field]
  })

  await task.save()
  await task.populate([
    { path: 'createdBy', select: 'fullname email avatar' },
    { path: 'assignedTo', select: 'fullname email avatar' },
  ])

  emit(req, SOCKET_EVENTS.TASK_UPDATED, { task })

  sendSuccess(res, { task }, 'Task updated successfully.')
})

// ── PATCH /api/tasks/:id/status ───────────────────────────────────────────────
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const task = await Task.findById(req.params.id)
  if (!task) throw new ApiError('Task not found.', 404)

  task.status = status
  await task.save()

  emit(req, SOCKET_EVENTS.TASK_UPDATED, { task: { _id: task._id, status: task.status } })
  sendSuccess(res, { task }, 'Task status updated.')
})

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) throw new ApiError('Task not found.', 404)

  if (
    task.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new ApiError('Not authorized to delete this task.', 403)
  }

  await task.deleteOne()

  emit(req, SOCKET_EVENTS.TASK_DELETED, { taskId: req.params.id })

  sendSuccess(res, {}, 'Task deleted successfully.')
})
