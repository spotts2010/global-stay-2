// src/lib/logger.ts

/**
 * A simple logger for consistent output.
 * This can be expanded to integrate with services like Sentry, LogRocket, etc.
 */
export const logger = {
  log: (...args: unknown[]) => {
    console.log('[LOG]', ...args);
  },
  info: (...args: unknown[]) => {
    console.info('[INFO]', ...args);
  },
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: unknown[]) => {
    // In a real app, you might send this to a logging service
    console.error('[ERROR]', ...args);
  },
};
