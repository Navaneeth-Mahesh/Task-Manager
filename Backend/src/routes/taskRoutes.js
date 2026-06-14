import { Router } from 'express'
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js'
import { protect } from '../middleware/auth.js'
import {
  createTaskValidator,
  updateTaskValidator,
  mongoIdValidator,
} from '../validators/index.js'
import { body } from 'express-validator'
import { validate } from '../validators/index.js'
import { TASK_STATUS } from '../constants/index.js'

const router = Router()

// All task routes require authentication
router.use(protect)

router
  .route('/')
  .get(getTasks)
  .post(
    (req, res, next) => {
      // Ensure optional fields are either valid values or omitted.
      // Frontend sends: dueDate as ISO date string (or ''), assignedTo as user id (or '').
      if (req.body.dueDate === '' || req.body.dueDate === null) req.body.dueDate = undefined
      if (req.body.assignedTo === '' || req.body.assignedTo === null) req.body.assignedTo = undefined

      next()
    },
    createTaskValidator,
    createTask
  )


router
  .route('/:id')
  .get(mongoIdValidator('id'), getTask)
  .put(updateTaskValidator, updateTask)
  .delete(mongoIdValidator('id'), deleteTask)

// Quick status update (for Kanban drag-drop)
router.patch(
  '/:id/status',
  [
    ...mongoIdValidator('id'),
    body('status')
      .notEmpty().withMessage('Status is required')
      .isIn(Object.values(TASK_STATUS)).withMessage('Invalid status'),
    validate,
  ],
  updateTaskStatus
)

export default router
