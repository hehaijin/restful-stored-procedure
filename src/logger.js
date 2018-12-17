'use strict';
//the default winston logger for the whole applciation.
const winston= require('winston');
const myFormat = winston.format.printf((info) => {
    return `[${info.level}]: ${info.message} `;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.splat(),
        // winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
        myFormat
        // prettyPrint
    ),
    transports: [
        new winston.transports.Console()
    ]
});

module.exports=logger;