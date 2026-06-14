import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'

// Routes
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

// Error handling
import errorHandler, { notFound } from './middleware/errorHandler.js'

const app = express()

// ── Security headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// ── CORS — allow frontend origin with credentials ─────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`))
      }
    },
    credentials: true, // Required for cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Rate limiting ─────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Stricter for auth endpoints
  message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
})

app.use(globalLimiter)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Sanitize MongoDB query injection ─────────────────────────────────────────
app.use(mongoSanitize())

// ── Logger ────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'))
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})

// ── API Documentation ─────────────────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TaskFlow API Docs',
  })
)

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ── 404 & Error Handlers ──────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
