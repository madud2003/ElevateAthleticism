const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Client', clientSchema)
