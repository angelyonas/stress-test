const createError = require('http-errors')
const { globals } = require('../../config')
const { logger } = require('../../services')

module.exports = (err, req, res, next) => {
  const {
    name: error,
    status,
    message,
    stack
  } = err.status ? err : createError(500, err)

  const base = { status, error, message }
  logger.error({ ...base, stack })

  if (globals.NODE_ENV === 'development') {
    res.status(status).json({ ...base, stack })
  } else {
    res.status(status).json(base)
  }
}
