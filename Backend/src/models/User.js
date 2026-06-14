import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { ROLES } from '../constants/index.js'

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries
    },

    avatar: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Track last login
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ── Pre-save: hash password ───────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash if password was modified
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Instance method: compare passwords ───────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// ── Instance method: generate password reset token ───────────────────────────
userSchema.methods.generateResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex')
  // Hash before saving to DB
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(rawToken)
    .digest('hex')
  this.resetPasswordExpire = Date.now() + Number(process.env.RESET_TOKEN_EXPIRE || 3600000)
  return rawToken // Return raw token to send in email
}

// ── Virtual: initials (for avatar fallback) ───────────────────────────────────
userSchema.virtual('initials').get(function () {
  return this.fullname
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const User = mongoose.model('User', userSchema)
export default User
