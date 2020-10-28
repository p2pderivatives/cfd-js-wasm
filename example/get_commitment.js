const updateField = async function(event) {
  const amount = document.getElementById("amount").value;
  const vbf = document.getElementById("vbf").value;
  const abf = document.getElementById("abf").value;
  const asset = document.getElementById("asset").value;

  try {
    const req = {
      amount,
      asset,
      assetBlindFactor: abf,
      blindFactor: vbf,
    };
    const resp = await callJsonApi(Module, 'GetCommitment', req);
    decoded.value = JSON.stringify(resp, null, '  ');
  } catch (e) {
    decoded.value = 'Invalid format';
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
