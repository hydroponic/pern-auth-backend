const { config } = require('dotenv')
config()

module.exports = {
  PORT: 8000,
  SERVER_URL: "localhost:8000",
  CLIENT_URL: "http://localhost:3000",
  SECRET: "secret",
}
