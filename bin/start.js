#!/usr/bin/env node
'use strict'
const fs = require('fs');
const program = require('commander');
const express = require('express');
const cors = require('cors');
const server = express();
const createRoutes = require('../index');
const logger = require('../src/logger');

logger.info("Starting progam");

program
    .version('0.6.0')
    // capitalize options are different set from lowercase options
    .option('-U, --user <username>', 'user name')
    .option('-P, --password <password>', 'password')
    .option('-S, --server <server address>', 'server address')
    .option('-D, --database <database>', 'database')
    .option('-N, --databaseport <port>', 'database port', 1433)
    .option('-c, --config <filename>', 'config file', 'config.json')
    .option('-p, --port <portnumber>', 'http port', 8080)
    .parse(process.argv);


let config;

if (program.user || program.password || program.database || program.server) {
    if (!(program.user && program.password && program.database && program.server)) {
        logger.error(`user, password, server, database must all be
             provided in commandline when not using a config file!`);
    } else {
        config = {
            user: program.user,
            password: program.password,
            server: program.server,
            database: program.database,
            port: program.databaseport
        };
    }
} else {
    try{
    config = JSON.parse(fs.readFileSync(program.config, 'utf-8'));
    }catch(err){
        logger.error("Failed to read file");
        logger.error(err.message);
    }

}

logger.info('Configuration: ' + JSON.stringify(config));
server.use(cors());
server.use(express.json({ type: '*/*' }));
createRoutes(server, config).catch(err => {
    logger.error(err.message);
    process.exit(1);
});
server.listen(program.port, function (err) {
    if (err) {
        logger.error(err.message);
        process.exit(1);
    }
    logger.info('HTTP server' + ' listening at ' + program.port);
});
