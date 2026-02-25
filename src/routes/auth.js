const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/User')

// Note: ensure JWT_SECRET is set in environment (Hostinger panel)

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email, and password are required' })
    }

    // Check if email already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user (role defaults to 'client' unless set directly in DB)
    const user = await User.create({ fullName, email, password: hashedPassword })

    // Issue token if secret is available
    const token = process.env.JWT_SECRET ? jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }) : null

    return res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
      createdAt: user.createdAt,
    })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = process.env.JWT_SECRET ? jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' }) : null

    return res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token,
      createdAt: user.createdAt,
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
