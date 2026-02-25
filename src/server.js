// Load environment variables from .env (local dev only; on Hostinger use the panel)
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config')

const app = express()
app.use(cors())
app.use(express.json())

// ─── MongoDB connection ───────────────────────────────────────────────
const mongoUri = config.mongoUri

if (!mongoUri) {
  console.error('ERROR: MONGO_URI environment variable is not set')
  process.exit(1)
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message || err)
    process.exit(1)
  })

// ─── Health check ─────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend running' })
})

// ─── Routes ───────────────────────────────────────────────────────────
app.use('/api', require('./routes'))              // sample route (GET /api/sample)
app.use('/api/auth', require('./routes/auth'))
// Mount admin routes (coach-only)
app.use('/api/admin', require('./routes/admin'))
// Public exercises routes
app.use('/api/exercises', require('./routes/exercises'))
// User-specific routes (progress, etc.)
app.use('/api/user', require('./routes/user'))

// ─── Start server ─────────────────────────────────────────────────────
const port = config.port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

