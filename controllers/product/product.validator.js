const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  create: validator({
    body: Joi.object({}).required(),
  }),
  update: validator({
    body: Joi.object({}).required(),
  }),
};
