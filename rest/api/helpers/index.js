const {
  rabbitOperation,
  withQueue,
  sendToQueueWaitResponse,
  initQueue,
} = require("./rabbit");

module.exports = {
  sendToQueueWaitResponse,
  initQueue,
  rabbitOperation,
  withQueue,
};
