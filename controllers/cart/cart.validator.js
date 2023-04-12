const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  create: validator({
    body: Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().required(),
    }).required(),
  }),
  updateOneProductBYCart: validator({
    body: Joi.object({
      quantity: Joi.number().required(),
    }).required(),
  }),
};
