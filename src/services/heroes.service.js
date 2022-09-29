const httpStatus = require('http-status');
const { Heroes } = require('../models');
const { mintHeroTx, getHeroTokenIdCount } = require('./blockchain.service');
const ApiError = require('../utils/ApiError');

/**
 * Get hero by id
 * @param {ObjectId} id
 * @returns {Promise<Heroes>}
 */
const getHeroById = async (id) => {
  return Heroes.findById(id);
};

/**
 * Get heroes by user_id
 * @param {ObjectId} user_id
 * @returns {Promise<Heroes>}
 */
// eslint-disable-next-line camelcase
const getHeroesByUserId = async (user_id) => {
  return Heroes.find({ user_id });
};

/**
 * Get heroes by unique_id
 * @param {ObjectId} unique_id
 * @returns {Promise<Heroes>}
 */
// eslint-disable-next-line camelcase
const getHeroesByUniqueId = async (unique_id) => {
  return Heroes.findOne({ unique_id });
};

/**
 * Create Hero
 * @param {heroParam} id
 * @returns {Promise<Heroes>}
 */
const createHero = async (heroParam) => {
  if (await Heroes.isHeroIdTaken(heroParam.unique_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Hero unique_id is already taken');
  }
  return Heroes.create(heroParam);
};

const mintHero = async (heroParam) => {
  const result = await mintHeroTx(heroParam);
  if (!result) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Zilliqa Error: Error while minting Heroes');
  }
  if (result.receipt.success !== true) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Transaction Error while minting Heroes');
  }
  const nftId = await getHeroTokenIdCount();
  return nftId.result;
};

module.exports = {
  getHeroById,
  createHero,
  mintHero,
  getHeroesByUserId,
  getHeroesByUniqueId,
};
