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

const generateHeroMetadataJson = (heroParam) => {
  // eslint-disable-next-line camelcase
  const { unique_id, item_name, star_grade, regular_lv, passive_lv, skill1_lv, skill2_lv, is_chaotic } = heroParam;
  const data = JSON.stringify({
    pinataMetadata: {
      // eslint-disable-next-line camelcase
      name: `heroes-${unique_id}.metadata.json`,
    },
    pinataContent: {
      // eslint-disable-next-line camelcase
      description: `Heroes NFT #${unique_id}`,
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

const generateGearMetadataJson = (gearParam) => {
  const {
    unique_id,
    item_name,
    star_grade,
    main_stat,
    sub_stat1,
    sub_stat2,
    sub_stat3,
    sub_stat4,
    sub_stat5,
    set,
    is_chaotic,
  } = gearParam;
  let contentData = {
    // eslint-disable-next-line camelcase
    description: `Gears NFT #${unique_id}`,
    // eslint-disable-next-line camelcase
    name: `${item_name}`,
    // eslint-disable-next-line camelcase
    image: `ipfs://${process.env.GEARS_ASSET_CID}/${item_name}.png`,
    'Current Star Grade Level': star_grade,
    'Main Stat': main_stat,
    'Is Chaotic': is_chaotic,
  };
  // eslint-disable-next-line camelcase
  if (sub_stat1) {
    // eslint-disable-next-line camelcase
    contentData['Sub Stat One'] = sub_stat1;
  }
  // eslint-disable-next-line camelcase
  if (sub_stat2) {
    // eslint-disable-next-line camelcase
    contentData['Sub Stat Two'] = sub_stat2;
  }
  // eslint-disable-next-line camelcase
  if (sub_stat3) {
    // eslint-disable-next-line camelcase
    contentData['Sub Stat Three'] = sub_stat3;
  }
  // eslint-disable-next-line camelcase
  if (sub_stat4) {
    // eslint-disable-next-line camelcase
    contentData['Sub Stat Four'] = sub_stat4;
  }
  // eslint-disable-next-line camelcase
  if (sub_stat5) {
    // eslint-disable-next-line camelcase
    contentData['Sub Stat Five'] = sub_stat5;
  }
  // eslint-disable-next-line camelcase
  if (set) {
    contentData.Set = set;
  }
  const data = JSON.stringify({
    pinataMetadata: {
      // eslint-disable-next-line camelcase
      name: `gears-${unique_id}.metadata.json`,
    },
    pinataContent: contentData,
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
  const data = generateHeroMetadataJson(heroParam);
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
  const gearsNFTContract = zilliqa.contracts.at(process.env.GEARS_NFT_ADDRESS);
  const to = process.env.GAME_CONTRACT_ADDR_BYSTR20;
  try {
    const callTx = await gearsNFTContract.callWithoutConfirm(
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
    const confirmedTxn = await callTx.confirm(callTx.id);
    return confirmedTxn;
  } catch (e) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, e);
  }
};

const mintGearTx = async (gearParam) => {
  const data = generateGearMetadataJson(gearParam);
  console.log("data===========>", data);
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
  const to = process.env.GAME_CONTRACT_ADDR_BYSTR20;
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
    const confirmedTxn = await callTx.confirm(callTx.id);
    return confirmedTxn;
  } catch (e) {
    throw new ApiError(httpStatus.EXPECTATION_FAILED, e);
  }
};

module.exports = {
  mintHeroTx,
  mintGearTx,
};
