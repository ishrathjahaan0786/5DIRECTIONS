import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// API Routes
app.use('/api', apiRoutes)

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: '5Directions Supply Chain Resilience Platform API',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: {
      auth: '/api/auth',
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
