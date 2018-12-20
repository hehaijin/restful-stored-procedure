'use strict';

/**
 * all dirty looking querys are here.
 */
const queryGenerator= {

    getAllRoutines: function(){
       return 'select * \n' +
       '  from information_schema.routines \n' +
       ' where routine_type = \'PROCEDURE\'';
    },


    getParametersForRoutine: function(schema, proName){
      return  'SELECT * FROM INFORMATION_SCHEMA.PARAMETERS where SPECIFIC_SCHEMA=  \'' + schema + '\'and SPECIFIC_NAME= \'' + proName + '\'';
    }

}

module.exports= queryGenerator;