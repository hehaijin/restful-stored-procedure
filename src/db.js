'use strict';
const logger = require('./logger');
const debug = require('debug')('ws:db');
const sql = require('mssql');

/**
 * get connection pooll, returning a promise.
 * config: object; example {user: xx, server: xx, database:xx, port:1433}
 * @returns {Promise<*>}
 */
async function getConnectionPool(config) {
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
    try {
        let pool = await sql.connect(config);
        console.log("connecting to server");
        logger.info('connecting to ' + config.server);
        return pool;
    } catch (err) {
        console.log(err);
        logger.error(err);
    }
}
module.exports = getConnectionPool;
