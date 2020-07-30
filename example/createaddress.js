const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const decoded = document.getElementById("decoded");
  const networkObj = document.getElementById("network");
  const typeObj = document.getElementById("type");
  const key = document.getElementById("key");
  const ctkey = document.getElementById("ctkey");
  const selectedNetworkIdx = networkObj.selectedIndex;
  const selectedTypeIdx = typeObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  let network = networkValue;
  let hashType = typeObj.options[selectedTypeIdx].value;

  let isElements = true;
  if ((network === 'mainnet') || (network === 'testnet') || (network === 'regtest')) {
    isElements = false;
  } else if (network === 'elementsregtest') {
    network = 'regtest';
  }
  let keyType = 'redeem_script';
  if (hashType.indexOf('pkh') > 0) {
    keyType = 'pubkey';
  }
  let addrInfo;
  try {
    const req = {
      isElements,
      keyData: {
        hex: key.value,
        type: keyType,
      },
      network,
      hashType,
    };
    addrInfo = await callJsonApi(Module, 'CreateAddress', req);
  } catch (e) {
    decoded.value = 'Invalid data format';
    return;
  }

  try {
    if (isElements && (ctkey.value.length > 0)) {
      const req = {
        unblindedAddress: addrInfo.address,
        key: ctkey.value,
      };
      const ctAddr = await callJsonApi(Module, 'GetConfidentialAddress', req);
      addrInfo['confidentialAddress'] = ctAddr.confidentialAddress;
    }
    decoded.value = JSON.stringify(addrInfo, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
  } catch (e) {
    decoded.value = 'Invalid confidential key format';
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
