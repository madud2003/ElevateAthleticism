const express = require('express')
const router = express.Router()
const Coach = require('../models/Coach')

// Create coach
router.post('/', async (req, res) => {
  try {
    const saved = await Coach.create(req.body)
    console.log('Coach created:', { id: saved._id, name: saved.name, email: saved.email })
    res.json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

// List coaches
router.get('/', async (req, res) => {
  try {
    const list = await Coach.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router
