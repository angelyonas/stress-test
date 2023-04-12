const amqplib = require('amqplib')
const { rabbit } = require('../config')
const uuid = require('uuid')

module.exports = (() => {
  const CONFIG_RABBIT = {
    protocol: rabbit.PROTOCOL,
    hostname: rabbit.HOST,
    port: rabbit.PORT_SERVICE,
    username: rabbit.USER,
    password: rabbit.PASSWORD,
    vhost: rabbit.VHOST
  }

  let connection = null
  let channel = null

  const connect = async () => {
    try {
      connection = await amqplib.connect(CONFIG_RABBIT)
      channel = await connection.createChannel()
    } catch (error) {
      throw new Error(error)
    }
  }

  const createQueue = async (queue) => {
    await channel.assertQueue(queue)
    await channel.prefetch(1)
    return channel
  }

  const disconnect = async () => {
    try {
      setImmediate(async () => await connection.close())
    } catch (error) {
      throw new Error(error)
    }
  }

  const sendToQueueWaitResponse = async (queue, buffer) => {
    return new Promise(async (resolve, reject) => {
      try {
        const correlationId = uuid.v4()
        const channel = await connection.createChannel()
        const { queue: replyTo } = await channel.assertQueue('', { autoDelete: true })

        channel.consume(replyTo, async message => {
          const { content, properties } = message

          if (properties.correlationId === correlationId) {
            try {
              const data = content.toString()
              const parsedData = JSON.parse(data)
              resolve(parsedData)
            } catch (err) {
              reject(err)
            } finally {
              await channel.close()
            }
          }
        }, { noAck: true })

        channel.sendToQueue(queue,
          buffer,
          { correlationId, replyTo }
        )
      } catch (err) {
        reject(err)
      }
    })
  }

  return {
    connect,
    createQueue,
    disconnect,
    sendToQueueWaitResponse
  }
})()
