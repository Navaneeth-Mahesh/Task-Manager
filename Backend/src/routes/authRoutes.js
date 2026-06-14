import { Router } from 'express'
import {
  register,
  login,
  logout,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from '../validators/index.js'

const router = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', registerValidator, register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 */
router.post('/login', loginValidator, login)

router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.patch('/me', protect, updateMe)

router.post('/forgot-password', forgotPasswordValidator, forgotPassword)
router.post('/reset-password/:token', resetPasswordValidator, resetPassword)

export default router
