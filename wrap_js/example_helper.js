/* eslint-disable require-jsdoc */
class Helper {
  constructor() {
    this.cfdjsModule = require('../index');
  }

  getResponse(result) {
    return Promise.resolve(result);
  };

  getCfdjs() {
    return this.cfdjsModule.getCfd();
  }

  initialized(func) {
    this.cfdjsModule.addInitializedListener(func);
  }
}

module.exports.default = new Helper();
