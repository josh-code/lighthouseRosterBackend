const express = require("express");
const winston = require("winston");
const webpush = require("web-push");
const bodyParser = require("body-parser");

const app = express();

const PublicVapidKey =
  "BMgqZJNIR8FNsJ5LbRXgAFrV7Xzi9Z7XYKYVLuuxNSj36hn3d9elfr7C0rxGs06izMfb_gP8xT6GwA0MU-Wzmwg";
const privateVapidKey = "MpzcaZuJP-JjbxZhVYyiAetwbCwWuNShIqfU-Py8j4w";

// require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3900;

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => winston.info(`Listning on port ${port}...`));
  console.log("not in test");
}

module.exports = app;
