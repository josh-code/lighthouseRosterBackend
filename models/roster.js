const mongoose = require("mongoose");
const Joi = require("joi");

const Roster = mongoose.model(
  "Roster",
  mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  })
);

function validate(req) {
  const schema = {
    date: Joi.date().required(),
    data: Joi.array().required()
  };
  return Joi.validate(req.body, schema);
}

exports.Roster = Roster;
exports.validate = validate;
