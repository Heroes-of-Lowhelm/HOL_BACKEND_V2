/**
 * Listen Game Contract's address transactions
 */
const ListenEvent = async () => {
  const { default: Zilliqa } = await import('@zilliqa-js/viewblock');
  const client = Zilliqa({
    apiKey: process.env.VIEWBLOCK_API_KEY,
  });
  const res = await client.getAddressTxs(
    process.env.GAME_CONTRACT_ADDR,
    {
      page: 1,
      network: 'testnet'
    }
  );
  // logger.info(res);
  console.log(res);
};

module.exports = {
  ListenEvent,
};
