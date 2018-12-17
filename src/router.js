'use strict';
const SQLWorker= require('./sqlWorker');

/**
 * stpes:
 * 1, get all tables from the database.   tables=[]
 * 2, for each table, generate routes.
 * 3, generate routes from procedures.
 *
 */

const logger = require('./logger');
const debug = require('debug')('ws:router');
const getConnectionPool= require('./db');


/**
 * middleware to check request format
 * @param {} req 
 * @param {*} res 
 * @param {*} next 
 */
const checkRequestFormat= function(req, res,next){
    if(!req.body.parameters) {
        res.status(504);
        res.send('Format not correst! POST requests must have \'parameters\' key in request body!')
        return;
    }
    next();
}





async function createRoutes(server, config) {
    server.post('/sp/*',checkRequestFormat);

    console.log('generating routes');
    const pool= await getConnectionPool(config);
    const sqlWorker = new SQLWorker(pool);
    const allRoutes=[];
    sqlWorker.executeSQLQuery('select * \n' +
        '  from information_schema.routines \n' +
        ' where routine_type = \'PROCEDURE\'')
        .then(res => res.recordset)
        .then(procedures => procedures.forEach(procedure => {
            // logger.info('/' + procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME);
            allRoutes.push(procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME);
            server.post('/sp/' + procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME, function (req, res, next) {
                var params = req.body.parameters;
                debug("P1 - parameters for prosedure %O", params);
                // debug('%O', req.body);
                sqlWorker.executeProcedure(procedure.ROUTINE_SCHEMA + '.' + procedure.ROUTINE_NAME ,params).then(result => {
                    if (result.recordsets.length === 1) res.send(result.recordset);
                    else res.send(result.recordsets);
                    debug("P2- results returned from database ", JSON.stringify(result).substring(0, 100));
                }).catch(error => {
                    res.status(503);
                    debug("P3- error received", error);
                    res.send(error.message);
                });

                //  return next();

            });
        }));


    sqlWorker
        .executeSQLQuery('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE=\'BASE TABLE\'')
        .then(res => res.recordset)
        .then(tables => {
            tables.forEach(
                table => {
                    // add a route for displaying all rows.
                    // path:  /schema.table

                    server.get('/' + table.TABLE_SCHEMA + '.' + table.TABLE_NAME, function (req, res, next) {
                        sqlWorker.executeSQLQuery('select * from ' + table.TABLE_SCHEMA + '.' + table.TABLE_NAME)
                            .then(result => res.send(result.recordset));
                        return next();

                    });
                    // path: schema dbo can be ommitted
                    if (table.TABLE_SCHEMA === 'dbo') {
                        server.get('/' + table.TABLE_NAME, function (req, res, next) {
                            sqlWorker.executeSQLQuery('select * from ' + table.TABLE_SCHEMA + '.' + table.TABLE_NAME)
                                .then(result => res.send(result.recordset)).catch(error => {
                                logger.error(error);
                                res.send(error);
                            });
                            return next();
                        });
                    }

                }
            )

        });

        server.get('/sp/list', (req,res,next)=>{
            res.send(allRoutes);
        });    

}


module.exports = createRoutes;