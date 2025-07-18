import path from "path";
import fs from 'fs';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import config from "../../configs/config";

// Create logs directory if it does not exist
const logDir = path.resolve(__dirname, "../../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

/**
 * Custom format for enumerating error stack traces.
 * Enhances error logs by printing the full stack trace when needed.
 */
const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

/**
 * Logger configuration object
 * - Determines log levels, formatting, and transport options.
 */
export const logger = winston.createLogger({
  // Log level is set based on the environment (default: 'info')
  level: config.logLevel,
  format: winston.format.combine(
    enumerateErrorFormat(), // Enhance error output
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
    config.env !== "production"
      ? winston.format.colorize() // Colorized output for development
      : winston.format.uncolorize(),
    winston.format.splat(), // Support for printf-style messages
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    ) // Custom log format
  ),
  transports: [
    // Console transport for real-time logs
    new winston.transports.Console({
      stderrLevels: ["error"], // Output errors to STDERR
    }),
    // Daily rotating debug log file
    new winstonDaily({
      level: "debug", // Only logs 'debug' level and below (e.g., debug, info)
      datePattern: "YYYY-MM-DD",
      dirname: path.join(logDir, "debug"), // Save in /logs/debug
      filename: `%DATE%.log`, // Log filename format
      maxFiles: "30d", // Retain logs for 30 days
      json: false,
      zippedArchive: true, // Compress old log files
    }),
    // Daily rotating error log file
    new winstonDaily({
      level: "error", // Only logs 'error' level
      datePattern: "YYYY-MM-DD",
      dirname: path.join(logDir, "error"), // Save in /logs/error
      filename: `%DATE%.log`, // Log filename format
      maxFiles: "30d", // Retain logs for 30 days
      handleExceptions: true, // Catch and log unhandled exceptions
      json: false,
      zippedArchive: true, // Compress old log files
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
});