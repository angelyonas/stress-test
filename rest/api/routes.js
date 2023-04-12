const express = require('express')
const router = express.Router()
const root = require('./components/root/routes')
const logger = require('./components/logger/routes')

router.use('/', [root])
router.use('/logger', [logger])

module.exports = router
