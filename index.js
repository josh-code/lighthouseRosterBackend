const express = require("express");
const winston = require("winston");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3900;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => winston.info(`Listning on port ${port}...`));
  console.log("not in test");
}
