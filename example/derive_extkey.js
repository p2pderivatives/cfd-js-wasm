const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const bip32path = document.getElementById("bip32path");
  const childNum = document.getElementById("child_num").value;
  const decoded = document.getElementById("decoded");

  let pubkey = '';
  let deriveKey = '';
  let extPubkey = '';
  const extkey = inputData.value.trim();
  let path = bip32path.value.trim();
  let network = 'testnet';
  if (extkey.startsWith('xpub') || extkey.startsWith('xprv')) {
    network = 'mainnet';
  }
  const isPriv = (extkey.startsWith('xprv') || extkey.startsWith('tprv'));
  const data = {};

  try {
    if (path.indexOf('*') > 0) {
      path = path.replace( /\*/g, childNum);
    }
    const req = {
      extkey,
      extkeyType: (isPriv) ? 'extPrivkey' : 'extPubkey',
      network,
      path,
    };
    const resp = await callJsonApi(Module, 'CreateExtkeyFromParentPath', req);
    deriveKey = resp.extkey;
    if (!isPriv) extPubkey = deriveKey;
    data['path'] = path;
    data['network'] = network;
  } catch (e) {
    console.log(e);
    decoded.value = 'Invalid input format';
    return;
  }

  if (isPriv) {
    data['extPrivkey'] = deriveKey;
    try {
      const req = {
        extkey: deriveKey,
        network,
      };
      const resp = await callJsonApi(Module, 'GetPrivkeyFromExtkey', req);
      const wif = resp.privkey;

      const reqHex = {
        wif,
      };
      const respHex = await callJsonApi(Module, 'GetPrivkeyFromWif', reqHex);
      const hex = respHex.hex;
      data['privkey'] = {
        wif,
        hex,
      };

      const req2 = {
        extkey: deriveKey,
        network,
      };
      const resp2 = await callJsonApi(Module, 'CreateExtPubkey', req2);
      extPubkey = resp2.extkey;
    } catch (e) {
    }
  }

  data['extpubkey'] = extPubkey;

  try {
    const req = {
      extkey: extPubkey,
      network,
    };
    const resp = await callJsonApi(Module, 'GetPubkeyFromExtkey', req);
    data['pubkey'] = resp.pubkey;
    const scResp = await callJsonApi(Module, 'GetSchnorrPubkeyFromPubkey', resp);
    data['schnorrPubkey'] = scResp.pubkey;
    decoded.value = JSON.stringify(data, null, '  ');
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
