import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import helmet from 'helmet'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { connectDB, getDbStatus } from './config/db.js'

dotenv.config()

// Connect to MongoDB Atlas (asynchronous, non-blocking fallback)
connectDB()

const app = express()

// Trust reverse proxy (Render, Vercel)
app.set('trust proxy', 1)

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server) or matching origin or vercel previews
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(null, true) // permissive for hackathon demo while preserving credentials
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Session Store configuration
const sessionSecret = process.env.SESSION_SECRET || '5directions_secure_session_secret_2026'
const isProduction = process.env.NODE_ENV === 'production'

let sessionStore
if (process.env.MONGODB_URI) {
  try {
    sessionStore = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days
      autoRemove: 'native'
    })
    console.log('✅ [5Directions Auth] Session store connected to MongoDB Atlas')
  } catch (err) {
    console.warn('⚠️ [5Directions Auth] MongoStore fallback to MemoryStore:', err.message)
  }
}

app.use(session({
  name: '5directions.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}))

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // generous for hackathon testing
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// API Routes
app.use('/api', apiRoutes)

// Root welcome & platform health
app.get('/', (req, res) => {
  res.json({
    name: '5Directions Agentic Supply Chain Resilience Platform API',
    version: '2.0.0',
    documentation: '/api/health',
    database: getDbStatus(),
    endpoints: {
      auth: '/api/auth',
      agent: '/api/agent',
      materials: '/api/materials',
      suppliers: '/api/suppliers',
      orders: '/api/orders',
      disruptions: '/api/disruptions'
    }
  })
})

// Error handling
app.use(notFound)
app.use(errorHandler)

export default app
