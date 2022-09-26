const httpStatus = require('http-status');
const { Gears } = require('../models');
const { mintGearTx } = require('./blockchain.service');
const ApiError = require('../utils/ApiError');

/**
 * Get gear by id
 * @param {ObjectId} id
 * @returns {Promise<Heroes>}
 */
const getGearById = async (id) => {
  return Gears.findById(id);
};

/**
 * Get gears by user_id
 * @param {ObjectId} user_id
 * @returns {Promise<Heroes>}
 */
// eslint-disable-next-line camelcase
const getGearsByUserId = async (user_id) => {
  return Gears.find({ user_id });
};

/**
 * Get heroes by unique_id
 * @param {ObjectId} unique_id
 * @returns {Promise<Heroes>}
 */
// eslint-disable-next-line camelcase
const getGearByUniqueId = async (unique_id) => {
  return Gears.findOne({ unique_id });
};

/**
 * Create Hero
 * @param {heroParam} id
 * @returns {Promise<Heroes>}
 */
const createGear = async (gearParam) => {
  if (await Gears.isGearIdTaken(gearParam.unique_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Gear unique_id is already taken');
  }
  return Gears.create(gearParam);
};

const mintGear = async (gearParam) => {
  const result = await mintGearTx(gearParam);
  if (!result) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Zilliqa Error: Error while minting Heroes');
  }
  if (result.receipt.success !== true) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Transaction Error while minting Heroes');
  }
  return result;
};

module.exports = {
  getGearById,
  getGearsByUserId,
  getGearByUniqueId,
  createGear,
  mintGear,
};
