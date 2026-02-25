const { DataTypes } = require('sequelize')
const sequelize = require('../db/connection')

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    // Role for RBAC: 'coach' or 'client'. Default to 'client'.
    role: { type: DataTypes.ENUM('coach', 'client'), allowNull: false, defaultValue: 'client' },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
)

module.exports = User
