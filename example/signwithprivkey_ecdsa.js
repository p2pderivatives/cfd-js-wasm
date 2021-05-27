const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  const inputTx = document.getElementById("inputTx").value;
  const networkObj = document.getElementById("network");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let network = networkObj.options[selectedNetworkIdx].value;
  const hashtypeObj = document.getElementById("type");
  const selectedHashtypeIdx = hashtypeObj.selectedIndex;
  let hashType = hashtypeObj.options[selectedHashtypeIdx].value;
  const txid = document.getElementById("txid").value;
  const vout = document.getElementById("vout").value;
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

  const privkey = document.getElementById("privkey").value;

  const value = document.getElementById("amount").value;
  if (isElements && value.length == 66) {
    commitment = value;
  } else {
    amount = parseInt(value) || 0;
  }

  try {
    const req = {
      tx: inputTx,
      isElements,
      txin: {
        txid,
        vout: parseInt(vout),
        privkey,
        hashType,
        sighashType,
        amount,
        confidentialValueCommitment: commitment,
      },
    };
    const resp = await callJsonApi(Module, 'SignWithPrivkey', req);
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
