const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const requireCoach = require('../middleware/role')
const User = require('../models/User')
const CoachProgram = require('../models/CoachProgram')
const Program = require('../models/Program')
const Exercise = require('../models/Exercise')
const UserProgramProgress = require('../models/UserProgramProgress')

// helper: sanitize exercises array coming from frontend
function sanitizeExercises(exs) {
  if (!Array.isArray(exs)) return []
  return exs.map((e) => {
    const id = e.id || e._id || (typeof e === 'string' ? e : undefined)
    const name = e.name || ''
    const sets = e.sets === undefined || e.sets === null || e.sets === '' ? undefined : Number(e.sets)
    const reps = e.reps === undefined || e.reps === null || e.reps === '' ? undefined : Number(e.reps)
    let weights = []
    if (Array.isArray(e.weights)) {
      weights = e.weights.map((w) => (isNaN(Number(w)) ? w : Number(w))).filter((v) => v !== null && v !== undefined)
    } else if (typeof e.weights === 'string') {
      weights = e.weights
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((w) => (isNaN(Number(w)) ? w : Number(w)))
    } else if (e.weight !== undefined) {
      // support legacy single 'weight' field
      const maybe = isNaN(Number(e.weight)) ? e.weight : Number(e.weight)
      weights = maybe === undefined || maybe === null || maybe === '' ? [] : [maybe]
    }
    return { id, name, sets, reps, weights }
  })
}

function sanitizeSchedule(sched) {
  if (!Array.isArray(sched)) return []
  return sched.map((s) => ({
    day: s.day || '',
    exercises: sanitizeExercises(Array.isArray(s.exercises) ? s.exercises : []),
  }))
}

// GET /api/admin/verify - simple check for coach access
router.get('/verify', auth, requireCoach, (req, res) => {
  return res.json({ ok: true, user: req.user })
})

// GET /api/admin - root info (avoid empty 404)
router.get('/', auth, requireCoach, (req, res) => {
  return res.json({ ok: true, message: 'Admin API root - coach access verified' })
})

// GET /api/admin/users - list users (example admin API)
router.get('/users', auth, requireCoach, async (req, res) => {
  try {
    const list = await User.find().select('fullName email role createdAt').sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) {
    console.error('Admin users error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// GET /api/admin/search-user?q=... — search by name or email (partial)
router.get('/search-user', auth, requireCoach, async (req, res) => {
  try {
    const { q } = req.query
    if (!q || !q.trim()) return res.status(400).json({ error: 'q query param is required' })
    const term = q.trim()
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    const users = await User.find({ $or: [{ email: regex }, { fullName: regex }] })
      .select('fullName email role createdAt')
      .limit(10)
      .lean()
    if (!users.length) return res.status(404).json({ error: 'No users found matching that name or email' })
    return res.json(users)
  } catch (err) {
    console.error('Admin search error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// POST /api/admin/assign-program — assign a program to a user
router.post('/assign-program', auth, requireCoach, async (req, res) => {
  try {
    const { userId, program } = req.body
    if (!userId || !program) return res.status(400).json({ error: 'userId and program are required' })
    const user = await User.findById(userId).select('fullName email role')
    if (!user) return res.status(404).json({ error: 'User not found' })

    // If program is an object (contains title/schedule), create a Program doc and reference it
    let programId = null
    let programTitle = null
    if (typeof program === 'object' && program !== null) {
      // sanitize incoming program (support schedule or exercises)
      const programData = Object.assign({}, program)
      if (programData.schedule) programData.schedule = sanitizeSchedule(programData.schedule)
      else programData.exercises = sanitizeExercises(program.exercises || [])
      const created = await Program.create(Object.assign(programData, { coachId: req.user.id, clientEmail: user.email }))
      programId = created._id
      programTitle = created.title
    } else if (typeof program === 'string') {
      // If frontend sent a plain program title, try to resolve it to an existing Program
      programTitle = program
      try {
        const existing = await Program.findOne({ coachId: req.user.id, title: programTitle }).lean()
        if (existing) {
          programId = existing._id
          programTitle = existing.title
        }
      } catch (e) {
        console.warn('Program title lookup failed:', e && e.message)
      }
    }

    const entry = await CoachProgram.create({ coachId: req.user.id, userId, program: programTitle || '', programId, programTitle })
    return res.status(201).json({ message: `Program assigned to ${user.fullName}`, entry })
  } catch (err) {
    console.error('Assign program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// PUT /api/admin/assign-program - update program for a user (coach/admin)
router.put('/assign-program', auth, requireCoach, async (req, res) => {
  try {
    const { userId, program } = req.body
    if (!userId || !program) return res.status(400).json({ error: 'userId and program are required' })
    const user = await User.findById(userId).select('fullName email role')
    if (!user) return res.status(404).json({ error: 'User not found' })

    const updated = await CoachProgram.findOneAndUpdate(
      { coachId: req.user.id, userId },
      { $set: { program } },
      { new: true, upsert: true }
    ).lean()

    return res.json({ message: `Program updated for ${user.fullName}`, entry: updated })
  } catch (err) {
    console.error('Update program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// DELETE /api/admin/assign-program/:userId - remove program assignment for a user (for this coach)
router.delete('/assign-program/:userId', auth, requireCoach, async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    const removed = await CoachProgram.findOneAndDelete({ coachId: req.user.id, userId }).lean()
    if (!removed) return res.status(404).json({ error: 'No program assignment found for that user' })
    return res.json({ message: 'Program assignment removed' })
  } catch (err) {
    console.error('Remove program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// GET /api/admin/my-clients — users who have programs from this coach
router.get('/my-clients', auth, requireCoach, async (req, res) => {
  try {
    const programs = await CoachProgram.find({ coachId: req.user.id }).sort({ createdAt: -1 }).lean()
    if (!programs.length) return res.json([])
    const userIds = [...new Set(programs.map((p) => String(p.userId)))]
    const users = await User.find({ _id: { $in: userIds } }).select('fullName email role createdAt').lean()
    const result = users.map((u) => {
      const latest = programs.find((p) => String(p.userId) === String(u._id))
      // If the assignment references a Program doc, include a programId and programTitle
      return { ...u, program: latest ? latest.program : null, programId: latest ? latest.programId : null, programTitle: latest ? latest.programTitle : null, programCreatedAt: latest ? latest.createdAt : null }
    })
    return res.json(result)
  } catch (err) {
    console.error('My clients error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// GET /api/admin/programs - list programs created by the authenticated coach
router.get('/programs', auth, requireCoach, async (req, res) => {
  try {
    const list = await Program.find({ coachId: req.user.id }).sort({ createdAt: -1 }).lean()
    return res.json(list)
  } catch (err) {
    console.error('List programs error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// GET /api/admin/programs/:id - get a single program (coach/admin)
router.get('/programs/:id', auth, requireCoach, async (req, res) => {
  try {
    const prog = await Program.findById(req.params.id).lean()
    if (!prog) return res.status(404).json({ error: 'Program not found' })
    return res.json(prog)
  } catch (err) {
    console.error('Get program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// POST /api/admin/programs - create a program (coach/admin)
router.post('/programs', auth, requireCoach, async (req, res) => {
  try {
    const { title, notes, exercises, schedule, clientEmail } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const created = await Program.create({ coachId: req.user.id, title, notes, exercises: sanitizeExercises(exercises || []), schedule: sanitizeSchedule(schedule || []), clientEmail })
    return res.status(201).json(created)
  } catch (err) {
    console.error('Create program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// DELETE /api/admin/programs/:id - delete a program
router.delete('/programs/:id', auth, requireCoach, async (req, res) => {
  try {
    const deleted = await Program.findByIdAndDelete(req.params.id).lean()
    if (!deleted) return res.status(404).json({ error: 'Program not found' })
    // Also remove references from CoachProgram
    await CoachProgram.updateMany({ programId: req.params.id }, { $unset: { programId: 1, programTitle: 1, program: '' } })
    return res.json({ message: 'Program deleted' })
  } catch (err) {
    console.error('Delete program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// GET /api/admin/my-program - the latest program assigned to the authenticated user
// This endpoint is available to any authenticated user (coach/admin/users) to see their own program
router.get('/my-program', auth, async (req, res) => {
  try {
    const prog = await CoachProgram.findOne({ userId: req.user.id }).sort({ createdAt: -1 }).lean()
    if (!prog) return res.json({ program: null })
    if (prog.programId) {
      const full = await Program.findById(prog.programId).lean()
      return res.json({ program: full, coachId: prog.coachId, createdAt: prog.createdAt })
    }
    return res.json({ program: { title: prog.program }, coachId: prog.coachId, createdAt: prog.createdAt })
  } catch (err) {
    console.error('My program error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// Admin exercise management (create/update/delete)
// POST /api/admin/exercises - create
router.post('/exercises', auth, requireCoach, async (req, res) => {
  try {
    const { id, name, description, youtube } = req.body
    if (!id || !name) return res.status(400).json({ error: 'id and name are required' })
    // Prevent overwriting existing
    const existing = await Exercise.findOne({ id })
    if (existing) return res.status(409).json({ error: 'Exercise with this id already exists' })
    const created = await Exercise.create({ id, name, description, youtube })
    return res.status(201).json(created)
  } catch (err) {
    console.error('Create exercise error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// PUT /api/admin/exercises/:id - update
router.put('/exercises/:id', auth, requireCoach, async (req, res) => {
  try {
    const { name, description, youtube } = req.body
    const updated = await Exercise.findOneAndUpdate(
      { id: req.params.id },
      { $set: { name, description, youtube } },
      { new: true }
    ).lean()
    if (!updated) return res.status(404).json({ error: 'Exercise not found' })
    return res.json(updated)
  } catch (err) {
    console.error('Update exercise error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// DELETE /api/admin/exercises/:id - delete
router.delete('/exercises/:id', auth, requireCoach, async (req, res) => {
  try {
    const deleted = await Exercise.findOneAndDelete({ id: req.params.id }).lean()
    if (!deleted) return res.status(404).json({ error: 'Exercise not found' })
    return res.json({ message: 'Exercise deleted' })
  } catch (err) {
    console.error('Delete exercise error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

// DELETE /api/admin/user/:id - delete a user (admin/coach access)
router.delete('/user/:id', auth, requireCoach, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).lean()
    if (!deleted) return res.status(404).json({ error: 'User not found' })
    // Also remove any coach programs for that user
    await CoachProgram.deleteMany({ userId: req.params.id })
    return res.json({ message: 'User deleted' })
  } catch (err) {
    console.error('Delete user error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

module.exports = router

// GET /api/admin/user-progress/:userId - coach can view a user's saved program progress
router.get('/user-progress/:userId', auth, requireCoach, async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) return res.status(400).json({ error: 'userId is required' })
    // ensure this coach has an assignment for that user
    const assignment = await CoachProgram.findOne({ coachId: req.user.id, userId }).lean()
    if (!assignment) return res.status(403).json({ error: 'No access to that user' })

    const doc = await UserProgramProgress.findOne({ userId }).lean()
    if (!doc || !Array.isArray(doc.progress)) return res.json({ progress: [] })

    // fetch program titles for any programIds referenced
    const programIds = Array.from(new Set(doc.progress.filter(p => p.programId).map(p => String(p.programId))))
    const titles = {}
    if (programIds.length) {
      const progs = await Program.find({ _id: { $in: programIds } }).select('title').lean()
      progs.forEach((p) => { titles[String(p._id)] = p.title })
    }

    const results = (doc.progress || []).map((p) => ({
      programId: p.programId || null,
      programTitle: p.programId ? (titles[String(p.programId)] || null) : null,
      day: p.day || '',
      exerciseId: p.exerciseId,
      weights: p.weights || [],
      updatedAt: p.updatedAt || p.updatedAt,
    }))

    return res.json({ progress: results })
  } catch (err) {
    console.error('User progress (admin) error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
})

