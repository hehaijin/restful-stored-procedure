#!/usr/bin/env node
'use strict'
const fs=require('fs');
const program = require('commander');
const express = require('express');
const cors = require('cors');
const server = express();
const createRoutes = require('../index');
const logger= require('../src/logger');

logger.info("starting");

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


console.log(config);
server.use(cors());
server.use(express.json({type: '*/*'}));
createRoutes(server, config).catch(err=> console.log(err));
server.listen(8080, function (err) {
    if(err) {
        console.log(err);
        return;
    }
    logger.info(server.name + ' listening at ' + '8080');
});
