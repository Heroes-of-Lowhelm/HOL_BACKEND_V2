const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const transactionSchema = mongoose.Schema(
  {
    page: {
      type: Number,
      required: true,
      index: true,
    },
    totalNumber: {
      type: Number,
      required: true,
    },
    blockTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionSchema.plugin(toJSON);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
