const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('./plugins');

const codeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
codeSchema.plugin(toJSON);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeCodeId] - The id of the code to be excluded
 * @returns {Promise<boolean>}
 */
codeSchema.statics.isEmailTaken = async function (email, excludeCodeId) {
  const code = await this.findOne({ email, _id: { $ne: excludeCodeId } });
  return !!code;
};

/**
 * @typedef Token
 */
const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
