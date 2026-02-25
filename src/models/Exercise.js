const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

module.exports = mongoose.model('Exercise', exerciseSchema)
