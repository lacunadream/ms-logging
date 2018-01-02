import winston from 'winston';
import dateformat from 'dateformat';
import expressWinston from 'express-winston';

const levelConfig = {
  levels: { error: 0, info: 1, database: 2, debug: 3 },
  colors: { error: 'red', info: 'green', database: 'yellow', debug: 'blue' },
};

winston.addColors(levelConfig.colors);

export const activityTransport = new winston.transports.Console({
  name: 'all-console',
  level: 'debug',
  colorize: true,
  timestamp: () => {
    return dateformat(new Date(), 'isoUtcDateTime');
  },
  formatter: (options) => {
    return `${winston.config.colorize(options.level, options.level.toUpperCase())} | ${options.timestamp()} | ${options.message || JSON.stringify(options.meta)}`;
  },
});

export const winstonExpressTransport = new winston.transports.Console({
  name: 'all-console',
  level: 'debug',
  colorize: true,
  prettyPrint: (data) => {
    if (data.res !== undefined) return `${data.res.statusCode} - ${data.responseTime} ms - ${dateformat(new Date(), 'isoUtcDateTime')}`;
    return `${JSON.stringify(data)} - ${dateformat(new Date(), 'isoUtcDateTime')}`;
  },
});

export const errorTransport = new winston.transports.Console({
  name: 'error-console',
  level: 'error',
  colorize: true,
  prettyPrint: (data) => {
    if (data.res !== undefined) return `${data.res.statusCode} - ${data.responseTime} ms - ${dateformat(new Date(), 'isoUtcDateTime')}`;
    return `${JSON.stringify(data)} - ${dateformat(new Date(), 'isoUtcDateTime')}`;
  },  
});

export const activityFileTransport = new winston.transports.File({
  name: 'all-file',
  level: 'debug',
  json: true,
  filename: './logs/activity.log',
  maxsize: 5 * 1024 * 1024,
  maxFiles: 10,
});

export const errorFileTransport = new winston.transports.File({
  name: 'error-file',
  level: 'error',
  json: true,
  filename: './logs/error.log',
  maxsize: 5 * 1024 * 1024,
  maxFiles: 10,
});

export const expressLogger = expressWinston.logger({
  transports: [winstonExpressTransport, activityFileTransport],
});

export const expressErrorLogger = expressWinston.errorLogger({
  transports: [errorTransport, errorFileTransport],
});

export const logger = new winston.Logger({
  levels: levelConfig.levels,
  transports: [activityTransport],
  exitOnError: false,
});


// // Hook into error function to send error emails
// logger.on('logging', async (transport, level, message, meta) => {
//   if (level === 'error' && process.env.NODE_ENV === 'production') {
//     const stringifiedMeta = JSON.stringify(meta);
//     await sendErrorEmail((message || stringifiedMeta));
//   }
// });
