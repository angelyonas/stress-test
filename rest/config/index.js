require('dotenv').config()
const globals = require('./globals')
const rabbit = require('./rabbit')
const rest = require('./rest')

module.exports = {
  globals,
  rabbit,
  rest
}
