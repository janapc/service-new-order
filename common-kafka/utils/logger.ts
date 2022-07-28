import { LogEntry } from 'kafkajs';
import pino from 'pino';

interface typeLevel {
  [key: number]: string;
}

const toPinoLogLevel: typeLevel = {
  0: 'error',
  1: 'error',
  2: 'warn',
  4: 'info',
  5: 'debug',
};

const logPino = pino({
  transport: {
    target: './pino-pretty-transport',
    options: {
      colorize: true,
    },
  },
});

const logCreator = () => ({
  level, log,
}: LogEntry) => {
  const { message, ...extra } = log;
  return logPino.info({
    level: toPinoLogLevel[level],
    message,
    extra,
  });
};
export default logCreator;
