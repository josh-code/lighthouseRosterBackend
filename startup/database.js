const winston = require("winston");
const mongoose = require("mongoose");
const config = require("config");

const db = config.get("db");
module.exports = function() {
  mongoose.set("useCreateIndex", true);
  // mongoose.set("useNewUrlParser", true);
  console.log(db);
  mongoose.connect(db).then(() => winston.info(`connected to ${db}`));
};
