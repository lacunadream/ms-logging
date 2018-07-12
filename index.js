'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.expressErrorLogger = exports.expressLogger = exports.errorFileTransport = exports.activityFileTransport = exports.errorTransport = exports.winstonExpressTransport = exports.activityTransport = undefined;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _dateformat = require('dateformat');

var _dateformat2 = _interopRequireDefault(_dateformat);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const levelConfig = {
  levels: { error: 0, warn: 1, info: 2, database: 3, debug: 4, verbose: 5, input: 6 },
  colors: { error: 'red', warn: 'yellow', info: 'green', database: 'magenta', debug: 'blue', verbose: 'cyan', input: 'grey' }
};

_winston2.default.addColors(levelConfig.colors);

const activityTransport = exports.activityTransport = new _winston2.default.transports.Console({
  name: 'all-console',
  level: 'input',
  colorize: true,
  timestamp: () => {
    return (0, _dateformat2.default)(new Date(), 'isoUtcDateTime');
  },
  formatter: options => {
    if (options.level !== 'error') {
      return `${_winston2.default.config.colorize(options.level, options.level.toUpperCase())} | ${options.timestamp()} | ${options.message || JSON.stringify(options.meta)}`;
    }
    return `${_winston2.default.config.colorize(options.level, options.level.toUpperCase())} | ${options.timestamp()} | error occured`;
  }
});

const winstonExpressTransport = exports.winstonExpressTransport = new _winston2.default.transports.Console({
  name: 'all-console',
  level: 'debug',
  colorize: true,
  timestamp: () => {
    return (0, _dateformat2.default)(new Date(), 'isoUtcDateTime');
  },
  formatter: options => {
    return `${_winston2.default.config.colorize(options.level, options.level.toUpperCase())} | ${options.timestamp()} | ${options.message} | ${options.meta.responseTime} ms | ${options.meta.res.statusCode}`;
  }
});

const errorTransport = exports.errorTransport = new _winston2.default.transports.Console({
  name: 'error-console',
  level: 'error',
  colorize: true
});

const activityFileTransport = exports.activityFileTransport = new _winston2.default.transports.File({
  name: 'all-file',
  level: 'debug',
  json: true,
  filename: './logs/activity.log',
  maxsize: 5 * 1024 * 1024,
  maxFiles: 10
});

const errorFileTransport = exports.errorFileTransport = new _winston2.default.transports.File({
  name: 'error-file',
  level: 'error',
  json: true,
  filename: './logs/error.log',
  maxsize: 5 * 1024 * 1024,
  maxFiles: 10
});

const expressLogger = exports.expressLogger = _expressWinston2.default.logger({
  transports: [winstonExpressTransport, activityFileTransport]
});

const expressErrorLogger = exports.expressErrorLogger = _expressWinston2.default.errorLogger({
  transports: [errorTransport, errorFileTransport]
});

const logger = exports.logger = new _winston2.default.Logger({
  levels: levelConfig.levels,
  transports: [activityTransport, errorTransport],
  exitOnError: false
});
