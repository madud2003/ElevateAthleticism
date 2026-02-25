const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Role for RBAC: 'coach' or 'client'. Default to 'client'.
    role: { type: String, enum: ['coach', 'client'], default: 'client' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
