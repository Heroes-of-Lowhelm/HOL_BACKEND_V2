const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const heroesSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    item_name: {
      type: String,
      required: true,
    },
    star_grade: {
      type: Number,
      required: true,
    },
    regular_lv: {
      type: Number,
      required: true,
    },
    passive_lv: {
      type: Number,
      required: true,
    },
    skill1_lv: {
      type: Number,
      required: true,
    },
    skill2_lv: {
      type: Number,
      required: true,
    },
    is_chaotic: {
      type: Boolean,
      required: true,
    },
    sub_level: {
      type: Number,
      required: true,
    },
    exp: {
      type: Number,
      required: true,
    },
    attack_value: {
      type: Number,
      required: true,
    },
    hp_value: {
      type: Number,
      required: true,
    },
    speed_value: {
      type: Number,
      required: true,
    },
    resistance_value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
heroesSchema.plugin(toJSON);

/**
 * @typedef Transaction
 */
const Heroes = mongoose.model('Heroes', heroesSchema);

module.exports = Heroes;
