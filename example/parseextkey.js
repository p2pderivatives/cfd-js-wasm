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
