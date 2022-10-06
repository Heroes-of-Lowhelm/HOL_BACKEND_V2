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

const burnOne = catchAsync(async (req, res) => {
  const hero = await heroesService.getHeroesByUniqueId(req.query.unique_id);
  if (!hero) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hero not found');
  };
  const { tokenId } = hero;
  await heroesService.burnHero(tokenId);
  await heroesService.deleteHero(hero['unique_id']);
  res.status(httpStatus.NO_CONTENT).send();
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
  const mintResult = await heroesService.mintHero(req.body);
  const tokenId = mintResult['token_id_count'];
  const hero = await heroesService.createHero({ ...req.body, tokenId });
  res.status(httpStatus.CREATED).send(hero);
});

const batchMintHero = catchAsync(async (req, res) => {
  const data = req.body;
  const user = await userService.getUserById(data[0].user_id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    const singleData = data[i];
    // eslint-disable-next-line no-await-in-loop
    if (await Heroes.isHeroIdTaken(singleData.unique_id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Hero unique_id is already taken');
    }
  }

  const mintResult = await heroesService.batchMintHero(data);
  const tokenId = mintResult['token_id_count'];
  // eslint-disable-next-line no-plusplus
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    const singleData = data[i];
    // eslint-disable-next-line no-await-in-loop
    await heroesService.createHero({ ...singleData, tokenId: tokenId - (9 - i) });
  }
  res.status(httpStatus.CREATED).send({
    'First NFT Token ID': tokenId - 9,
    'Last NFT Token ID': tokenId - 0,
  });
});

module.exports = {
  createHero,
  getHeroes,
  getHero,
  batchMintHero,
  // deleteHero,
  mintHero,
  burnOne,
};
