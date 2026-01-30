import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const createLogger = (module?: string) => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const moduleStr = module ? `[${module}] ` : '';
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
          return `${timestamp} ${level}: ${moduleStr}${message} ${metaStr}`;
        })
      ),
    }),
  ];

  // Add file transport in production
  if (process.env.NODE_ENV === 'production') {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      })
    );
  }

  return winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    transports,
  });
};

export const logger = createLogger('app');
