/**
 * Custom API error that carries an HTTP status code.
 * Thrown from controllers/services and caught by the global error middleware.
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 500 ? 'error' : 'fail'
    this.isOperational = true // distinguishes our errors from unexpected ones
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Wraps an async route handler so we never need try/catch in every controller.
 * Usage: router.get('/route', asyncHandler(myController))
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/**
 * Send a consistent success response.
 */
export const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

/**
 * Send a consistent paginated response.
 */
export const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  })
}
