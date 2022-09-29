const express = require('express');
const priceController = require('../../controllers/price.controller');

const router = express.Router();

router.get('/twap-hol', priceController.getTwapHol);

module.exports = router;
