'use strict'
const config = require('../Config');  // specify database and credentials
const logger = require('winston');
const fs= require('fs');
const debug = require('debug')('ws:db');
const sql = require('mssql');
logger.info('connecting to ' + config.server);

//more database configs
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
}

Object.assign(config, configDetail);


/**
 * get connection pooll, returning a promise.
 * 
 * @returns {Promise<*>}
 */
const getConnectionPool= async function()
{
    try {
        let pool = await sql.connect(config);
        return pool;
    }catch(err)
    {
        logger.error(err);
    }
}



module.exports = getConnectionPool();
