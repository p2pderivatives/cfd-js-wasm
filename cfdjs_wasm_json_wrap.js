const cfdjsWasmJson = require('./cfdjs_wasm_json.js');

const wrappedModule = {};
let hasLoaded = false;
cfdjsWasmJson['onRuntimeInitialized'] = async () => {
  if ('onRuntimeInitialized' in wrappedModule) {
    wrappedModule.onRuntimeInitialized();
  }
  hasLoaded = true;
};

wrappedModule['addInitializedListener'] = function(func) {
  if (hasLoaded) {
    if (func) func();
  } else {
    wrappedModule['onRuntimeInitialized'] = func;
  }
};

wrappedModule['getCfd'] = function() {
  return cfdjsWasmJson;
};

wrappedModule['hasLoadedWasm'] = function() {
  return hasLoaded;
};

wrappedModule['CfdError'] = cfdjsWasmJson.CfdError;

module.exports = wrappedModule;
