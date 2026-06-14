import mongoose from 'mongoose'

/**
 * Connect to MongoDB Atlas.
 * Exits the process on failure so the app never starts in a broken state.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_TEST_URI

    if (!mongoUri) {
      throw new Error('MONGO_URI (or MONGO_TEST_URI in tests) is not set')
    }

    const conn = await mongoose.connect(mongoUri, {
      // These are the recommended options for Mongoose 8+
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })


    console.log(`✅ MongoDB connected: ${conn.connection.host}`)

    // Handle connection events after initial connect
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message)
    })

    // Ensure initial connect actually finishes (prevents buffering forever)
    await mongoose.connection.asPromise()


    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting reconnect…')
    })

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected')
    })
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
