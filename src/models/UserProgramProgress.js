const mongoose = require('mongoose')

const userProgramProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    // progress entries keyed by program/day/exercise
    progress: [
      {
        programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
        day: { type: String },
        exerciseId: { type: String },
        weights: { type: [Number], default: [] },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserProgramProgress', userProgramProgressSchema)
