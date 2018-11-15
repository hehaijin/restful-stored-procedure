'use strict';

const logger = require('winston');
const debug = require('debug')('ws:sqlWorker');
const conn = require('./db.js');
const mssql = require('mssql');


const sqlWorker = {};


sqlWorker.executeProcedure = async function (params, procedureDefinition) {
    var self = this;
    var sqlReq;
    var fld;
    self.params = params;
    debug("execute procedure started");
    var con = await conn;
    const request = new mssql.Request(con);
    debug("P1: paramaters %O", params);
    for (var key in params) {
        if (key == 'proc') continue;
        debug("P2: key", key);
        debug("P3: ", procedureDefinition[params.proc][key]);
        debug("P4: ", params[key]);
        if (procedureDefinition[params.proc][key] === undefined) {
            logger.error("did not find the corresponding type for input key " + key);
            throw new Error("input key not found");
        }
        request.input(key, procedureDefinition[params.proc][key], params[key]);
    }
    debug("new request parameters done, start execute");
    return request.execute(params.proc);

};

sqlWorker.executeSQLQuery = async function (sqlquery) {
    return conn.then((pool) => {

        const request = new mssql.Request(pool);
        return request.query(sqlquery);
    });
}


sqlWorker.queryTable = async function (table, params) {
    return conn.then(pool => {
        const request = new mssql.Request(pool);
        for (var i in params) {

        }

        let query = 'select * from ' + table + 'where  ';
        for (var i in paras) {

        }

        return request.query('select * from ' + table + 'where  ')
    });
}

module.exports = sqlWorker;