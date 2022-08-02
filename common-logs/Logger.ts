import pino, { Logger as LoggerType } from 'pino';
import pretty from 'pino-pretty';

type Types = 'info' | 'error' | 'debug' | 'warn';

export default class Logger {
  #logger: LoggerType;

  constructor() {
    this.#logger = Logger.#logCreator();
  }

  static #logCreator(): LoggerType {
    const stream = pretty({
      colorize: true,
      ignore: 'pid,hostname',
      customPrettifiers: {
        time: (timestamp) => `${timestamp}`,
      },
    });

    return pino(stream);
  }

  log(message: string, type: Types) {
    this.#logger[type](message);
  }
}
