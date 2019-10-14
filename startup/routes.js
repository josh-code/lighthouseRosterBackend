const express = require("express");
const error = require("../middleware/error");
const roster = require("../routes/rosters");
const user = require("../routes/users");
const auth = require("../routes/auth");
const cors = require("cors");
module.exports = function(app) {
  app.use(cors({ origin: "https://lighthouseroster.herokuapp.com" }));
  // app.use(cors({ origin: "http://localhost:3000" }));
  app.use(express.json());
  app.use("/api/roster", roster);
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  //--------------Request pipeline Error handeling---------
  app.use(error);
};
