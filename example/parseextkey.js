const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const decoded = document.getElementById("decoded");

  let pubkey = '';
  let privkey = '';
  let extpubkey = '';
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
      const wif = resp.privkey;

      const reqHex = {
        wif,
      };
      const respHex = await callJsonApi(Module, 'GetPrivkeyFromWif', reqHex);
      const hex = respHex.hex;
      privkey = {
        wif,
        hex,
      };

      const req2 = {
        extkey: inputData.value,
        network,
      };
      const resp2 = await callJsonApi(Module, 'CreateExtPubkey', req2);
      extpubkey = resp2.extkey;
    } catch (e) {
    }
  }

  try {
    const req = {
      extkey: inputData.value,
    };
    const resp = await callJsonApi(Module, 'GetExtkeyInfo', req);
    if (privkey) resp['privkey'] = privkey;
    if (extpubkey) resp['xpub'] = extpubkey;
    if (pubkey) {
      resp['pubkey'] = pubkey;
      const scReq = {
        pubkey: pubkey,
      };
      const scResp = await callJsonApi(Module, 'GetSchnorrPubkeyFromPubkey', scReq);
      resp['schnorrPubkey'] = scResp.pubkey;
    }
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
