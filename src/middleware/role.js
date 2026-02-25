// Require coach role for admin access. Allow admins as well.
module.exports = function requireCoach(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  if (req.user.role !== 'coach' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden: coach role required' })
  next()
}
