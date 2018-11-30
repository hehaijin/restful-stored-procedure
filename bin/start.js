#!/usr/bin/env node
'use strict'

const fs= require('fs');
const program = require('commander');
const pkg= require('../package.json');
console.log("starting");

program.version(pkg.version)
    .description(pkg.description)
    .usage('[options] <command> [...]')
    .option('-c, --config <filename>', 'file name','config.json')
    .option('-p, --port <portnumber>', 'http port number', 80)

program.parse(process.argv);
console.log(program.args)
if(!program.args.length){
    program.help();
}
console.log(program.config)
console.log(program.port)

module.exports = require('../src/server.js');
