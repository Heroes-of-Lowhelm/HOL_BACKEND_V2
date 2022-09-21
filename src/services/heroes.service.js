const httpStatus = require('http-status');
const { Heroes } = require('../models');
const { mintHeroTx } = require('./blockchain.service');
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
 * Create Hero
 * @param {heroParam} id
 * @returns {Promise<Heroes>}
 */
const createHero = async (heroParam) => {
  return Heroes.create(heroParam);
};

const mintHero = async (heroParam) => {
  const result = await mintHeroTx(heroParam);
  if (!result) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Zilliqa Error: Error while minting Heroes');
  }
  console.log(result);
  if (result.receipt.success !== true) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Transaction Error while minting Heroes');
  }
  return result;
};

module.exports = {
  getHeroById,
  createHero,
  mintHero,
};
