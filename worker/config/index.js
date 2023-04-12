const postgres = require('./postgres')
const {
  postgresConCatalog,
  postgresConCustomer01,
  postgresConCustomer02,
  postgresConCitus
} = require('./postgresCon')
const rabbit = require('./rabbit')
const rest = require('./rest')

module.exports = {
  postgres,
  postgresConCatalog,
  postgresConCustomer01,
  postgresConCustomer02,
  postgresConCitus,
  rabbit,
  rest
}
