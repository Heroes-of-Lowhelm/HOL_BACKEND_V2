const { Transaction } = require('../models');

/**
 * Get last record
 * @returns {Promise<User>}
 */
const getLatestTransactionHistory = async () => {
  return Transaction.find().limit(1).sort({id: -1});
};
/**
 * Listen Game Contract's address transactions
 */
const ListenEvent = async () => {
  const { default: Zilliqa } = await import('@zilliqa-js/viewblock');
  const client = Zilliqa({
    apiKey: process.env.VIEWBLOCK_API_KEY,
  });

  const getCurrentTransction = async (page) => {
    return await client.getAddressTokenTxs(
      process.env.GAME_CONTRACT_ADDR,
      {
        page: page,
        network: 'testnet'
      }
    );
  }
  // Get the latest transaction history
  const transaction = await getLatestTransactionHistory();
  console.log("latest transaction history==========>", transaction);
  let page = 1;
  let blockTimeStamp = 0;
  if (transaction[0]) {
    page = transaction[0].page;
    blockTimeStamp = transaction[0].blockTime;
  }
  const res = await getCurrentTransction(page);
  let currentTotalPages = res.totalPages;
  let documents = res.docs;
  while (currentTotalPages > page) {
    page ++;
    let result = await getCurrentTransction(page);
    documents = documents.concat(result.docs);
  }

  // Get newly generated transactions
  let newTransactions = documents.filter((item) => {
    return  item.timestamp > blockTimeStamp;
  })
  console.log(newTransactions);
};

module.exports = {
  ListenEvent,
};
