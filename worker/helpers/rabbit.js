const { rabbit, logger } = require('../services')

const initQueue = async (queue, operations) => {
  return {
    init: () => init(queue, operations)
  }
}

const init = async (queue, operations) => {
  try {
    const channel = await rabbit.createQueue(queue)

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

const sendToQueueWaitResponse = async ({ body, queue }) => {
  try {
    const buffer = Buffer.from(JSON.stringify(body))
    const data = await rabbit.sendToQueueWaitResponse(queue, buffer)
    if ('error' in data) throw new Error(data.error)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  initQueue,
  sendToQueueWaitResponse
}
