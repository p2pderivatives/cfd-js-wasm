const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const decoded = document.getElementById("decoded");

  try {
    const req = {
      address: inputData.value.trim(),
      isElements: false,
    };
    const resp = await callJsonApi(Module, 'GetAddressInfo', req);
    decoded.value = JSON.stringify(resp, null, '  ');
    return;
  } catch (e) {
  }

  try {
    const req = {
      address: inputData.value.trim(),
      isElements: true,
    };
    const resp = await callJsonApi(Module, 'GetAddressInfo', req);
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
    const decodedtx = document.getElementById("decoded");
    decodedtx.value = "WebAssembly load fail.";
  }
}
