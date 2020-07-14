const cfdjsWasmJson = require('./cfdjs_wasm_json.js');

const wrappedModule = {};
cfdjsWasmJson['onRuntimeInitialized'] = async () => {
  if ('onRuntimeInitialized' in wrappedModule) {
    wrappedModule.onRuntimeInitialized();
  }
};

wrappedModule['addInitializedListener'] = function(func) {
  wrappedModule['onRuntimeInitialized'] = func;
};

wrappedModule['getCfd'] = function() {
  return cfdjsWasmJson;
};

module.exports = wrappedModule;
