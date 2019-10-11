//Error handling in the request process pipeline.
const winston = require("winston");

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);

  res.status(500).send("Something failed");
};
