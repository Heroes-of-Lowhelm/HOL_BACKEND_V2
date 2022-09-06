import Zilliqa from '@zilliqa-js/viewblock';

const logger = require('../config/logger');

const client = Zilliqa({
  apiKey: process.env.VIEWBLOCK_API_KEY,
});

/**
 * Listen Game Contract's address transactions
 */
const ListenEvent = () => {
  logger.info('Listening event');
  client.subscribe({ event: 'addressTx', param: 'zil1gqww6yq9d9nefhg3rec989kxsqs4zm8dzeyr0q' }, logger.info);
};

module.exports = {
  ListenEvent,
};
