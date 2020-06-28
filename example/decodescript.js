const updateField = async function(event) {
  const inputData = document.getElementById("inputData");
  const decoded = document.getElementById("decoded");

  try {
    const req = {
      script: inputData.value,
    };
    const resp = await callJsonApi(Module, 'ParseScript', req);
    decoded.value = resp.scriptItems.join('\n');
  } catch (e) {
    decoded.value = 'Invalid script format';
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
