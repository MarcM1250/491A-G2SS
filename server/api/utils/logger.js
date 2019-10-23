var appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');
const { combine, simple } = format;

// instantiate a new Winston Logger with the settings defined above
var logger = createLogger({
  format: combine(
      format.errors({ stack: true }),
      format.splat(),
      format.json()
  ),
  transports: [
    new transports.File({ filename: `${appRoot}/api/logs/error.log`, 
            level: 'error',
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5, 
           }),
    new transports.File({ filename: `${appRoot}/api/logs/combined.log`, 
            handleExceptions: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5, 
            })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    level: 'info',
    handleExceptions: true,
      format: format.combine(
          format.colorize(),
          simple()
        )
  }));
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports = logger;
