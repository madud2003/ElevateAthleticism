const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const Coach = sequelize.define(
  'Coach',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    specialty: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  { timestamps: false }
)

module.exports = Coach
