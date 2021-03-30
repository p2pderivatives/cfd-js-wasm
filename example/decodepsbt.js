const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const decodedtx = document.getElementById("decodedtx");
  const detail = document.getElementById("detail");
  const simple = document.getElementById("simple");
  const networkObj = document.getElementById("network");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  let network = networkValue;

  try {
    const req = {
      psbt: inputTx.value,
      network,
      hasDetail: detail.checked,
      hasSimple: simple.checked,
    };
    const resp = await callJsonApi(Module, 'DecodePsbt', req);
    decodedtx.value = JSON.stringify(resp, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
    return;
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
