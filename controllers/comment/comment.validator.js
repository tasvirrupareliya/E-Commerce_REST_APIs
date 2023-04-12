const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  create: validator({
    body: Joi.object({}).required(),
  }),
  delete: validator({
    params: Joi.object({
      id: Joi.string().required(),
    }),
  }),
};
