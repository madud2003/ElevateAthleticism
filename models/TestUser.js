const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const TestUser = sequelize.define(
  'TestUser',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  { timestamps: false }
)

module.exports = TestUser
