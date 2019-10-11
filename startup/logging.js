require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/lighthouseRoster"
    })
  );

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );

  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.MongoDB({
      db: "mongodb://localhost/lighthouseRoster"
    })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
