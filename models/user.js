const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25
  },
  dob: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  phoneNo: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 14
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  roles: Array,
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      // email: this.email,
      phoneNo: this.phoneNo,
      roles: this.roles,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validate(req) {
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
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
  });
}

exports.User = User;
exports.validate = validate;
