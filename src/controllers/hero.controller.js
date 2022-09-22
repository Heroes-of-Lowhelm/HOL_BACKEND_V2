const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { heroesService, userService } = require('../services');
const { Heroes } = require('../models');

const createHero = catchAsync(async (req, res) => {
  const hero = await heroesService.createHero(req.body);
  res.status(httpStatus.CREATED).send(hero);
});

const getHeroes = catchAsync(async (req, res) => {
  const result = await heroesService.getHeroesByUserId(req.query.user_id);
  res.send(result);
});

const getHero = catchAsync(async (req, res) => {
  const hero = await heroesService.getHeroesByUniqueId(req.query.unique_id);
  if (!hero) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hero not found');
  }
  res.send(hero);
});

// const updateHero = catchAsync(async (req, res) => {
//   const user = await userService.updateUserById(req.params.userId, req.body);
//   res.send(user);
// });
//
// const deleteHero = catchAsync(async (req, res) => {
//   await userService.deleteUserById(req.params.userId);
//   res.status(httpStatus.NO_CONTENT).send();
// });

const mintHero = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.body.user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (await Heroes.isHeroIdTaken(req.body.unique_id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Hero unique_id is already taken');
  }
  await heroesService.mintHero(req.body);
  const hero = await heroesService.createHero(req.body);
  res.status(httpStatus.CREATED).send(hero);
});

module.exports = {
  createHero,
  getHeroes,
  getHero,
  // updateHero,
  // deleteHero,
  mintHero,
};
