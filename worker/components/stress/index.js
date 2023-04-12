const { initQueue } = require('../../helpers/rabbit')
const { sendQueryTest } = require('./services')

const operations = {
  sendQueryTest
}

module.exports = initQueue('stress', operations)
