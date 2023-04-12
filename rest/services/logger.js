const winston = require("winston");
const { globals } = require("../config");

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.prettyPrint()
);

const transportConsole = new winston.transports.Console({ format });

const loggerWrapper = (filename) =>
  winston.createLogger({
    format,
    transports: [
      new winston.transports.File({
        filename,
        maxsize: 5000000,
        maxFiles: 5,
        tailable: true,
        zippedArchive: true,
      }),
    ],
  });

const info = loggerWrapper("./logs/info.log");
const error = loggerWrapper("./logs/error.log");

if (globals.NODE_ENV !== "production") {
  info.add(transportConsole);
  error.add(transportConsole);
}

info.stream = {
  write: (message) => {
    info.info(message);
  },
};

module.exports = {
  stream: info.stream,
  info(msg) {
    info.info(msg);
  },
  error(msg) {
    error.error(msg);
  },
};
