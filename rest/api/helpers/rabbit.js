const asyncHandler = require('express-async-handler')
const { rabbitLib } = require('../../services')
const logger = require('../../services/logger')

const sendToQueueWaitResponse = async ({ body, queue }) => {
  try {
    const buffer = Buffer.from(JSON.stringify(body))
    const data = await rabbitLib.sendToQueueWaitResponse(queue, buffer)
    if ('error' in data) throw new Error(data.error)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

const rabbitOperation = (operation, queue, callback) => {
  return asyncHandler(async (req, res) => {
    const { query, body, params } = req
    const newBody = { query, params, body, operation }
    const { data } = await sendToQueueWaitResponse({ body: newBody, queue })
    if (callback) {
      callback(req, res, data)
    } else {
      res.success(data)
    }
  })
}
const withQueue = (queue) => {
  return (operation, callback) => rabbitOperation(operation, queue, callback)
}



const initQueue = async (queue, operations) => {
  try {
    const channel = await rabbitLib.createQueue(queue)

    await channel.consume(queue, async message => {
      const { content, properties: { replyTo, correlationId } } = message
      try {
        const req = JSON.parse(content.toString())
        let response
        const { operation } = req
        if (operation in operations) {
          response = await operations[operation](req)
        } else {
          throw new Error(`Invalid operation ${operation} (${queue})`)
        }
        await channel.sendToQueue(
          replyTo,
          Buffer.from(JSON.stringify({ data: response })),
          { correlationId }
        )
      } catch (err) {
        await channel.sendToQueue(
          replyTo,
          Buffer.from(JSON.stringify({ error: err.message })),
          { correlationId }
        )
        logger.error({ message: err })
      }
    }, { noAck: true })
  } catch (err) {
    logger.error({ message: err })
    throw err
  }
}

/*const initQueue = async (queue, operations) => {
  return {
    init: () => init(queue, operations)
  }
}*/

module.exports = {
  rabbitOperation,
  withQueue,
  sendToQueueWaitResponse,
  initQueue
}
