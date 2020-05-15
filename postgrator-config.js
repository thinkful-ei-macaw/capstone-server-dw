require('dotenv').config()

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
     ? 'postgresql://dunder_mifflin:password@localhost/flash-test'
    : process.env.DATABASE_URL,
    "ssl":!!process.env.SSL,
  }