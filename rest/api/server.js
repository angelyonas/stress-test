const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const routes = require('./routes')
const { notFound, error, response } = require('./middleware')
const { globals } = require('../config')
const { logger } = require('../services')

const server = express()
const PORT = globals.PORT
server.set('PORT', PORT)

server.use(helmet())
server.use(cors())
server.use(morgan(
  ':http-version :remote-addr :status :method :url :user-agent :response-time',
  { stream: logger.stream }
))

server.use(express.json({ limit: '10mb' }))
server.use(express.urlencoded({ extended: true }))

server.use(response)
server.use('/', routes)
server.use(notFound)
server.use(error)

module.exports = server
