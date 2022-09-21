const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
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

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const connectWallet = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    type: Joi.string().required().valid('zil', 'evm'),
    address: Joi.string().required(),
  }),
};

const mintHero = {
  body: Joi.object().keys({
    user_id: Joi.string().required(),
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
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  connectWallet,
  mintHero,
};
