const updateField = async function(event) {
  const message = document.getElementById("message");
  const decoded = document.getElementById("decoded");
  const typeObj = document.getElementById("base64_type");
  let selectedType = typeObj.options[typeObj.selectedIndex].value;

  try {
    if (selectedType == 'encode') {
      const req = {
        hex: message.value,
      };
      const resp = await callJsonApi(Module, 'EncodeBase64', req);
      decoded.value = resp.base64;
    } else {
      const req = {
        base64: message.value,
      };
      const resp = await callJsonApi(Module, 'DecodeBase64', req);
      decoded.value = resp.hex;
    }
  } catch (e) {
    decoded.value = 'Invalid data';
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
