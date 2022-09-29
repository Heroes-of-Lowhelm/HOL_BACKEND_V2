const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, gearsService } = require('../services');
const { Gears } = require('../models');

const createHero = catchAsync(async (req, res) => {
  const hero = await gearsService.createHero(req.body);
  res.status(httpStatus.CREATED).send(hero);
});

const getGears = catchAsync(async (req, res) => {
  const result = await gearsService.getGearsByUserId(req.query.user_id);
  res.send(result);
});

const getGear = catchAsync(async (req, res) => {
  const hero = await gearsService.getGearByUniqueId(req.query.unique_id);
  if (!hero) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hero not found');
  }
  res.send(hero);
});

const burnOne = catchAsync(async (req, res) => {
  const gear = await gearsService.getGearByUniqueId(req.query.unique_id);
  if (!gear) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Gear not found');
  };
  const { tokenId } = gear;
  await gearsService.burnGear(tokenId);
  await gearsService.deleteGear(gear['unique_id']);
  res.status(httpStatus.NO_CONTENT).send();
});

const mintGear = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (await Gears.isGearIdTaken(req.body.unique_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Gear unique_id is already taken');
  }
  const mintResult = await gearsService.mintGear(req.body);
  const tokenId = mintResult['token_id_count'];
  const gear = await gearsService.createGear({ ...req.body, tokenId });
  res.status(httpStatus.CREATED).send(gear);
});

module.exports = {
  createHero,
  getGears,
  getGear,
  mintGear,
  burnOne,
};
