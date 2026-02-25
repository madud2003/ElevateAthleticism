// Do not load .env here. Hostinger / production must provide environment variables.

const express = require('express')
const cors = require('cors')
const sequelize = require('./db/connection')

const app = express()
app.use(cors())
app.use(express.json())

const TestUser = require('./models/TestUser')
const Coach = require('./models/Coach')
const Client = require('./models/Client')
const Session = require('./models/Session')
const User = require('./models/User')
const CoachProgram = require('./models/CoachProgram')

// Set associations
Session.belongsTo(Coach, { foreignKey: 'coachId', as: 'coach' })
Session.belongsTo(Client, { foreignKey: 'clientId', as: 'client' })
Coach.hasMany(Session, { foreignKey: 'coachId' })
Client.hasMany(Session, { foreignKey: 'clientId' })

// Build mongo connection string: allow MONGO_URI to be a host/credentials-only string
// and MONGODB_DB to supply the database name (useful when URI ends with a slash).
let mongoUri = process.env.MONGO_URI || ''
// Accept either MONGODB_DB or MONGO_DB (some .env files use MONGO_DB)
const mongoDb = process.env.MONGODB_DB || process.env.MONGO_DB || ''

if (!mongoUri) {
  console.error('ERROR: MONGO_URI environment variable is not set')
  process.exit(1)
}

// If a DB name was provided separately and the URI doesn't already include a path,
// append it (preserve query string if present).
if (mongoDb) {
  // If URI already contains a pathname with a db, leave it.
  const hasDbPath = /\/.+\?/.test(mongoUri) || /\/.+$/.test(mongoUri.replace(/\?.*$/, ''))
  if (!hasDbPath) {
    const [base, query] = mongoUri.split('?')
    // Ensure base does not end with a slash
    const baseNoSlash = base.endsWith('/') ? base.slice(0, -1) : base
    mongoUri = query ? `${baseNoSlash}/${mongoDb}?${query}` : `${baseNoSlash}/${mongoDb}`
  }
}

// Connect to SQL DB (Hostinger)
;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection established')
    // Create tables if they do not exist
    await sequelize.sync()
    console.log('Database synced')
  } catch (err) {
    console.error('Database connection error:', err.message || err)
    process.exit(1)
  }
})()

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend running' })
})

// Debug DB info (safe: does not return credentials)
app.get('/debug/db', (req, res) => {
  try {
    return res.json({ dialect: sequelize.getDialect(), database: sequelize.config.database, host: sequelize.config.host })
  } catch (err) {
    return res.status(500).json({ error: 'cannot read connection info' })
  }
})

// Keep original test-user endpoints for quick tests
app.post('/api/test-user', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })

    const saved = await TestUser.create({ name })
    return res.json(saved)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal error' })
  }
})

app.get('/api/test-user', async (req, res) => {
  try {
    const users = await TestUser.findAll({ order: [['createdAt', 'DESC']] })
    return res.json(users)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// Mount resource routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/coaches', require('./routes/coaches'))
app.use('/api/clients', require('./routes/clients'))
app.use('/api/sessions', require('./routes/sessions'))
// Admin-only routes
app.use('/api/admin', require('./routes/admin'))

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
