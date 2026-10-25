/**
 * Simple logger utility for the bot.
 * Provides timestamped log messages to stdout.
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

const timestamps = new Set<string>();

export function log(message: string, level: LogLevel = LogLevel.INFO): void {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} [${level}] ${message}`;
  
  switch (level) {
    case LogLevel.ERROR:
      console.error(entry);
      break;
    case LogLevel.WARN:
      console.warn(entry);
      break;
    default:
      console.log(entry);
  }
}
