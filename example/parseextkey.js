const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const decoded = document.getElementById("decoded");

  let pubkey = '';
  let privkey = '';
  let network = 'testnet';
  if (inputData.value.startsWith('xpub') || inputData.value.startsWith('xprv')) {
    network = 'mainnet';
  }
  try {
    const req = {
      extkey: inputData.value,
      network,
    };
    const resp = await callJsonApi(Module, 'GetPubkeyFromExtkey', req);
    pubkey = resp.pubkey;
  } catch (e) {
  }

  if (inputData.value.startsWith('xprv') || inputData.value.startsWith('tprv')) {
    try {
      const req = {
        extkey: inputData.value,
        network,
      };
      const resp = await callJsonApi(Module, 'GetPrivkeyFromExtkey', req);
      privkey = resp.privkey;
    } catch (e) {
    }
  }

  try {
    const req = {
      extkey: inputData.value,
    };
    const resp = await callJsonApi(Module, 'GetExtkeyInfo', req);
    if (pubkey) resp['pubkey'] = pubkey;
    if (privkey) resp['privkey'] = privkey;
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid script format';
  }
}

Module['onRuntimeInitialized'] = async function(){
  if (Module['_cfdjsJsonApi']) {
    const decodeBtn = document.getElementById("execDecode");
    decodeBtn.addEventListener('click', updateField);
    console.log("exist cfdjsJsonApi.");
  } else {
    console.log("cfdjsJsonApi not found!");
    const decoded = document.getElementById("decoded");
    decoded.value = "WebAssembly load fail.";
  }
}
