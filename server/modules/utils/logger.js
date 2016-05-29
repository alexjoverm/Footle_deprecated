const WinstonLogger = require('winston').Logger;
const transports    = require('winston').transports;
const appRoot       = require('app-root-path');
const path          = require('path');

module.exports = class Logger {
  /**
   * Instantiates the logger both in console and in file
   */
  constructor() {
    this.logger = new WinstonLogger({
      transports: [
        new (transports.Console)(),
        new (transports.File)({ filename: path.join(appRoot.path, 'logs/logs.log') })
      ]
    });
  }

  log(obj) {
    this.logger.log(obj);
  }
}
