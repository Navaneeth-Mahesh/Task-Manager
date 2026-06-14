import 'dotenv/config'
import { createServer } from 'http'
import { Server } from 'socket.io'
import app from './src/app.js'
import connectDB from './src/database/connect.js'
import { initSockets } from './src/sockets/index.js'

const PORT = process.env.PORT || 4000

// ── Bootstrap ────────────────────────────────────────────────────────────────
const start = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB()
    console.log('✅ MongoDB connected')

    // 2. Create HTTP server
    const httpServer = createServer(app)

    // 3. Socket.IO setup (production safe)
    const io = new Server(httpServer, {
      cors: {
        origin: '*', // safe for deployment + avoids CORS socket issues
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    })

    // 4. Inject io into app
    app.set('io', io)

    // 5. Init socket handlers
    initSockets(io)

    // 6. Start server
    httpServer.listen(PORT, () => {
      console.log(`\n⚡ TaskFlow API running`)
      console.log(`   → Port:   ${PORT}`)
      console.log(`   → Health: /health`)
      console.log(`   → Docs:   /api/docs`)
      console.log(`   → Env:    ${process.env.NODE_ENV || 'development'}\n`)
    })

    // ── Graceful shutdown ────────────────────────────────────────────────
    const shutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`)
      httpServer.close(() => {
        console.log('HTTP server closed.')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

    // ── Crash safety ──────────────────────────────────────────────────────
    process.on('uncaughtException', (err) => {
      console.error('💥 Uncaught Exception:', err)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason) => {
      console.error('💥 Unhandled Rejection:', reason)
      process.exit(1)
    })

  } catch (err) {
    console.error('💥 Server failed to start:', err)
    process.exit(1)
  }
}

start()