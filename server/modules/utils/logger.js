import { Logger as WinstonLogger, transports } from 'winston';
import appRoot from 'app-root-path';
import path from 'path';

export default class Logger {
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
