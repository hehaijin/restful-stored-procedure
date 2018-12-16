#!/usr/bin/env node
'use strict'
const fs=requrie('fs');
const program = require('commander');
const express = require('express');
const cors = require('cors');
const server = express();
const createRoutes = require('./router');


console.log("starting");

//import {Command} from 'commander';
//const program = new Command();

program
    .version('0.1.0')
    // capitalize options are different set from lowercase options
    .option('-U, --user <username>', 'user name')
    .option('-P, --password <password>', 'password')
    .option('-S, --server <server address>', 'server address')
    .option('-D, --database <database>', 'database')
    .option('-N, --databaseport <port>', 'database port', 1433)
    .option('-c, --config <filename>', 'config file', 'config.json')
    .option('-p, --port <portnumber>', 'http port', 80)
    .parse(process.argv);


let config;
if (program.user || program.password || program.database || program.server) {
    if (!(program.user && program.password && program.database && program.server)) {
        logger.error(`user, password, server, database must all be
             provided in commandline when not using a config file!`);
        throw new Error('username, password, server, database are all required');
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
    config = JSON.parse(fs.readFileSync(program.config, 'utf-8'));
}
const configDetail = {
    options: {
        encrypt: true
    },
    useUTC: false,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

Object.assign(config, configDetail);
server.use(cors());
createRoutes(server);
server.listen(8080, function () {
    logger.info(server.name + ' listening at ' + server.url);
});
