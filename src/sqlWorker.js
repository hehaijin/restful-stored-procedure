'use strict';

const logger = require('./logger');
const mssql = require('mssql');
const typeMapping = require('./typeMapping');
const queryGenerator= require('./queryGenerator');

function sqlWorker(pool) {
    /**
     * params: your parameters for the procedure; example: { id: xx, clientId: xx2}
     * procedureDefinition: 
     */
    this.executeProcedure = async function (proc, params) {
        const procedureDefinition = await this.getDefinitions();
        const request = new mssql.Request(pool);
        for (var key in params) {
            if (procedureDefinition[proc][key] === undefined) {
                throw new Error(`Input parameter ${key} not found for procedure ${proc}`);
            }
            request.input(key, procedureDefinition[proc][key], params[key]);
        }
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
     * promise
     */
   this.getDefinitions=  async function() {

        return this.executeSQLQuery(queryGenerator.getAllRoutines())
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
    
    };
    
   this.getProcedureParameters=  async function(schema, proName) {

        return this.executeSQLQuery(queryGenerator.getParametersForRoutine(schema,proName))
            .then(result => {
                const params = {};
                const attr = {};
                for (let record of result.recordset) {
                    attr[record.PARAMETER_NAME.substring(1)] = typeMapping[record.DATA_TYPE];
                    if (typeMapping[record.DATA_TYPE] === undefined) {
                        logger.warn("type translation for type \'" + record.DATA_TYPE + 
                        "\' failed. please add this type to typeMapping");
                        attr[record.PARAMETER_NAME.substring(1)]= record.DATA_TYPE;
                        // throw new Error('type translation failed');
                    }
                }
                params[schema + '.' + proName] = attr;
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