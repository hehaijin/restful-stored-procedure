const sql = require('mssql');
const sqlWorker = require('./sqlWorker');
const logger = require('winston');
const debug = require('debug')('ws:procedureDefinition');


const typeMapping = {
    //more needs to be added.
    int: sql.Int,
    varchar: sql.VarChar,
    datetime: sql.DateTime,
    date: sql.Date,
    bit: sql.Bit,
    char: sql.Char,
    numeric: sql.Numeric,
    nvarchar: sql.NVarChar,
    varbinary: sql.VarBinary,
}


function getProcedureParameters(schema, proName) {

    return sqlWorker.executeSQLQuery('SELECT * FROM INFORMATION_SCHEMA.PARAMETERS where SPECIFIC_SCHEMA=  \'' + schema + '\'and SPECIFIC_NAME= \'' + proName + '\'')
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


async function getDefinitions() {

    return sqlWorker.executeSQLQuery('select * \n' +
        '  from information_schema.routines \n' +
        ' where routine_type = \'PROCEDURE\'')
        .then(res => res.recordset)
        .then(routines => {
            const pms = routines.map(routine => getProcedureParameters(routine.ROUTINE_SCHEMA, routine.ROUTINE_NAME));
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

module.exports = getDefinitions;
