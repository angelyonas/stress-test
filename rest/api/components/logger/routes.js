const express = require('express')
const asyncHandler = require('express-async-handler')
const { withQueue } = require('../../helpers')
const { getLogFile, listLogFiles } = require('./services')

const router = express.Router()
const queue = 'logger'
const rabbitOperation = withQueue(queue)

router.get('/', asyncHandler(async (req, res) => {
  const { query: { file } } = req
  const data = file
    ? await getLogFile(file)
    : await listLogFiles()

  res.status(200).send(data)
}))

router.get('/worker', rabbitOperation('logs', (req, res, data) => {
  res.set('Content-Type', 'text/plain')
  res.send(data)
}))

module.exports = router
