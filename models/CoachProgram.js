const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

// Tracks programs a coach has created for specific users (clients)
const CoachProgram = sequelize.define(
  'CoachProgram',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    coachId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    program: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
)

module.exports = CoachProgram
