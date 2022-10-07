const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getGears = {
  query: Joi.object().keys({
    user_id: Joi.required().custom(objectId),
  }),
};

const getGear = {
  query: Joi.object().keys({
    unique_id: Joi.string().required(),
  }),
};

const burnOne = {
  query: Joi.object().keys({
    unique_id: Joi.string().required(),
  }),
};

const updateGear = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteGear = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const mintGear = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    unique_id: Joi.string().required(),
    item_name: Joi.string().required(),
    star_grade: Joi.number().required(),
    main_stat: Joi.string().required(),
    sub_stat1: Joi.string(),
    sub_stat2: Joi.string(),
    sub_stat3: Joi.string(),
    sub_stat4: Joi.string(),
    sub_stat5: Joi.string(),
    set: Joi.valid('Life', 'Harden', 'Strength', 'Degen', 'Effectiveness', 'Explosion', 'Vampire'),
    is_chaotic: Joi.boolean().required(),
  }),
};

const batchMintGear = {
  body: Joi.array().length(10),
};

module.exports = {
  getGears,
  getGear,
  updateGear,
  deleteGear,
  mintGear,
  burnOne,
  batchMintGear,
};
