const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const decodedtx = document.getElementById("decodedtx");
  const networkObj = document.getElementById("network");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  let network = networkValue;

  try {
    let mainchainNetwork = 'regtest';
    network = 'regtest';
    if ((networkValue === 'mainnet') || (networkValue === 'liquidv1')) {
      network = 'liquidv1';
      mainchainNetwork = 'mainnet';
    }
    const req = {
      hex: inputTx.value,
      network,
      mainchainNetwork,
    };
    const resp = await callJsonApi(Module, 'ElementsDecodeRawTransaction', req);
    decodedtx.value = JSON.stringify(resp, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
    return;
  } catch (e) {
  }

  try {
    network = networkValue;
    if (networkValue === 'liquidv1') {
      network = 'mainnet';
    } else if (networkValue === 'elementsregtest') {
      network = 'regtest';
    }
    const req = {
      hex: inputTx.value,
      network,
    };
    const resp = await callJsonApi(Module, 'DecodeRawTransaction', req);
    decodedtx.value = JSON.stringify(resp, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
  } catch (e) {
    decodedtx.value = 'Invalid transaction format';
  }
}

Module['onRuntimeInitialized'] = async function(){
  if (Module['_cfdjsJsonApi']) {
    const decodeBtn = document.getElementById("execDecode");
    decodeBtn.addEventListener('click', updateField);
    console.log("exist cfdjsJsonApi.");
  } else {
    console.log("cfdjsJsonApi not found!");
    const decodedtx = document.getElementById("decodedtx");
    decodedtx.value = "WebAssembly load fail.";
  }
}
