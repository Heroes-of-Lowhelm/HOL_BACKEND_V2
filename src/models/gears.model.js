const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const gearsSchema = mongoose.Schema(
  {
    user_id: {
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
    main_stat: {
      type: String,
      required: true,
    },
    sub_stat1: {
      type: String,
    },
    sub_stat2: {
      type: String,
    },
    sub_stat3: {
      type: String,
    },
    sub_stat4: {
      type: String,
    },
    sub_stat5: {
      type: String,
    },
    set: {
      type: String,
      enum: ['Life', 'Harden', 'Strength', 'Degen', 'Effectiveness', 'Explosion', 'Vampire'],
    },
    is_chaotic: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gearsSchema.plugin(toJSON);
gearsSchema.plugin(paginate);

/**
 * Check if unique_id is taken
 * @param {string} unique_id - The hero's unique_id
 * @param {ObjectId} [excludeHeroId] - The id of the hero
 * @returns {Promise<boolean>}
 */
// eslint-disable-next-line camelcase
gearsSchema.statics.isGearIdTaken = async function (unique_id, excludeHeroId) {
  const gear = await this.findOne({ unique_id, _id: { $ne: excludeHeroId } });
  return !!gear;
};

/**
 * @typedef Transaction
 */
const Gears = mongoose.model('Gears', gearsSchema);

module.exports = Gears;
