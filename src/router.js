'use strict';
const SQLWorker = require('./sqlWorker');

/**
 * stpes:
 * 1, get all tables from the database.   tables=[]
 * 2, for each table, generate routes.
 * 3, generate routes from procedures.
 *
 */

const logger = require('./logger');
const getConnectionPool = require('./db');
const typeMapping= require('./typeMapping');
const queryGenerator= require('./queryGenerator');


/**
 * middleware to check request format
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkRequestFormat = function (req, res, next) {
    if (!req.body.parameters) {
        res.status(504);
        res.send('Format not correst! POST requests must have \'parameters\' key in request body!')
        return;
    }
    next();
}





async function createRoutes(server, config, schemas) {
    server.post('/sp/*', checkRequestFormat);
    const pool = await getConnectionPool(config).catch(err=>{
        // logger.error('Failed to connect. Please check user name, password, server, database are correctly set!');
        throw new Error('Failed to connect. Please check user name, password, server, database are correctly set! ')
    });
    const sqlWorker = new SQLWorker(pool);
    const definitions= await sqlWorker.getDefinitions().catch( err => {logger.warn('Something wrong happens when getting parameter definitions. but the program will proceed. The error is :');
	logger.warn(err);}
	); 
    const allRoutes = [];
    sqlWorker.executeSQLQuery(queryGenerator.getAllRoutines())
        .then(res => res.recordset)
        .then(procedures => procedures.forEach(procedure => {
            // logger.info('/' + procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME);
            if(schemas && !schemas.includes(procedure.ROUTINE_SCHEMA ) ) return;
            allRoutes.push(procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME);
            server.post('/sp/' + procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME, function (req, res, next) {
                var params = req.body.parameters; 
                sqlWorker.executeProcedure(procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME, params).then(result => {
                    // returns one recordset
                    if (result.recordsets.length === 1) res.send(result.recordset);
                    // returns multiple recordset; this happens when it has multiple select;
                    else res.send(result.recordsets);
                }).catch(error => {
                    res.status(503);
                    res.send(error.message);
                });
                //  return next();
            });
            server.get('/sp/' + procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME, (req, res, next) => {
                const def = definitions[procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME];
                // a little performance hit here for calculate it every time.
                const convert = {};
                for (const key of Object.keys(def)) {
                    for (const type of Object.keys(typeMapping)) {
                        if (typeMapping[type] === def[key]) {
                            convert[key] = type;
                        }
                    }
                }
                res.send(convert);
            });
        }))
        .then(() => {
            logger.info('Routes successfully created for ' + allRoutes.length + ' stored procedures');
        },
		(err)=>{
			logger.error('Failed to create routes for some routes');
			logger.error(err.message);
		}
		);

    server.get('/sp/list', (req, res, next) => {
        res.send(allRoutes);
    });

}


module.exports = createRoutes;