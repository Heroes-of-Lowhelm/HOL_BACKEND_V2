const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const getHeroes = {
  query: Joi.object().keys({
    user_id: Joi.required().custom(objectId),
  }),
};

const getHero = {
  query: Joi.object().keys({
    unique_id: Joi.string().required(),
  }),
};

const updateHero = {
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

const deleteHero = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const mintHero = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
    unique_id: Joi.string().required(),
    item_name: Joi.string().required(),
    star_grade: Joi.number().required(),
    regular_lv: Joi.number().required(),
    passive_lv: Joi.number().required(),
    skill1_lv: Joi.number().required(),
    skill2_lv: Joi.number().required(),
    is_chaotic: Joi.boolean().required(),
    sub_level: Joi.number().required(),
    exp: Joi.number().required(),
    attack_value: Joi.number().required(),
    hp_value: Joi.number().required(),
    speed_value: Joi.number().required(),
    resistance_value: Joi.number().required(),
  }),
};

module.exports = {
  getHeroes,
  getHero,
  updateHero,
  deleteHero,
  mintHero,
};
