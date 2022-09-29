const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { priceService } = require('../services');
const ApiError = require('../utils/ApiError');

const getTwapHol = catchAsync(async (req, res) => {
  const price = await priceService.getPrice();
  if (!price) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Price not found');
  }
  res.send(price);
});

module.exports = {
  getTwapHol,
};
