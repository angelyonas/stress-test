const { rabbit, rest, logger } = require('./services')
const workers = require('./components')


;(async function () {
  try {

    await rest()
    await rabbit.connect()
    for await (const worker of workers) {
      await worker.init()
    }
    logger.info('Initialized Worker')
  } catch (err) {
    logger.error({ message: err })
    await rabbit.disconnect()
    throw new Error(err)
  }
})()
