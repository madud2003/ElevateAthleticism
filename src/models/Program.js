const mongoose = require('mongoose')

const programSchema = new mongoose.Schema(
  {
    coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    clientEmail: { type: String },
    title: { type: String, required: true },
    notes: { type: String },
    exercises: [
      {
        id: { type: String },
        name: { type: String },
        sets: { type: Number },
        reps: { type: Number },
        weights: { type: [Number], default: [] },
      },
    ],
    schedule: [
      {
        day: { type: String },
        exercises: [
          {
            id: { type: String },
            name: { type: String },
            sets: { type: Number },
            reps: { type: Number },
            weights: { type: [Number], default: [] },
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Program', programSchema)
