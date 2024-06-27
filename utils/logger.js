const winston = require('winston');

// Define your logger configuration
const logger = winston.createLogger({
    level: 'debug', // Set the log level (e.g., 'info', 'debug', 'error')
    format: winston.format.json(), // Use JSON format for logs
    transports: [
        new winston.transports.Console(), // Output logs to the console
        new winston.transports.File({ filename: 'logs.log' }) // Output logs to a file
    ]
});

module.exports = logger;