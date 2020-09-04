const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const decoded = document.getElementById("decoded");
  const networkObj = document.getElementById("network");
  const txid = document.getElementById("txid").value;
  const vout = document.getElementById("vout");
  let signature = document.getElementById("signature").value;
  const typeObj = document.getElementById("type");
  const sighashtypeObj = document.getElementById("sighashtype");
  const key = document.getElementById("key").value;
  const script = document.getElementById("script").value;
  const amountObj = document.getElementById("amount");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  const typeIdx = typeObj.selectedIndex;
  let hashType = typeObj.options[typeIdx].value;
  const sighashtypeIdx = sighashtypeObj.selectedIndex;
  let sighashType = sighashtypeObj.options[sighashtypeIdx].value;
  let network = networkValue;
  let pubkey = '';
  let redeemScript = '';
  let amount = 0;
  let commitment = '';
  let sighashAnyoneCanPay = false;

  let isElements = true;
  if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
    isElements = false;
  } else if (network === 'elementsregtest') {
    network = 'regtest';
  }

  if ((hashType === 'p2sh-p2wpkh') || (hashType === 'p2sh-p2wsh')) {
    hashType = hashType.replace('p2sh-', '');
  }
  if ((hashType === 'p2sh') || (hashType === 'p2wsh')) {
    redeemScript = script;
  }

  if (sighashType.indexOf('_anyonecanpay') >= 0) {
    sighashType = sighashType.replace('_anyonecanpay', '');
    sighashAnyoneCanPay = true;
  }

  try {
    const req = {
      privkey: key,
    };
    const resp = await callJsonApi(Module, 'GetPubkeyFromPrivkey', req);
    pubkey = resp.pubkey;
  } catch (e) {
    pubkey = key;
  }

  if (signature.length > 130) {
    try {
      const req = { signature };
      const resp = await callJsonApi(Module, 'DecodeDerSignatureToRaw', req);
      signature = resp.signature;
    } catch (e) {
      // do nothing
    }
  }

  const value = amountObj;
  if (value.value.length == 66) {
    commitment = value.value;
  } else if (value.value.length > 0) {
    amount = parseInt(value.value);
  }

  try {
    const req = {
      tx: inputTx.value,
      isElements,
      txin: {
        txid,
        vout: parseInt(vout.value),
        signature,
        pubkey,
        redeemScript,
        hashType,
        sighashType,
        sighashAnyoneCanPay,
        amount,
        confidentialValueCommitment: commitment,
      },
    };
    const resp = await callJsonApi(Module, 'VerifySignature', req);
    decoded.value = 'verify success!';
  } catch (e) {
    if ('getErrorInformation' in e) {
      decoded.value = e.getErrorInformation().message;
      if (decoded.value == 'Failed to VerifySignature. check fail.') {
        decoded.value = 'verify fail. invalid signature.';
      }
    } else {
      decoded.value = 'Invalid format';
    }
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
