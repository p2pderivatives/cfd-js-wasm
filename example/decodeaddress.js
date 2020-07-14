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
    }
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid address format';
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
