const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const heroesSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
    },
    unique_id: {
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
heroesSchema.plugin(paginate);

/**
 * Check if unique_id is taken
 * @param {string} unique_id - The hero's unique_id
 * @param {ObjectId} [excludeHeroId] - The id of the hero
 * @returns {Promise<boolean>}
 */
// eslint-disable-next-line camelcase
heroesSchema.statics.isHeroIdTaken = async function (unique_id, excludeHeroId) {
  const hero = await this.findOne({ unique_id, _id: { $ne: excludeHeroId } });
  return !!hero;
};

/**
 * @typedef Transaction
 */
const Heroes = mongoose.model('Heroes', heroesSchema);

module.exports = Heroes;
