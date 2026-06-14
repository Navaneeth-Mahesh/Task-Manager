import { validationResult, body, param } from 'express-validator'
import { ApiError } from '../utils/ApiError.js'
import { TASK_STATUS, TASK_PRIORITY } from '../constants/index.js'

/**
 * Run after validator chains — collects errors and throws ApiError if any.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg)
    return next(new ApiError(messages.join('. '), 422))
  }
  next()
}

// ── Auth validators ───────────────────────────────────────────────────────────

export const registerValidator = [
  body('fullname')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),

  validate,
]

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),

  validate,
]

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  validate,
]

export const resetPasswordValidator = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number'),

  validate,
]

// ── Task validators ───────────────────────────────────────────────────────────

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be 2–200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`),

  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date')
    .toDate(),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('assignedTo must be a valid user ID'),

  body('tags')
    .optional()
    .isArray({ max: 10 }).withMessage('Tags must be an array with max 10 items'),

  validate,
]

export const updateTaskValidator = [
  param('id')
    .isMongoId().withMessage('Invalid task ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Title must be 2–200 characters'),

  body('status')
    .optional()
    .isIn(Object.values(TASK_STATUS))
    .withMessage(`Invalid status value`),

  body('priority')
    .optional()
    .isIn(Object.values(TASK_PRIORITY))
    .withMessage('Invalid priority value'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date')
    .toDate(),

  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Progress must be 0–100'),

  validate,
]

export const mongoIdValidator = (paramName = 'id') => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  validate,
]
