import { createLogger, format, transports } from 'winston'
const { combine, timestamp, printf } = format

// Custom format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

// Custom winston logger
const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), format.errors({ stack: true }), format.json()),
  transports: [
    // Write all logs with level `error` and below to error file
    new transports.File({
      dirname: 'logs',
      filename: 'error.log',
      level: 'error',
    }),

    // Write all logs with level `info` and below to combined file
    new transports.File({
      dirname: 'logs',
      filename: 'combined.log',
    }),

    // Log to console
    new transports.Console({
      format: combine(format.colorize(), myFormat),
    }),
  ],
})

export default logger
