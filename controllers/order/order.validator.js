const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  purchase: validator({
    body: Joi.object({
      cartId: Joi.string().required(),
      address: Joi.object({
        address: Joi.string(),
        city: Joi.string(),
        province: Joi.string(),
        country: Joi.string(),
        postalcode: Joi.string(),
      }),
    }).required(),
  }),
};
