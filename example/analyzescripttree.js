const getBranchDepthFunc = function(branch) {
  if (!branch || branch.tapscript) return 1;
  const count1 = getBranchDepthFunc(branch[0]);
  const count2 = getBranchDepthFunc(branch[1]);
  if (count1 > count2) {
    return count1 + 1;
  } else {
    return count2 + 1;
  }
}

const setBranchFunc = function(branch, scriptMap, branchMap) {
  if (!branch.relatedBranchHash) return branch;

  let first = {};
  let second = {};
  const firstTarget = branch.relatedBranchHash[0];
  const secondTarget = branch.relatedBranchHash[1];
  if (scriptMap[firstTarget]) {
    first = scriptMap[firstTarget];
    delete first.hash;
  } else if (branchMap[firstTarget]) {
    first = setBranchFunc(branchMap[firstTarget], scriptMap, branchMap);
    delete second.first;
    if (first.branch) first = first.branch;
  } else {
    throw Error('unknown hash');
  }
  if (scriptMap[secondTarget]) {
    second = scriptMap[secondTarget];
    delete second.hash;
  } else if (branchMap[secondTarget]) {
    second = setBranchFunc(branchMap[secondTarget], scriptMap, branchMap);
    delete second.hash;
    if (second.branch) second = second.branch;
  } else {
    throw Error('unknown hash');
  }
  delete branch.relatedBranchHash;

  // const isFirstTop = (getBranchDepthFunc(first) > getBranchDepthFunc(second));
  const isFirstTop = (firstTarget < secondTarget);
  if (Object.keys(first).length == 0) first = 'HashOnly';
  if (Object.keys(second).length == 0) second = 'HashOnly';

  const retData = {};
  if (isFirstTop) {
    retData[firstTarget] = first;
    retData[secondTarget] = second;
    // branch['branch'] = [first, second];
  } else {
    retData[secondTarget] = second;
    retData[firstTarget] = first;
    // branch['branch'] = [second, first];
  }
  return retData;
  // return branch;
}

const updateField = async function(event) {
  const inputTx = document.getElementById("inputTx");
  const outputData = document.getElementById("outputData");

  try {
    const req = {
      treeString: inputTx.value,
    };
    const resp = await callJsonApi(Module, 'AnalyzeTapScriptTree', req);
    const scriptMap = {};
    const branchMap = {};
    let rootData = {};
    for (const branch of resp.branches) {
      if (branch) {
        if ('tapscript' in branch) {
          const scriptReq = {
            script: branch.tapscript,
          };
          const scResp = await callJsonApi(Module, 'ParseScript', scriptReq);
          const asmVal = scResp.scriptItems.join(' ');
          const tapleaf = {
            hash: branch.tapBranchHash,
            tapscript: {
              asm: asmVal,
              hex: branch.tapscript,
            },
            leafVersion: branch.leafVersion,
          };
          if (tapleaf.leafVersion == 0xc0) delete tapleaf.leafVersion;
          scriptMap[branch.tapBranchHash] = tapleaf;
          if (branch.depth == 0) rootData = tapleaf;
        } else {
          const branchData = {
            hash: branch.tapBranchHash,
          };
          if (branch.relatedBranchHash) {
            branchData['relatedBranchHash'] = branch.relatedBranchHash;
          }
          branchMap[branch.tapBranchHash] = branchData;
          if (branch.depth == 0) rootData = branchMap[branch.tapBranchHash];
        }
      }
    }

    const viewData = {};
    const hashVal = rootData.hash;
    delete rootData.hash;
    rootData = setBranchFunc(rootData, scriptMap, branchMap);
    if (Object.keys(rootData).length <= 0) {
      viewData[hashVal] = 'HashOnly';
    } else {
      viewData[hashVal] = rootData;
    }
    outputData.value = JSON.stringify(viewData, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, '  ');
    return;
  } catch (e) {
    outputData.value = 'Invalid script tree format';
  }
}

const decodeBtnField = document.getElementById("execDecode");
decodeBtnField.addEventListener('click', updateField);

Module['onRuntimeInitialized'] = async function(){
  const decoded = document.getElementById("outputData");
  if (Module['_cfdjsJsonApi']) {
    console.log("exist cfdjsJsonApi.");
    decoded.value = "";
  } else {
    console.log("cfdjsJsonApi not found!");
    decoded.value = "WebAssembly load fail.";
  }
}

window.onload = function() {
  const decoded = document.getElementById("outputData");
  if (Module['_cfdjsJsonApi']) {
    decoded.value = "";
  } else {
    decoded.value = "WebAssembly loading...";
  }
}
