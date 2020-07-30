//
// example.js
// サンプルコード
//
const Helper = require('../example_helper').default;
const {
  CreateAddress,
  CreateKeyPair,
} = Helper.getCfdjs();
const GetResponse = Helper.getResponse;

const NET_TYPE = 'testnet';

const example = async function() {
  console.log('===== createaddress =====');

  const reqKeyPair = {
    'wif': true,
    'network': NET_TYPE,
    'isCompressed': true,
  };
  const keyPair = await GetResponse(CreateKeyPair(reqKeyPair));
  console.log('\n*** keyPair ***\n', keyPair, '\n');

  const reqP2shP2wpkh = {
    'keyData': {
      'hex': keyPair.pubkey,
      'type': 'pubkey',
    },
    'network': NET_TYPE,
    'hashType': 'p2sh-p2wpkh',
  };
  const p2shP2wpkhAddr = await GetResponse(CreateAddress(reqP2shP2wpkh));
  console.log('\n*** p2shP2wpkhAddr ***\n', p2shP2wpkhAddr, '\n');

  const reqP2wpkh = {
    'keyData': {
      'hex': keyPair.pubkey,
      'type': 'pubkey',
    },
    'network': NET_TYPE,
    'hashType': 'p2wpkh',
  };
  const p2wpkhAddr = await GetResponse(CreateAddress(reqP2wpkh));
  console.log('\n*** p2wpkhAddr ***\n', p2wpkhAddr, '\n');
};

module.exports = example;
