const cfdjsWasm = require('./dist/cfdjs_wasm.js');
const cfdjsWasmJsonApi = require('./cfdjs_wasm_jsonapi.js');
cfdjsWasm['preInit'] = function() {};

const wrappedModule = {};
cfdjsWasm['onRuntimeInitialized'] = async () => {
  const funcNameResult = await cfdjsWasmJsonApi.ccallCfd(cfdjsWasm,
      cfdjsWasm._cfdjsGetJsonApiNames, 'string', [], []);
  if (funcNameResult.indexOf('Error:') >= 0) {
    throw new cfdjsWasmJsonApi.CfdError(
        `cfdjsGetJsonApiNames internal error. ${funcNameResult}`);
  }
  const funcList = funcNameResult.split(',');

  // register function list
  funcList.forEach((requestName) => {
    const hook = async function(...args) {
      if (args.length > 1) {
        throw new cfdjsWasmJsonApi.CfdError('ERROR: Invalid argument passed:' +
          `func=[${requestName}], args=[${args}]`);
      }
      let arg = '';
      if (typeof args === 'undefined') {
        arg = '';
      } else if (typeof args === 'string') {
        arg = args;
      } else if (args) {
        arg = args[0];
      }
      return await cfdjsWasmJsonApi.callJsonApi(cfdjsWasm, requestName, arg);
    };

    Object.defineProperty(wrappedModule, requestName, {
      value: hook,
      enumerable: true,
    });
  });

  if ('onRuntimeInitialized' in wrappedModule) {
    wrappedModule.onRuntimeInitialized();
  }
};

module.exports = wrappedModule;
module.exports.CfdError = cfdjsWasmJsonApi.CfdError;
