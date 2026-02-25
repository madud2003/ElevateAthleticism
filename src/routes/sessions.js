const express = require('express')
const router = express.Router()
const Session = require('../models/Session')

// Create session
router.post('/', async (req, res) => {
  try {
    const payload = {
      coachId: req.body.coachId || req.body.coach,
      clientId: req.body.clientId || req.body.client,
      scheduledAt: req.body.scheduledAt,
      notes: req.body.notes,
    }
    const saved = await Session.create(payload)
    res.json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

// List sessions (populate coach and client)
router.get('/', async (req, res) => {
  try {
    const list = await Session.find()
      .populate('coachId', 'name specialty')
      .populate('clientId', 'name')
      .sort({ scheduledAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router
