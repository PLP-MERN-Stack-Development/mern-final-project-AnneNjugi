// Simple logging utility

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = process.env.LOG_LEVEL ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] : LOG_LEVELS.INFO;

/**
 * Format log message with timestamp
 */
function formatMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${message}${metaStr}`;
}

/**
 * Log error messages
 */
export function logError(message, meta = {}) {
  if (currentLogLevel >= LOG_LEVELS.ERROR) {
    console.error(formatMessage('ERROR', message, meta));
  }
}

/**
 * Log warning messages
 */
export function logWarn(message, meta = {}) {
  if (currentLogLevel >= LOG_LEVELS.WARN) {
    console.warn(formatMessage('WARN', message, meta));
  }
}

/**
 * Log info messages
 */
export function logInfo(message, meta = {}) {
  if (currentLogLevel >= LOG_LEVELS.INFO) {
    console.log(formatMessage('INFO', message, meta));
  }
}

/**
 * Log debug messages
 */
export function logDebug(message, meta = {}) {
  if (currentLogLevel >= LOG_LEVELS.DEBUG) {
    console.log(formatMessage('DEBUG', message, meta));
  }
}

/**
 * Express middleware for request logging
 */
export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const meta = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    };

    if (res.statusCode >= 400) {
      logError(`Request failed: ${req.method} ${req.url}`, meta);
    } else {
      logInfo(`Request completed: ${req.method} ${req.url}`, meta);
    }
  });

  next();
}