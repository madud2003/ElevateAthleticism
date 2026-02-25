const mongoose = require('mongoose')

const coachSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, default: '' },
    email: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Coach', coachSchema)
