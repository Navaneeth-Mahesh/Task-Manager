import { PAGINATION } from '../constants/index.js'

/**
 * Build a reusable Mongoose query from express-query params.
 *
 * Supports:
 *   ?search=      full-text search on title/description/tags
 *   ?status=      filter by task status
 *   ?priority=    filter by priority
 *   ?assignedTo=  filter by assigned user id
 *   ?dueDate=     filter tasks due on or before this date (ISO string)
 *   ?overdue=true filter only overdue tasks
 *   ?sortBy=      field to sort (default: createdAt)
 *   ?order=       asc | desc (default: desc)
 *   ?page=        page number (default: 1)
 *   ?limit=       items per page (default: 10, max: 100)
 */
export const buildTaskQuery = (queryParams) => {
  const {
    search,
    status,
    priority,
    assignedTo,
    dueDate,
    overdue,
    sortBy = 'createdAt',
    order = 'desc',
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEFAULT_LIMIT,
  } = queryParams

  const filter = {}

  // Full-text search
  if (search) {
    filter.$text = { $search: search }
  }

  // Exact-match filters
  if (status) filter.status = status
  if (priority) filter.priority = priority
  if (assignedTo) filter.assignedTo = assignedTo

  // Due date filter: tasks due on or before given date
  if (dueDate) {
    filter.dueDate = { $lte: new Date(dueDate) }
  }

  // Overdue: dueDate is in the past and task not completed
  if (overdue === 'true') {
    filter.dueDate = { $lt: new Date() }
    filter.status = { $ne: 'completed' }
  }

  // Sorting
  const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title', 'status']
  const sortField = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt'
  const sortOrder = order === 'asc' ? 1 : -1

  // Priority sort needs special numeric mapping
  const sort =
    sortField === 'priority'
      ? {} // handled via aggregation if needed; default to createdAt
      : { [sortField]: sortOrder }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10))
  const limitNum = Math.min(
    Math.max(1, parseInt(limit, 10)),
    PAGINATION.MAX_LIMIT
  )
  const skip = (pageNum - 1) * limitNum

  return { filter, sort, skip, limit: limitNum, page: pageNum }
}
