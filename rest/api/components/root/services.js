const { sendToQueueWaitResponse } = require("../../helpers");
const logger = require("../../../services/logger");

const logTag = "[root.services]";

const CUSTOMER_QUEUE = "stress";
const RABBIT_OPERATION = "sendQueryTest";

let queriesNumber = 100;
let loopsNumber = 1;
let delay = 60000;
let currentInterval = 1;
let intervalShots = null;

/**
 * Config process to sress test
 * @param {object} { loop, delayProcess, queries }
 */
const configProcess = ({ loop = 1, delayPerQuery = 60000, queries = 100 }) => {
  loopsNumber = loop || 1;
  delay = delayPerQuery || 60000;
  queriesNumber = queries || 100;
};

/**
 * send queue to shoot queries
 * @param {object} payload
 */
const shootingQueries = async (body) => {
  try {
    currentInterval += 1;
    const listQueries = [];

    const fillList = ({ payload, apiUrl, accessToken }) =>
      listQueries.push({
        body: { payload, apiUrl, accessToken },
        operation: RABBIT_OPERATION,
      });

    if (Array.isArray(body)) {
      body.forEach((data) => {
        const { payload, apiUrl, accessToken } = data;
        let id  = payload.id;
        payload.id = `${id}-${currentInterval}`;
        fillList({ payload, apiUrl, accessToken });
      });
    } else {
      const { payload = {}, apiUrl = "https://www.google.com/", accessToken } = body;
      for (let i = 1; i <= queriesNumber; i++) {
        fillList({ payload, apiUrl, accessToken });
      }
    }

    console.log(`Queries ready to send: ${listQueries.length}`);

    const response = await Promise.all(
      listQueries.map(async (body) => {
        logger.info({ message: `body to send: ${JSON.stringify(body)}` });
        const response = await sendToQueueWaitResponse({
          body,
          queue: CUSTOMER_QUEUE,
        });

        return response;
      })
    );
    console.log("Response of queue: ", response);
    logger.info({ message: `Response of queue no ${currentInterval}: ${JSON.stringify(response)}` });
  } catch (error) {
    console.log(`Error in queue: `, error);
    logger.error({ message: `Error in queue no ${currentInterval}: ${JSON.stringify(error)}` });
  }
};

/**
 * Start process to send queries
 * @param {*} body
 */
const startProcess = (body) => {
  console.log("Process Start");
  currentInterval = 1;
  console.log("current interval ", currentInterval);

  let content = [];
  if (Array.isArray(body) && loopsNumber > 1) {
    const iterations = Math.ceil(body.length / loopsNumber);
    let indexArray = 0;
    for (let i = 0; i < loopsNumber; i++) {
      content[i] = [];
      for (let j = 0; j < iterations; j++) {
        if (indexArray < body.length) {
          content[i].push(body[indexArray]);
          indexArray++;
        }
      }
    }
  } else if (loopsNumber > 1) {
    for (let i = 0; i < loopsNumber; i++) {
      const bodyObj = JSON.parse(JSON.stringify(body));
      const { payload } = bodyObj;
      payload.id = `${payload.id}-${i}`;
      content.push({ ...bodyObj, payload });
    }
  } else {
    content = [body];
  }

  intervalShots = setInterval(async () => {
    console.log(
      `Current interval: ${currentInterval} -- loops number: ${loopsNumber}`
    );
    if (currentInterval > loopsNumber) {
      clearInterval(intervalShots);
      console.log(`Finished interval of shooting!`);
      return;
    }
    await shootingQueries(content[currentInterval - 1]);
  }, delay);
};

module.exports = {
  startProcess,
  configProcess,
};
