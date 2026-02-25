const express = require('express')
const router = express.Router()
const Client = require('../models/Client')

// Create client
router.post('/', async (req, res) => {
  try {
    const saved = await Client.create(req.body)
    res.json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

// List clients
router.get('/', async (req, res) => {
  try {
    const list = await Client.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router
