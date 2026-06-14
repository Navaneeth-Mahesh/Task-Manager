import jwt from 'jsonwebtoken'
import { ApiError } from './ApiError.js'

/**
 * Sign a JWT access token for the given user id.
 */
export const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

/**
 * Verify a JWT and return the decoded payload.
 * Throws ApiError on failure so it integrates with our error handler.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError('Session expired. Please log in again.', 401)
    }
    throw new ApiError('Invalid token. Please log in again.', 401)
  }
}

/**
 * Attach the JWT as an HTTP-only cookie and return the token string.
 */
export const sendTokenCookie = (res, userId) => {
  const token = signToken(userId)

  const cookieOptions = {
    httpOnly: true,                             // not accessible via JS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: Number(process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000,
  }

  res.cookie('tf_token', token, cookieOptions)
  return token
}

/**
 * Clear the auth cookie on logout.
 */
export const clearTokenCookie = (res) => {
  res.cookie('tf_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    expires: new Date(0),
  })
}
