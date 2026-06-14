import crypto from 'crypto'
import User from '../models/User.js'
import { ApiError, asyncHandler, sendSuccess } from '../utils/ApiError.js'
import { sendTokenCookie, clearTokenCookie, signToken } from '../utils/jwt.js'
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/emailService.js'

// ── POST /api/auth/register ───────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body

  // Check duplicate email
  const existing = await User.findOne({ email })
  if (existing) throw new ApiError('Email is already registered.', 409)

  // Create user (password is hashed by pre-save hook)
  const user = await User.create({ fullname, email, password })

  // Send welcome email (non-blocking — don't fail registration if email fails)
  sendWelcomeEmail(user).catch((err) =>
    console.error('Welcome email failed:', err.message)
  )

  const token = sendTokenCookie(res, user._id)

  sendSuccess(
    res,
    {
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        initials: user.initials,
      },
    },
    'Account created successfully.',
    201
  )
})

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Explicitly select password since it's select:false on the schema
  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Invalid email or password.', 401)
  }

  // Update last login
  user.lastLogin = new Date()
  await user.save({ validateBeforeSave: false })

  const token = sendTokenCookie(res, user._id)

  sendSuccess(res, {
    token,
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      initials: user.initials,
    },
  }, 'Logged in successfully.')
})

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res)
  sendSuccess(res, {}, 'Logged out successfully.')
})

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  // req.user is already attached by protect middleware
  const user = await User.findById(req.user._id)
  sendSuccess(res, { user }, 'User fetched successfully.')
})

// ── PATCH /api/auth/me ────────────────────────────────────────────────────────
export const updateMe = asyncHandler(async (req, res) => {
  const allowedFields = ['fullname', 'avatar']
  const updates = {}
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f]
  })

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  })
  sendSuccess(res, { user }, 'Profile updated successfully.')
})

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  // Always respond with 200 to prevent user enumeration
  if (!user) {
    return sendSuccess(res, {}, 'If that email exists, a reset link has been sent.')
  }

  const rawToken = user.generateResetToken()
  await user.save({ validateBeforeSave: false })

  try {
    await sendPasswordResetEmail(user, rawToken)
    sendSuccess(res, {}, 'Password reset email sent.')
  } catch (err) {
    // Rollback token if email fails
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })
    throw new ApiError('Email could not be sent. Try again later.', 500)
  }
})

// ── POST /api/auth/reset-password/:token ─────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  // Hash the raw token from the URL to compare with stored hash
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) throw new ApiError('Reset token is invalid or has expired.', 400)

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  const token = sendTokenCookie(res, user._id)
  sendSuccess(res, { token }, 'Password reset successful.')
})
