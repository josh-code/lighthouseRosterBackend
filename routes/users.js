const express = require("express");
const router = express.Router();
const { User, validate: validateReturn } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");

router.get("/", [auth, admin], async (req, res) => {
  console.log("check");
  const users = await User.find().select("-password");
  console.log(users);
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", validate(validateReturn), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered...");

  req.body.roles = [];
  req.body.isAdmin = false;
  user = User(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "dob",
      "email",
      "phoneNo",
      "password",
      "roles",
      "isAdmin"
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(
        _.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "dob",
          "email",
          "phoneNo",
          "roles",
          "isAdmin"
        ])
      );
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/admin/:id", [auth, admin], async (req, res) => {
  let user = await User.findByIdAndUpdate(
    req.params.id,
    { isAdmin: req.body.isAdmin, roles: req.body.roles },
    { new: true }
  );
  if (user) return res.send(user);
  res.status(404).send("User does not exist.");
});

router.put("/:id", [auth, validate(userValidate)], async (req, res, next) => {
  let user = await User.findByIdAndUpdate(
    req.params.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      phoneNo: req.body.phoneNo,
      email: req.body.email
    },
    { new: true }
  );
  if (user) return res.send(user);
  res.status(404).send("User does not exist.");
});

function userValidate(req) {
  return Joi.validate(req, {
    firstName: Joi.string()
      .required()
      .min(3)
      .max(25),
    lastName: Joi.string()
      .required()
      .min(3)
      .max(25),
    dob: Joi.date().required(),
    email: Joi.string()
      .required()
      .email()
      .min(5)
      .max(225),
    phoneNo: Joi.string()
      .required()
      .min(10)
      .max(14),
    roles: Joi.array(),
    isAdmin: Joi.boolean()
  });
}

module.exports = router;
