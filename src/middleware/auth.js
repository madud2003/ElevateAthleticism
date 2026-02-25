const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verifies Authorization: Bearer <token> and attaches user from MongoDB to req.user
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

    const userId = decoded.sub
    const user = await User.findById(userId).lean()
    if (!user) return res.status(401).json({ error: 'User not found' })

    req.user = { id: user._id, fullName: user.fullName, email: user.email, role: user.role }
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return res.status(500).json({ error: 'internal error' })
  }
}
