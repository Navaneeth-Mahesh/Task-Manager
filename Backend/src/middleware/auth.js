import { verifyToken } from '../utils/jwt.js'
import { ApiError, asyncHandler } from '../utils/ApiError.js'
import User from '../models/User.js'
import { ROLES } from '../constants/index.js'

/**
 * protect — verifies JWT from cookie or Authorization header.
 * Attaches req.user on success.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token

  // 1. Try HTTP-only cookie first
  if (req.cookies?.tf_token) {
    token = req.cookies.tf_token
  }
  // 2. Fallback: Authorization: Bearer <token>
  else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    throw new ApiError('Not authenticated. Please log in.', 401)
  }

  // Verify and decode
  const decoded = verifyToken(token)

  // Confirm user still exists
  const user = await User.findById(decoded.id).select('-password')
  if (!user) {
    throw new ApiError('User no longer exists.', 401)
  }

  req.user = user
  next()
})

/**
 * adminOnly — must be used AFTER protect.
 * Rejects anyone who isn't an admin.
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new ApiError('Admin access required.', 403))
  }
  next()
}

/**
 * optionalAuth — attaches req.user if a valid token exists,
 * but does NOT block the request if there's no token.
 * Useful for public routes that show extra data when logged in.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token
  if (req.cookies?.tf_token) token = req.cookies.tf_token
  else if (req.headers.authorization?.startsWith('Bearer '))
    token = req.headers.authorization.split(' ')[1]

  if (token) {
    try {
      const decoded = verifyToken(token)
      req.user = await User.findById(decoded.id).select('-password')
    } catch {
      // Silently continue — token is invalid but route is public
    }
  }
  next()
})
