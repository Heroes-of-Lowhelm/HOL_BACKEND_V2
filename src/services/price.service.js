const axios = require('axios');
const { HolPrice, Transaction } = require('../models');

const getTWAP = async () => {
  const config = {
    method: 'get',
    url: 'https://api.zilstream.com/rates/HOL?interval=1m&period=1h&currency=USD',
    headers: {},
  };

  try {
    const result = await axios(config);
    const prices = result.data;
    let sum = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const priceData of prices) {
      const price = priceData.close;
      sum += price;
    }
    return sum / 61;
  } catch (e) {
    console.log('error occured from ZilStream===========>', e);
  }
};

const fetchPrice = async () => {
  const holTWAP = await getTWAP();
  await HolPrice.create({ holPrice: holTWAP });
};

const getPrice = async () => {
  return HolPrice.find().limit(1).sort({ _id: -1 });
};

module.exports = {
  fetchPrice,
  getPrice,
};
