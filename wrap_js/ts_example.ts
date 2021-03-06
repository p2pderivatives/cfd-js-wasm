import * as cfdjs from '../index.js';

const initFunc = async function() {
  const cfdjsObj = cfdjs.getCfd();

  let supportFunctions: cfdjs.GetSupportedFunctionResponse;
  {
    console.log('===== Supported Function =====');
    supportFunctions = await cfdjsObj.GetSupportedFunction();
    console.log('*** Response ***\n', supportFunctions, '\n');
  }

  const NET_TYPE = 'testnet';
  {
    console.log('===== CreateKeyPair =====');
    const reqJson: cfdjs.CreateKeyPairRequest = {
      'wif': true,
      'network': NET_TYPE,
    };
    console.log('*** Request ***\n', reqJson);
    const result: cfdjs.CreateKeyPairResponse =
      await cfdjsObj.CreateKeyPair(reqJson);
    console.log('\n*** Response ***\n', result, '\n');
  }

  /* eslint-disable max-len */
  const CONTRACT_CONDS = {
    fundAmt: 5000000000, // fix fund amount (unit:satoshi), which is unconcerned fee
    feeAmt: 8000, // fix fee amount (unit:satoshi) each transaction
    payAddrAlice: 'tb1qmtjru45n7v8rklpan2vfzms7gex23d780lxkl2', // payment address for alice (your party)
    payAddrBob: 'tb1qj52arfpmwxyjwddvjhjy45nkl725h583es0mef', // payment address for bob (couter party)
    chgAddrAlice: 'tb1q6vugzhd50r3yxgejxym0yzylkpkh2qqcvjuqp4', // change address for alice (your party)
    chgAddrBob: 'tb1qy7c7fqkgags3g6j0r8naj6c8fydcaz766d0skr', // change address for bob (couter party)
  };
  /* eslint-enable max-len */
  console.log('\n===== CONTRACT_CONDS =====\n', CONTRACT_CONDS, '\n');

  // CreateMultisig
  let createMultisigResult: cfdjs.CreateMultisigResponse;
  {
    console.log('\n===== CreateMultisig =====');
    const reqJson: cfdjs.CreateMultisigRequest = {
      nrequired: 2,
      keys: [
        '0205ffcdde75f262d66ada3dd877c7471f8f8ee9ee24d917c3e18d01cee458bafe',
        '02be61f4350b4ae7544f99649a917f48ba16cf48c983ac1599774958d88ad17ec5',
      ],
      network: NET_TYPE,
      hashType: 'p2wsh',
    };
    console.log('*** Request ***\n', reqJson);
    createMultisigResult = await cfdjsObj.CreateMultisig(reqJson);
    console.log('\n*** Response ***\n', createMultisigResult, '\n');
  }

  let createRawTransactionResult: cfdjs.RawTransactionResponse;
  {
    const fundTxAmt = 5000000000n + (8000n * 2n);
    const txInAmtAlice = 3000000000n; // dummy txin amount
    const txInAmtBob = 2800000000n; // dummy txin amount

    console.log('\n===== CreateRawTransaction =====');
    const reqJson: cfdjs.CreateRawTransactionRequest = {
      version: 2,
      locktime: 0,
      txins: [
        {
          txid: '86dc9d4a8764c8658f24ab0286f215abe443f98221c272e1999c56e902c9a6ac',
          vout: 0,
        }, {
          txid: 'd99c1749f81555ac372e3884251c9c758004516b05e5108db38f48bc626aa933',
          vout: 1,
        },
      ],
      txouts: [
        {
          address: createMultisigResult.address,
          amount: fundTxAmt,
        }, {
          address: 'tb1q6vugzhd50r3yxgejxym0yzylkpkh2qqcvjuqp4',
          amount: txInAmtAlice - fundTxAmt / 2n,
        }, {
          address: 'tb1qy7c7fqkgags3g6j0r8naj6c8fydcaz766d0skr',
          amount: txInAmtBob - fundTxAmt / 2n,
        },
      ],
    };
    console.log('*** Request ***\n', reqJson);
    createRawTransactionResult = await cfdjsObj.CreateRawTransaction(reqJson);
    console.log('\n*** Response ***\n', createRawTransactionResult, '\n');
    const decodeResult: cfdjs.DecodeRawTransactionResponse =
        await cfdjsObj.DecodeRawTransaction({
          hex: createRawTransactionResult.hex,
        });
    console.log('\n*** Decode ***\n', JSON.stringify(decodeResult, null, '  '), '\n');
  }

  // CreateMultisig on error
  {
    console.log('\n===== CreateMultisig (error) =====');
    const reqJson: cfdjs.CreateMultisigRequest = {
      nrequired: 2,
      keys: [
        '0205ffcdde75f262d66ada3dd877c7471f8f8ee9ee24d917c3e18d01cee458bafe',
        '02be61f4350b4ae7544f99649a917f48ba16cf48c983ac1599774958d88ad17ec5',
      ],
      network: 'invalidNetwork',
      hashType: 'p2wsh',
    };
    try {
      console.log('*** Request ***\n', reqJson);
      await cfdjsObj.CreateMultisig(reqJson);
      console.log('\n*** Error! current route is fail pattern. ***\n');
    } catch (e) {
      if (e instanceof cfdjs.CfdError) {
        console.log('receive CfdError. errInfo:', e.getErrorInformation());
      } else {
        console.log('exception type check error.');
        console.log(e);
      }
    }
  }
};
cfdjs.addInitializedListener(initFunc);
