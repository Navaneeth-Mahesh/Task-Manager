import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './src/app.js'
import connectDB from './src/database/connect.js'
import { initSockets } from './src/sockets/index.js'

const PORT = process.env.PORT || 4000

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const start = async () => {
  // 1. Connect to MongoDB
  await connectDB()

  // 2. Wrap Express app with HTTP server for Socket.IO
  const httpServer = createServer(app)

  // 3. Attach Socket.IO to the HTTP server
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  })

  // 4. Make `io` accessible inside Express controllers via req.app.get('io')
  app.set('io', io)

  // 5. Register socket event handlers
  initSockets(io)

  // 6. Start listening
  httpServer.listen(PORT, () => {
    console.log(`\n⚡ TaskFlow API running`)
    console.log(`   → Local:  http://localhost:${PORT}`)
    console.log(`   → Docs:   http://localhost:${PORT}/api/docs`)
    console.log(`   → Health: http://localhost:${PORT}/health`)
    console.log(`   → Env:    ${process.env.NODE_ENV}\n`)
  })

  // ── Graceful shutdown ────────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully…`)
    httpServer.close(() => {
      console.log('HTTP server closed.')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  // Handle uncaught exceptions — log and exit so the process manager restarts
  process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err)
    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled Rejection:', reason)
    process.exit(1)
  })
}

start()
