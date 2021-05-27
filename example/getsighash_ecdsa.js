const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  const inputTx = document.getElementById("inputTx").value;
  const networkObj = document.getElementById("network");
  const txid = document.getElementById("txid").value;
  const vout = document.getElementById("vout").value;
  const selectedNetworkIdx = networkObj.selectedIndex;
  let network = networkObj.options[selectedNetworkIdx].value;
  const hashtypeObj = document.getElementById("type");
  const selectedHashtypeIdx = hashtypeObj.selectedIndex;
  let hashType = hashtypeObj.options[selectedHashtypeIdx].value;
  const keyData = document.getElementById('script').value;
  let keyHex = keyData;
  let address = '';
  let descriptor = '';
  let amount = 0;
  let commitment = '';

  const isAnyoneCanPay = document.getElementById("anyonecanpay").checked;
  const isRangeproof = document.getElementById("rangeproof").checked;
  const sighashtypeObj = document.getElementById("sighashtype");
  const sighashtypeIdx = sighashtypeObj.selectedIndex;
  let sighashType = sighashtypeObj.options[sighashtypeIdx].value;
  if (isAnyoneCanPay) {
    sighashType = sighashType + '|anyonecanpay';
  }
  if (isRangeproof) {
    sighashType = sighashType + '|rangeproof';
  }

  let isElements = true;
  if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
    isElements = false;
  } else if (network === 'elementsregtest') {
    network = 'regtest';
  }

  try {
    const req = {
      descriptor: keyData,
      isElements,
      network,
    };
    const descData = await callJsonApi(Module, 'ParseDescriptor', req);
    if (descData.type == 'pkh' || descData.type == 'wpkh' ||
        descData.type == 'combo' || descData.hashType == 'p2sh-p2wpkh') {
      if (descData.hashType == 'p2sh-p2wpkh') {
        keyHex = descData.scripts[1].key;
      } else {
        keyHex = descData.scripts[0].key;
      }
      descriptor = keyData;
      hashType = descData.hashType;
    } else if (descData.type == 'sh' || descData.type == 'wsh') {
      keyHex = descData.redeemScript;
      descriptor = keyData;
      hashType = descData.hashType;
    } else {
      decoded.value = 'This descriptor type cannot use.';
      return;
    }
  } catch (e) {
    // do nothing
  }
  const keyType = (hashType.indexOf('pkh') > 0) ? 'pubkey' : 'redeem_script';
  if (!descriptor) {
    const req = {
      isElements,
      keyData: {
        hex: keyData,
        type: keyType,
      },
      network,
      hashType,
    };
    const addrInfo = await callJsonApi(Module, 'CreateAddress', req);
    address = addrInfo.address;
  }

  const value = document.getElementById("amount").value;
  if (isElements && value.length == 66) {
    commitment = value;
  } else {
    amount = parseInt(value) || 0;
  }

  try {
    if (isElements) {
      // elements getsighash is not implement yet.
      const req = {
        tx: inputTx,
        isElements,
        txin: {
          txid,
          vout: parseInt(vout),
          keyData: {
            hex: keyHex,
            type: keyType,
          },
          hashType,
          sighashType,
          amount,
          confidentialValueCommitment: commitment,
        },
      };
      const resp = await callJsonApi(Module, 'CreateElementsSignatureHash', req);
      decoded.value = JSON.stringify(resp, (_key, value) =>
              typeof value === 'bigint' ? value.toString() : value, '  ');
    } else {
      const req = {
        tx: inputTx,
        isElements,
        txin: {
          txid,
          vout: parseInt(vout),
          keyData: {
            hex: keyHex,
            type: keyType,
          },
          hashType,
          sighashType,
        },
        utxos: [{
          txid,
          vout: parseInt(vout),
          address,
          descriptor,
          amount,
          confidentialValueCommitment: commitment,
        }],
      };
      const resp = await callJsonApi(Module, 'GetSighash', req);
      decoded.value = JSON.stringify(resp, (_key, value) =>
              typeof value === 'bigint' ? value.toString() : value, '  ');
    }
  } catch (e) {
    decoded.value = 'Invalid transaction format';
  }
}

const decodeBtnField = document.getElementById("execDecode");
decodeBtnField.addEventListener('click', updateField);

Module['onRuntimeInitialized'] = async function(){
  const decoded = document.getElementById("decoded");
  if (Module['_cfdjsJsonApi']) {
    console.log("exist cfdjsJsonApi.");
    decoded.value = "";
  } else {
    console.log("cfdjsJsonApi not found!");
    decoded.value = "WebAssembly load fail.";
  }
}

window.onload = function() {
  const decoded = document.getElementById("decoded");
  if (Module['_cfdjsJsonApi']) {
    decoded.value = "";
  } else {
    decoded.value = "WebAssembly loading...";
  }
}
