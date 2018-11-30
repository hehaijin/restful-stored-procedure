'use strict';
require('./logger');
require('../envConfig');
const restify = require('restify');
const logger = require('winston');
const debug = require('debug')('ws:server');
const morgan = require('morgan');
const express= require('express');
const cors = require('cors');

var getDefinitions=require('./procedureDefinition');

const server = express();


server.use(cors());
//server.use(restify.plugins.acceptParser(server.acceptable));
//server.use(restify.plugins.queryParser());
//server.use(restify.plugins.bodyParser());

server.get('/echo/:name', function (req, res, next) {
    res.send(req.params);
    return next();
});


const sqlWorker = require('./sqlWorker');

const createRoutes = require('./router');
createRoutes(server);


server.listen(8080, function () {
    logger.info(server.name + ' listening at ' + server.url);
});