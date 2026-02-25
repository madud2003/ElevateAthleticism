const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const Session = sequelize.define(
  'Session',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    coachId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    scheduledAt: { type: DataTypes.DATE, allowNull: false },
    notes: { type: DataTypes.TEXT },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  { timestamps: false }
)

module.exports = Session
