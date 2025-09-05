import winston from "winston";
import path from "path";

// Define log levels
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	debug: 3,
};

// Define colors for each level
const colors = {
	error: "red",
	warn: "yellow",
	info: "green",
	debug: "blue",
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define the format for console output
const consoleFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.colorize({ all: true }),
	winston.format.printf(({ timestamp, level, message, ...meta }) => {
		const metaStr = Object.keys(meta).length
			? JSON.stringify(meta, null, 2)
			: "";
		return `${timestamp} [${level}]: ${message} ${metaStr}`;
	})
);

// Define the format for file output
const fileFormat = winston.format.combine(
	winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	winston.format.errors({ stack: true }),
	winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || "info",
	levels,
	format: fileFormat,
	defaultMeta: { service: "website-builder-api" },
	transports: [
		// Console transport
		new winston.transports.Console({
			format: consoleFormat,
			silent:
				process.env.NODE_ENV === "production" &&
				process.env.ENABLE_CONSOLE_LOGS !== "true",
		}),
		// File transports
		new winston.transports.File({
			filename: path.join(process.env.LOG_DIR || "./logs", "error.log"),
			level: "error",
			format: fileFormat,
			silent: process.env.ENABLE_FILE_LOGS !== "true",
		}),
		new winston.transports.File({
			filename: path.join(process.env.LOG_DIR || "./logs", "combined.log"),
			format: fileFormat,
			silent: process.env.ENABLE_FILE_LOGS !== "true",
		}),
	],
	// Handle exceptions and rejections
	exceptionHandlers: [
		new winston.transports.File({
			filename: path.join(process.env.LOG_DIR || "./logs", "exceptions.log"),
			silent: process.env.ENABLE_FILE_LOGS !== "true",
		}),
	],
	rejectionHandlers: [
		new winston.transports.File({
			filename: path.join(process.env.LOG_DIR || "./logs", "rejections.log"),
			silent: process.env.ENABLE_FILE_LOGS !== "true",
		}),
	],
});

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

export default logger;
