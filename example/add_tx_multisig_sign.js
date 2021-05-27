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
  let keyHex = keyData;
  let descriptor = '';

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
    if (descData.includeMultisig == true &&
        (descData.hashType == 'p2sh' || descData.hashType == 'p2sh-p2wsh'
         || descData.hashType == 'p2wsh')) {
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
  const isWitness = !(hashType == 'p2sh');
  if (!descriptor) {
    const req = {
      isElements,
      redeemScript: keyHex,
      network,
      hashType: 'p2pkh',
    };
    await callJsonApi(Module, 'GetAddressesFromMultisig', req);
  }

  const pubkeys = document.getElementsByName('pubkey');
  for (let i = 1; i <= pubkeys.length; i++) {
    const pubkeyId = `pubkey${i}`;
    const sigId = `signature${i}`;
    const hex = document.getElementById(sigId).value;
    const relatedPubkey = document.getElementById(pubkeyId).value;
    signParams.push({hex, relatedPubkey, derEncode: false});
  }

  try {
    const req = {
      tx: inputTx,
      isElements,
      txin: {
        txid,
        vout: parseInt(vout),
        signParams,
        redeemScript: (isWitness) ? '' : keyHex,
        witnessScript: (isWitness) ? keyHex : '',
        hashType,
      },
    };
    const resp = await callJsonApi(Module, 'AddMultisigSign', req);
    decoded.value = JSON.stringify(resp, (_key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
  } catch (e) {
    decoded.value = 'Invalid transaction format';
  }
}

const decodeBtnField = document.getElementById("execDecode");
decodeBtnField.addEventListener('click', updateField);

const addField = async function(event) {
  const pubkeys = document.getElementsByName('pubkey');
  if (pubkeys.length >= 20) return;
  const idCount = pubkeys.length + 1;

  const newItem = document.createElement("div");
  newItem.innerHTML = `Signature${idCount}: <input type="text" name="signature" id="signature${idCount}" value="" class="input" /><br>Pubkey${idCount}(option): <input type="text" name="pubkey" id="pubkey${idCount}" value="" class="input" /><br>`;

  const multisigField = document.getElementById('multisig');
  multisigField.appendChild(newItem);
}

const addFieldBtnField = document.getElementById("addField");
addFieldBtnField.addEventListener('click', addField);

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
