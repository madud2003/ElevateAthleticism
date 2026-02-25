const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const Client = sequelize.define(
  'Client',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  { timestamps: false }
)

module.exports = Client
