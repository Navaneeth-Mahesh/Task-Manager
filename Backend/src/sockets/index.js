import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.js'
import { SOCKET_EVENTS } from '../constants/index.js'

/**
 * Initialize Socket.IO handlers.
 * Called from server.js after the HTTP server is created.
 *
 * @param {import('socket.io').Server} io
 */
export const initSockets = (io) => {
  // ── Auth middleware for socket connections ──────────────────────────────────
  io.use(async (socket, next) => {
    try {
      // Token can come from auth header or query param (for browser clients)
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1] ||
        socket.handshake.query?.token

      if (!token) {
        // Allow unauthenticated connections for public events
        socket.user = null
        return next()
      }

      const decoded = verifyToken(token)
      const user = await User.findById(decoded.id).select('fullname email role')
      socket.user = user
      next()
    } catch {
      socket.user = null
      next() // Don't block connection — just mark as unauthenticated
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.user?._id?.toString()

    if (userId) {
      // Join a personal room so we can send user-specific events
      socket.join(`user:${userId}`)
      console.log(`🔌 Socket connected: ${socket.user.fullname} (${socket.id})`)

      // Broadcast online status to everyone
      socket.broadcast.emit(SOCKET_EVENTS.USER_ONLINE, {
        userId,
        fullname: socket.user.fullname,
      })
    }

    // ── Client joins a workspace / project room ─────────────────────────────
    socket.on('join:room', (roomId) => {
      socket.join(roomId)
      console.log(`📂 ${socket.user?.fullname || 'Guest'} joined room: ${roomId}`)
    })

    socket.on('leave:room', (roomId) => {
      socket.leave(roomId)
    })

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      if (userId) {
        console.log(`🔌 Socket disconnected: ${socket.user?.fullname} (${socket.id})`)
        io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId })
      }
    })
  })
}

/**
 * Helper: emit a notification to a specific user's room.
 *
 * @param {import('socket.io').Server} io
 * @param {string} userId
 * @param {Object} payload - { title, message, type }
 */
export const notifyUser = (io, userId, payload) => {
  io.to(`user:${userId}`).emit(SOCKET_EVENTS.NOTIFICATION, payload)
}
