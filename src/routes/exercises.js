const express = require('express')
const router = express.Router()
const Exercise = require('../models/Exercise')

// GET /api/exercises - list all exercises
router.get('/', async (req, res) => {
  try {
    const list = await Exercise.find().sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) {
    console.error('Exercises list error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// GET /api/exercises/:id - get exercise by `id` field
router.get('/:id', async (req, res) => {
  try {
    const ex = await Exercise.findOne({ id: req.params.id }).lean()
    if (!ex) return res.status(404).json({ error: 'Exercise not found' })
    return res.json(ex)
  } catch (err) {
    console.error('Exercise get error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router
