const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const decoded = document.getElementById("decoded");
  let address = inputData.value.trim();

  try {
    const req = {
      address,
      isElements: false,
    };
    const resp = await callJsonApi(Module, 'GetAddressInfo', req);
    decoded.value = JSON.stringify(resp, null, '  ');
    return;
  } catch (e) {
  }

  let confidentialKey = '';
  try {
    const req = {
      confidentialAddress: address,
    };
    const resp = await callJsonApi(Module, 'GetUnblindedAddress', req);
    confidentialKey = resp.confidentialKey;
    address = resp.unblindedAddress;
  } catch (e) {
  }

  try {
    const req = {
      address,
      isElements: true,
    };
    const resp = await callJsonApi(Module, 'GetAddressInfo', req);
    if (confidentialKey.length > 0) {
      resp['confidentialKey'] = confidentialKey;
      resp['address'] = address;
    }
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid address format';
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
