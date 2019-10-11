const express = require("express");
const router = express.Router();
const { Roster, validate: validateReturn } = require("../models/Roster");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

router.get("/upcomingSunday", async (req, res) => {
  const rosters = await Roster.find();
  let date = new Date();
  let upcomingSunday;
  if (date.getDay() > 0) {
    upcomingSunday = new Date(
      new Date().setDate(date.getDate() - date.getDay() + 7)
    );
  } else {
    upcomingSunday = date;
  }
  let set = false;
  rosters.forEach(roster => {
    if (roster.date.getDay() === upcomingSunday.getDay()) {
      if (roster.date.getMonth() === upcomingSunday.getMonth()) {
        if (roster.date.getFullYear() === upcomingSunday.getFullYear()) {
          !set && res.send(roster);
          return (set = true);
        }
      }
    }
  });
  !set && res.status(404).send("Roster not available");
});

router.get("/myRosters/:id", auth, async (req, res) => {
  const rosters = await Roster.find().gte("date", new Date());
  if (!rosters[0]) return res.status(404).send("No sundays rostered");

  let userRosters = [];
  rosters.forEach(roster => {
    roster.data.forEach((role, index) => {
      if (role.user) {
        if (role.user._id === req.params.id)
          userRosters.push({ date: roster.date, _id: roster._id, role, index });
      }
    });
  });

  if (!userRosters[0]) {
    return res.status(404).send("Not rostered for upcoming Sundays");
  } else {
    res.send(userRosters);
  }
});

router.get("/", async (req, res) => {
  const rosters = await Roster.find().gte("date", new Date());
  if (rosters[0]) return res.send(rosters);
  res.status(404).send("No sundays rostered");
});

router.get("/:id", async (req, res) => {
  const { error } = validateId({ id: req.params.id });
  if (error) return res.status(400).send(error.details[0].message);
  const roster = await Roster.findById(req.params.id);
  if (!roster) return res.status(404).send("Roster does not exist.");
  res.send(roster);
});

router.put("/:id", [validate(validateReturn)], async (req, res) => {
  const roster = await Roster.findByIdAndUpdate(
    req.params.id,
    {
      date: req.body.date,
      data: req.body.data
    },
    { new: true }
  );

  if (roster) return res.send(roster);
  res.status(404).send("Roster does not exist.");
});

router.put("/updateUserRoster/:id", auth, async (req, res) => {
  if (!req.body.id) res.status(404).send("Roster does not exist.");
  const roster = await Roster.findById(req.body._id);
  roster.data[req.body.index].status = req.body.role.status;
  const updatedRoster = await Roster.findByIdAndUpdate(
    req.body._id,
    {
      data: roster.data
    },
    { new: true }
  );
  if (updatedRoster) return res.send(roster);
  res.status(404).send("Roster does not exist.");
});

router.post("/", [auth, admin, validate(validateReturn)], async (req, res) => {
  let roster = new Roster({
    date: req.body.date,
    data: req.body.data
  });
  try {
    const result = await roster.save();
    res.send(result);
  } catch (error) {
    res.status(400).send("error.message");
  }
});

router.delete("/:id", async (req, res) => {
  const roster = await Roster.findByIdAndRemove(req.params.id);
  if (roster) return res.send(roster);
  res.status(404).send("Roster does not exist.");
});

function validateId(obj) {
  const schema = {
    id: Joi.objectId()
  };
  return Joi.validate(obj, schema);
}

module.exports = router;
