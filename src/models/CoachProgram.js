const mongoose = require('mongoose')

const coachProgramSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    program: { type: String },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
    programTitle: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

module.exports = mongoose.model('CoachProgram', coachProgramSchema)
