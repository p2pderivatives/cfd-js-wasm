const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  const inputTx = document.getElementById("inputTx").value;
  const txid = document.getElementById("txid").value;
  const vout = document.getElementById("vout").value;
  const networkObj = document.getElementById("network");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let network = networkObj.options[selectedNetworkIdx].value;
  const hashtypeObj = document.getElementById("type");
  const selectedHashtypeIdx = hashtypeObj.selectedIndex;
  let hashType = hashtypeObj.options[selectedHashtypeIdx].value;
  const signParams = [];
  const keyData = document.getElementById('script').value;
  const sigData = document.getElementById('stack').value;
  let keyHex = keyData;
  let descriptor = '';

  let isElements = true;
  if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
    isElements = false;
  } else if (network === 'elementsregtest') {
    network = 'regtest';
  }

  let isMultisig = false;
  if (keyData) {
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
  }
  const keyType = (hashType.indexOf('pkh') > 0) ? 'pubkey' : 'redeem_script';
  const isWitness = !(hashType == 'p2pkh' || hashType == 'p2sh');
  if (keyData) {
    if (!descriptor) {
      const req = {
        isElements,
        keyData: {
          hex: keyHex,
          type: keyType,
        },
        network,
        hashType,
      };
      await callJsonApi(Module, 'CreateAddress', req);
    }
    if (keyType == 'redeem_script') {
      try {
        const req = {
          isElements,
          redeemScript: keyHex,
          network,
          hashType: 'p2pkh',
        };
        const resp = await callJsonApi(Module, 'GetAddressesFromMultisig', req);
        if (resp.addresses.length > 0) isMultisig = true;
      } catch (e) {
        // do nothing
      }
    }
  }

  const arr = sigData.replaceAll(/\r\n|\n|\r|,|"/g, ' ').split(' ');
  let isFirst = true;
  for (const stackData of arr) {
    if (stackData != undefined) {
      if (isFirst && isMultisig && stackData.length > 130) {
        if (isWitness) {
          signParams.push({hex: ''});
        } else {
          signParams.push({hex: 'OP_0'});
        }
      }
      if (isFirst && isMultisig && (!stackData || stackData == '00'
          || stackData == 'OP_0')) {
        if (isWitness) {
          signParams.push({hex: ''});
        } else {
          signParams.push({hex: 'OP_0'});
        }
      } else if (stackData.indexOf('OP_') >= 0) {
        signParams.push({hex: stackData.replaceAll(/\s+/g, '')});
      } else {
        signParams.push({
          hex: stackData.replaceAll(/\s+/g, ''),
          type: 'binary',
        });
      }
      isFirst = false;
    }
  }

  if (keyData) {
    signParams.push({
      hex: keyHex,
      type: keyType,
    });
  }

  try {
    const req = {
      tx: inputTx,
      isElements,
      txin: {
        txid,
        vout: parseInt(vout),
        isWitness,
        signParams,
      },
    };
    const resp = await callJsonApi(Module, 'AddSign', req);
    decoded.value = JSON.stringify(resp, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
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
