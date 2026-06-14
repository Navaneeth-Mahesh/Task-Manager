import { ApiError } from '../utils/ApiError.js'

/**
 * Central error handler — Express calls this when next(error) is used.
 * Must have exactly 4 params (err, req, res, next) to work as error middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err }
  error.message = err.message
  error.statusCode = err.statusCode || 500

  // ── Mongoose: CastError (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    error = new ApiError(`Resource not found with id: ${err.value}`, 404)
  }

  // ── Mongoose: Duplicate key (e.g. unique email) ───────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    error = new ApiError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
      409
    )
  }

  // ── Mongoose: Validation error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    error = new ApiError(messages.join('. '), 422)
  }

  // ── JWT errors ────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError('Invalid token. Please log in again.', 401)
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError('Session expired. Please log in again.', 401)
  }

  // ── Dev vs prod: show stack in development only ───────────────────────────
  const response = {
    success: false,
    message: error.message || 'Internal Server Error',
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
    response.error = err
  }

  // Log unexpected (non-operational) errors
  if (!err.isOperational) {
    console.error('💥 Unexpected error:', err)
  }

  res.status(error.statusCode).json(response)
}

/**
 * 404 handler — for routes that don't match any defined route.
 */
export const notFound = (req, res, next) => {
  next(new ApiError(`Route ${req.method} ${req.originalUrl} not found`, 404))
}

export default errorHandler
