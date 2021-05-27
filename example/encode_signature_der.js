const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  let signature = document.getElementById("signature").value;
  const isAnyoneCanPay = document.getElementById("anyonecanpay").checked;
  const isRangeproof = document.getElementById("rangeproof").checked;
  const sighashtypeObj = document.getElementById("sighashtype");
  const sighashtypeIdx = sighashtypeObj.selectedIndex;
  let sighashType = sighashtypeObj.options[sighashtypeIdx].value;
  if (isAnyoneCanPay) {
    sighashType = sighashType + '|anyonecanpay';
  }
  if (isRangeproof) {
    sighashType = sighashType + '|rangeproof';
  }

  try {
    const req = {
      signature, sighashType,
    };
    const resp = await callJsonApi(Module, 'EncodeSignatureByDer', req);
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
