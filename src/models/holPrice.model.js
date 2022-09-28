const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const holPriceSchema = mongoose.Schema(
  {
    holPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
holPriceSchema.plugin(toJSON);
holPriceSchema.plugin(paginate);

/**
 * @typedef HolPrice
 */
const HolPrice = mongoose.model('HolPrice', holPriceSchema);

module.exports = HolPrice;
