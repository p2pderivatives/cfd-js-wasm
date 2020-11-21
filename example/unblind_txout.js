const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const decoded = document.getElementById("decoded");
  const vout = document.getElementById("vout");
  const key = document.getElementById("key");

  try {
    const req = {
      tx: inputTx.value,
      txouts: [{
        index: vout.value,
        blindingKey: key.value,
      }],
    };
    const resp = await callJsonApi(Module, 'UnblindRawTransaction', req);
    decoded.value = JSON.stringify(resp.outputs[0], (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
  } catch (e) {
    decoded.value = 'Invalid transaction format';
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
