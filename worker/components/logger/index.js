const { initQueue } = require('../../helpers/rabbit')
const { logs } = require('./services')

const operations = {
  logs
}
module.exports = initQueue('logger', operations)
