const axios = require("axios");
const logger = require("../../services/logger");
const scripts = require("./scripts");

const sendQueryTest = async ({ body }) => {
  try {
    const { payload, apiUrl, accessToken, script } = body;

    if (script) {
      if (!scripts[script]) throw new Error('Script name not found');
      return await scripts[script](body);
    }

    let config = {};
    if (accessToken) {
      const { header, token } = accessToken;
      config = {
        headers: {
          [header]: token,
        },
      };
    }
    const response = await axios.post(apiUrl, payload, config);
    logger.info({
      message: `Response axios: ${JSON.stringify(response.data)}`,
    });
    return response.data;
  } catch (error) {
    // console.log(`Error in axios: `, error);
    logger.error({ message: `Error in axios: ${JSON.stringify(error)}` });
    return error;
  }
};

module.exports = {
  sendQueryTest,
};
