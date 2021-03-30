const updateField = async function(event) {
  const signature = document.getElementById("signature").value;
  const pubkey = document.getElementById("key").value;
  const message = document.getElementById("message").value;

  try {
    const req = {
      message,
      isHashed: true,
      signature,
      pubkey,
    };
    const resp = await callJsonApi(Module, 'SchnorrVerify', req);
    if (resp.valid) {
      decoded.value = 'verify success!';
    } else {
      decoded.value = 'verify fail. invalid signature.';
    }
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
