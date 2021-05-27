const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  const sighash = document.getElementById("sighash").value;
  let privkey = document.getElementById("privkey").value;

  const isEncodeDer = document.getElementById("der_encode").checked;
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

  let wif = false;
  let network = 'mainnet';
  let isCompressed = true;
  try {
    const req = {wif: privkey};
    const wifData = await callJsonApi(Module, 'GetPrivkeyFromWif', req);
    wif = true;
    network = wifData.network;
    isCompressed = wifData.isCompressed;
  } catch (e) {
    // do nothing
  }

  try {
    const req = {
      sighash,
      privkeyData: {
        privkey, wif, network, isCompressed
      },
    };
    let resp = await callJsonApi(Module, 'CalculateEcSignature', req);
    if (isEncodeDer) {
      const derReq = { signature: resp.signature, sighashType };
      resp = await callJsonApi(Module, 'EncodeSignatureByDer', derReq);
    }
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid format';
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
