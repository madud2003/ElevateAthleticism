const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const UserProgramProgress = require('../models/UserProgramProgress')

// GET /api/user/program-progress - get current user's progress
router.get('/program-progress', auth, async (req, res) => {
  try {
    const doc = await UserProgramProgress.findOne({ userId: req.user.id }).lean()
    if (!doc) return res.json({ progress: [] })
    return res.json({ progress: doc.progress || [] })
  } catch (err) {
    console.error('Get program-progress error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// POST /api/user/program-progress - upsert a progress entry
// body: { programId, day, exerciseId, weights: [Number] }
router.post('/program-progress', auth, async (req, res) => {
  try {
    const { programId, day, exerciseId, weights } = req.body
    if (!exerciseId) return res.status(400).json({ error: 'exerciseId is required' })
    // find or create doc for user
    let doc = await UserProgramProgress.findOne({ userId: req.user.id })
    if (!doc) {
      doc = await UserProgramProgress.create({ userId: req.user.id, programId: programId || null, progress: [] })
    }

    // find existing entry
    const idx = (doc.progress || []).findIndex((p) => String(p.exerciseId) === String(exerciseId) && (p.day || '') === (day || '') && String(p.programId || '') === String(programId || ''))
    const now = new Date()
    const cleanedWeights = Array.isArray(weights) ? weights.map((w) => (isNaN(Number(w)) ? w : Number(w))) : []

    if (idx >= 0) {
      doc.progress[idx].weights = cleanedWeights
      doc.progress[idx].updatedAt = now
    } else {
      doc.progress.push({ programId: programId || null, day: day || '', exerciseId, weights: cleanedWeights, updatedAt: now })
    }

    await doc.save()
    return res.json({ message: 'progress saved', entry: doc.progress.find((p) => String(p.exerciseId) === String(exerciseId) && (p.day || '') === (day || '') ) })
  } catch (err) {
    console.error('Save program-progress error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router
