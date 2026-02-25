const { Sequelize } = require('sequelize')

// Read DB config from env (recommended to set these in Hostinger project env)
const dbName = process.env.DB_NAME || process.env.HOSTINGER_DB || process.env.MYSQL_DATABASE
const dbUser = process.env.DB_USER || process.env.HOSTINGER_DB_USER || process.env.MYSQL_USER
const dbPass = process.env.DB_PASS || process.env.HOSTINGER_DB_PASS || process.env.MYSQL_PASSWORD
const dbHost = process.env.DB_HOST || process.env.HOSTINGER_DB_HOST || process.env.MYSQL_HOST
const dbPort = process.env.DB_PORT || process.env.HOSTINGER_DB_PORT || process.env.MYSQL_PORT || 3306
const dbDialect = process.env.DB_DIALECT || 'mysql'

if (!dbName || !dbUser || !dbPass || !dbHost) {
  console.error('ERROR: One or more DB_* environment variables are not set (DB_NAME/DB_USER/DB_PASS/DB_HOST)')
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: false,
})

module.exports = sequelize
