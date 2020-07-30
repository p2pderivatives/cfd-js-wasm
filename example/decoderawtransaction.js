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

const decodeBtnField = document.getElementById("execDecode");
decodeBtnField.addEventListener('click', updateField);

Module['onRuntimeInitialized'] = async function(){
  const decoded = document.getElementById("decodedtx");
  if (Module['_cfdjsJsonApi']) {
    console.log("exist cfdjsJsonApi.");
    decoded.value = "";
  } else {
    console.log("cfdjsJsonApi not found!");
    decoded.value = "WebAssembly load fail.";
  }
}

window.onload = function() {
  const decoded = document.getElementById("decodedtx");
  if (Module['_cfdjsJsonApi']) {
    decoded.value = "";
  } else {
    decoded.value = "WebAssembly loading...";
  }
}
