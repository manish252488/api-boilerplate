const Joi = require("joi");
var Promise = require("promise");

export const productValidation = function (body) {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required().allow(),
      category: Joi.string().required().allow(),
      description: Joi.string().allow(),
      MPrice: Joi.number().required().allow(),
      SPrice: Joi.number().required().allow(),
      discount: Joi.number().default(0).allow(),
      file: Joi.any().allow()
    })
    .unknown(true);
  return new Promise((resolve, reject) => {
    const { value, error, warning } = schema.validate(body);
    if (error) {
      reject({ status_code: 400, message: error.details[0].message });
    } else {
      resolve(value);
    }
  });
};
