const {
  rabbitOperation,
  withQueue,
  sendToQueueWaitResponse,
  initQueue,
} = require("./rabbit");

const getRandNumber = require('./randNumber')

module.exports = {
  sendToQueueWaitResponse,
  initQueue,
  rabbitOperation,
  withQueue,
  getRandNumber
};
