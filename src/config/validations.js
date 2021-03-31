const Joi = require("joi");
const { join } = require("lodash");
const { resolve, reject } = require("promise");
var Promise = require("promise");

const listAnnouncement = function (body) {
  const schema = Joi.object()
    .keys({
      type: Joi.string().valid("all", "specific").allow().required(),
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
