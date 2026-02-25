const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    scheduledAt: { type: Date, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Session', sessionSchema)
