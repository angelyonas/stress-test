const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const asyncHandler = require('express-async-handler')
const { Healthy, HealthyTypes } = require('healthy-heb')
const {
  rabbit,
  rest,
  postgresConCatalog,
  postgresConCustomer01,
  postgresConCustomer02,
  postgresConCitus
} = require('../config')
const logger = require('./logger')
const server = express()

server.use(morgan(
  ':http-version :remote-addr :status :method :url :user-agent :response-time',
  { stream: logger.stream }
))

server.use('/healthy', asyncHandler(async (req, res) => {
  const options = {
    name: 'IMS Agent Worker',
    version: '0.1.0',
    integrations: [
      {
        type: HealthyTypes.Postgres,
        ...postgresConCatalog
      },
      {
        type: HealthyTypes.Postgres,
        ...postgresConCustomer01
      },
      {
        type: HealthyTypes.Postgres,
        ...postgresConCustomer02
      },
      {
        type: HealthyTypes.Postgres,
        ...postgresConCitus
      },
      {
        type: HealthyTypes.Rabbit,
        alias: HealthyTypes.Rabbit,
        host: rabbit.HOST,
        protocol: rabbit.PROTOCOL,
        hostname: rabbit.HOST,
        port: rabbit.PORT_SERVICE,
        username: rabbit.USER,
        password: rabbit.PASSWORD,
        vhost: rabbit.VHOST
      },
      {
        type: HealthyTypes.Web,
        alias: 'OMS',
        host: rest.URI_RESPONSE_OMS,
        headers: [{ key: 'Accept', value: 'application/json' }]
      }
    ]
  }

  const response = await Healthy(options)
  res.status(200).json({ status: 200, message: 'Healthy', data: response })
}))

server.use((req, res, next) => {
  next(createError(404))
})

server.use((err, req, res, next) => {
  const {
    name: error,
    status,
    message,
    stack
  } = err.status ? err : createError(500, err.message)

  const base = { status, error, message, stack }
  logger.error({ ...base })
  res.status(status).json({ ...base })
})

module.exports = () => {
  server.listen(rest.REST_PORT, () => {
    logger.info(`Healthy server running on the port: ${rest.REST_PORT}`)
  })
}
