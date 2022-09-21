const axios = require('axios');
const httpStatus = require('http-status');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { bytes, units, BN, Long } = require('@zilliqa-js/util');
const ApiError = require('../utils/ApiError');

const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);
const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
const privateKey = process.env.ADMIN_WALLET_PRIVATEKEY;
zilliqa.wallet.addByPrivateKey(privateKey);

const generateMetadataJson = (heroParam) => {
  // eslint-disable-next-line camelcase
  const { id, item_name, star_grade, regular_lv, passive_lv, skill1_lv, skill2_lv, is_chaotic } = heroParam;
  const data = JSON.stringify({
    pinataMetadata: {
      name: `heroes-${id}.metadata.json`,
    },
    pinataContent: {
      description: `Heroes NFT #${id}`,
      // eslint-disable-next-line camelcase
      name: `${item_name}`,
      // eslint-disable-next-line camelcase
      image: `ipfs://${process.env.HEROES_ASSET_CID}/${item_name}.png`,
      'Current Star Grade Level': star_grade,
      'Regular Level': regular_lv,
      'Passive Level': passive_lv,
      'Skill One Level': skill1_lv,
      'Skill Two Level': skill2_lv,
      'Is Chaotic': is_chaotic,
    },
  });
  return data;
};

const getConfig = (data) => {
  return {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: {
      pinata_api_key: `${process.env.PINATA_API_KEY}`,
      pinata_secret_api_key: `${process.env.PINATA_SECURITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    data,
  };
};

const mintHeroTx = async (heroParam) => {
  const data = generateMetadataJson(heroParam);
  const config = getConfig(data);
  let result;
  try {
    result = await axios(config);
  } catch (e) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, e);
  }
  if (!result) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, 'Pinata Error: Error while uploading metadata');
  }
  const tokenUri = result.data['IpfsHash'];
  const heroesNFTContract = zilliqa.contracts.at(process.env.HEROES_NFT_ADDRESS);
  const to = process.env.GAME_CONTRACT_ADDR;
  try {
    const callTx = await heroesNFTContract.callWithoutConfirm(
      'Mint',
      [
        {
          vname: 'to',
          type: 'ByStr20',
          value: to,
        },
        {
          vname: 'token_uri',
          type: 'String',
          value: tokenUri,
        },
      ],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new BN(0),
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(8000),
      },
      false
    );
    console.log("transaction id======>", callTx.id);
    const confirmedTxn = await callTx.confirm(callTx.id);
    return confirmedTxn;
  } catch (e) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, e);
  }
};

module.exports = {
  mintHeroTx,
};
