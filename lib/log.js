var logger = console;

function setLogger(newLogger) {
  logger = newLogger;
}

function error(message, details) {
  logger.error(message, details);
}

function info(message, details) {
  logger.info(message, details);
}

function warn(message, details) {
  logger.warn(message, details);
}

module.exports.setLogger = setLogger;
module.exports.error = error;
module.exports.info = info;
module.exports.warn = warn;