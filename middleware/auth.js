const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verifies Authorization: Bearer <token>
// Attaches full user object (from DB) to req.user
module.exports = async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid Authorization header' })

    const token = auth.split(' ')[1]
    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Server JWT secret not configured' })

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Token contains subject (user id). Load authoritative user record from DB.
    const userId = decoded.sub
    const user = await User.findByPk(userId)
    if (!user) return res.status(401).json({ error: 'User not found' })

    // Attach user (do NOT trust any role from token)
    req.user = { id: user.id, fullName: user.fullName, email: user.email, role: user.role }
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
