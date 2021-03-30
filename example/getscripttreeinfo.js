const updateField = async function(event) {
  const decoded = document.getElementById("decoded");
  const treeString = document.getElementById("tree").value;
  const tapscript = document.getElementById("script").value;
  const branches = document.getElementById("branches").value;
  const internalPubkey = document.getElementById("pubkey").value;
  const internalPrivkey = document.getElementById("privkey").value;
  const networkObj = document.getElementById("network");
  const selectedNetworkIdx = networkObj.selectedIndex;
  let networkValue = networkObj.options[selectedNetworkIdx].value;
  let network = networkValue;

  const nodes = [];
  const arr = branches.replaceAll(/\n|\r|,|"/g, ' ').replaceAll(/\s+/g, ' ').split(' ');
  for (const node of arr) {
    if (node && node.length == 64) nodes.push(node);
  }

  try {
    const req = {
      network,
      treeString,
      tapscript,
      nodes,
      internalPubkey,
      internalPrivkey,
    };
    const resp = await callJsonApi(Module, 'GetTapScriptTreeFromString', req);
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
