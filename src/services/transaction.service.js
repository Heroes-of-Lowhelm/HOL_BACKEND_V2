const { userService } = require('./index');
const { User } = require('../models');
const { Transaction } = require('../models');

const createTransactionHistory = async (transaction) => {
  return Transaction.create(transaction);
};

/**
 * Get last record
 * @returns {Promise<User>}
 */
const getLatestTransactionHistory = async () => {
  return Transaction.find().limit(1).sort({"_id": -1});
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
  let currentTotalNumbers = res.total;
  while (currentTotalPages > page) {
    page ++;
    let result = await getCurrentTransction(page);
    documents = documents.concat(result.docs);
  }

  // Get newly generated transactions
  let newTransactions = documents.filter((item) => {
    return  item.timestamp > blockTimeStamp;
  })

  let latestTimeStamp = blockTimeStamp;
  for (let item of newTransactions) {
    let { from, value, tokenAddress, direction, timestamp} = item;
    if (latestTimeStamp < timestamp) {
      latestTimeStamp = timestamp;
    }
    if (direction === 'in') {
      value = parseFloat(value) * 10000000000000;
      const user = await userService.getUserByZilWallet(from);
      if (user) {
        if (tokenAddress === process.env.HOL_TOKEN_ADDR) {
          let holBalance = user.hol + value;
          console.log("hol balance==============>", user.hol, value, holBalance);
          await userService.updateUserById(user.id, {...user, hol: holBalance})
        } else if (tokenAddress === process.env.CAST_TOKEN_ADDR) {
          let castBalance = user.cast + value;
          await userService.updateUserById(user.id, {...user, cast: castBalance})
        }
      }
    }
  }


  // Write transaction history to database
  await createTransactionHistory({
    page: currentTotalPages,
    totalNumber:currentTotalNumbers,
    blockTime: latestTimeStamp,
  })
  // console.log(newTransactions);
};

module.exports = {
  ListenEvent,
};
