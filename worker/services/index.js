const postgres = require('./postgres')
const rabbit = require('./rabbit')
const logger = require('./logger')
const rest = require('./rest')

module.exports = {
  postgres,
  rabbit,
  logger,
  rest
}
