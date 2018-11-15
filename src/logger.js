'use strict';
//the default winston logger for the whole applciation.
const winston= require('winston');
const prettyPrint= function ( object ){
    return JSON.stringify(object);
};

winston.configure({
    level: process.env.LOG_LEVEL,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        // prettyPrint
    ),
    transports: [
        new winston.transports.Console()
    ]
});


