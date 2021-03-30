const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  const tapscript = document.getElementById("script").value;
  const controlBlock = document.getElementById("control").value;
  const networkObj = document.getElementById("network");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  let network = networkValue;

  try {
    const req = {
      network,
      tapscript,
      controlBlock,
    };
    const resp = await callJsonApi(Module, 'GetTapScriptTreeInfoByControlBlock', req);
    decoded.value = JSON.stringify(resp, null, '  ');
    return;
  } catch (e) {
    decoded.value = 'Invalid tree format';
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
