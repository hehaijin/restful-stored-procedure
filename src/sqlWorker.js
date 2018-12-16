'use strict';

const logger = require('./logger');
const debug = require('debug')('ws:sqlWorker');
const mssql = require('mssql');
const typeMapping = require('./typeMapping');

function sqlWorker(pool) {
    /**
     * params: your parameters for the procedure; example: { id: xx, clientId: xx2}
     * procedureDefinition: 
     */
    this.executeProcedure = async function (proc, params) {
        const procedureDefinition = await this.getDefinitions(pool);
        debug("execute procedure started");
        const request = new mssql.Request(pool);
        debug("P1: paramaters %O", params);
        for (var key in params) {
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
        return request.execute(proc);
    };


    /**
     * sqlQuery: string; example: select * from dbo.test
     */
    this.executeSQLQuery = async function (sqlquery) {
        const request = new mssql.Request(pool);
        return request.query(sqlquery);

    }

    /**
     * a function that get definitions of all procedures.
     */
   this.getDefinitions=  async function() {

        return this.executeSQLQuery('select * \n' +
            '  from information_schema.routines \n' +
            ' where routine_type = \'PROCEDURE\'')
            .then(res => res.recordset)
            .then(routines => {
                const pms = routines.map(routine => this.getProcedureParameters(routine.ROUTINE_SCHEMA, routine.ROUTINE_NAME));
                return Promise.all(pms)
            })
            //this is just to convert the original array into a object format.
            .then(values => {
                let result = {};
                //can not use let to loop, why?
                //
                for (var value of values) {
                    for (var key in value) {
                        result[key] = value[key];
                    }
                }
                return result;
    
            });
    
    }
    
   this.getProcedureParameters=  async function(schema, proName) {

        return this.executeSQLQuery('SELECT * FROM INFORMATION_SCHEMA.PARAMETERS where SPECIFIC_SCHEMA=  \'' + schema + '\'and SPECIFIC_NAME= \'' + proName + '\'')
            .then(result => {
                debug(proName);
                const params = {};
                const attr = {};
                for (let record of result.recordset) {
                    attr[record.PARAMETER_NAME.substring(1)] = typeMapping[record.DATA_TYPE];
                    if (typeMapping[record.DATA_TYPE] === undefined) {
                        logger.error("type translation for type " + record.DATA_TYPE + " failed. please add this type to typeMapping");
                        throw new Error('type translation failed');
                    }
                }
                params[schema + '.' + proName] = attr;
                //  debug(params);
                return params;
            });
    }


    /**
     * get all entries from a table
     */
    this.queryTable = async function (table, params) {

        const request = new mssql.Request(pool);
        let query = 'select * from ' + table + 'where  ';
        return request.query(query);
    }



}
module.exports = sqlWorker;