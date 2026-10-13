import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

let isConnected = false

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn('\n⚠️ [5Directions DB] MONGODB_URI is not defined in environment variables.')
    console.warn('⚠️ [5Directions DB] Operating in hybrid resilient mode. Set MONGODB_URI in Render/local .env to connect to MongoDB Atlas.\n')
    return false
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
    isConnected = true
    console.log(`\n✅ [5Directions DB] Connected to MongoDB Atlas: ${conn.connection.host} (${conn.connection.name})\n`)
    return true
  } catch (error) {
    console.error(`\n❌ [5Directions DB] MongoDB Atlas connection error: ${error.message}`)
    console.warn('⚠️ [5Directions DB] Server will remain online. Check Atlas IP Whitelist (0.0.0.0/0) & credentials.\n')
    isConnected = false
    return false
  }
}

export const getDbStatus = () => ({
  connected: isConnected && mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null
})

export default connectDB
