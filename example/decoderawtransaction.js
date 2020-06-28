const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const decodedtx = document.getElementById("decodedtx");
  try {
    const req = {
      hex: inputTx.value,
      network: 'liquidregtest',
      mainchainNetwork: 'regtest',
    };
    const resp = await callJsonApi(Module, 'ElementsDecodeRawTransaction', req);
    decodedtx.value = JSON.stringify(resp, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
    return;
  } catch (e) {
  }

  try {
    const req = {
      hex: inputTx.value,
      network: 'regtest',
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
