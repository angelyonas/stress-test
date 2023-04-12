const { logger } = require('../../services')

module.exports = (req, res, next) => {
  res.success = ({ status = 200, message = '', data = {} }) => {
    res
      .type('application/json')
      .status(status)
      .json({ status, message, data })
      .end()

    logger.info(data)
  }

  res.error = ({ status = 400, message }) => {
    res
      .type('application/json')
      .status(status)
      .json({ status, message })
      .end()

    logger.error({ message })
  }
  next()
}
