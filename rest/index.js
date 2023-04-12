const server = require("./api/server");
const { logger, rabbitLib } = require("./services");
const PORT = server.get("PORT");

(async () => {
  try {
    await rabbitLib.connect();
    server.listen(PORT, () =>
      logger.info(`Server running on the port: ${PORT}`)
    );
  } catch (err) {
    console.log("Error index: ", err);
    logger.error({ message: err.message });
    await rabbitLib.disconnect();
    process.exit(1);
  }
})();
