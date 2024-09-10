import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n`;
    })
  ),
  defaultMeta: { service: 'deposit-tracker' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'tracker.log' })
  ]
})

export default logger;

