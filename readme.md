# Restful-Stored-Procedure
### For SQL Server (TSQL).

This project is to automatically provide restful API for stored procedures in a SQL Server database.

[![npm version](https://badge.fury.io/js/restful-stored-procedure.svg)](https://badge.fury.io/js/restful-stored-procedure)
[![Build Status](https://travis-ci.com/hehaijin/restful-stored-procedure.svg?branch=master)](https://travis-ci.com/hehaijin/restful-stored-procedure)

# Use as a library 
First install the package.
```
npm install restful-stored-procedure 
```
 Code example:

```
const express = require('express');
const createRoutes = require('restful-stored-procedure');
const server = express();

// Here add your own middle ware and other routes if needed.

// Create config object.
const config= {
    "user": "user",
    "password": "password",
    "server": "server",
    "database": "your database",
    "port": 1433
};

// Call createRoutes with server and the config.
createRoutes(server, config);

server.listen(8080, ()=>{
   console.log('Server start listing at port 8080');
});

```
Done. 

You can now access the database with restiful API at port 8080.

It's also possible to only generate routes for certain schema by including a third argument to createRoutes.

```
createRoutes(server, config, ['dbo','web']);
```

# Use as a command line program.
First install the package globally.

```
npm install restful-stored-procedure -g
```
create a config.json file with contents
```
 {
    "user": "user",
    "password": "password",
    "server": "server",
    "database": "your database",
    "port": 1433
}
```
Run the command

	rest-sp -f path/to/config.json -p httpport

or if you put config.json in root folder and use port 8080, simply:

    rest-sp

An Express server is set up to receive restiful API calls.


# APIs: 
Execute a stored procedure with given parameters.
```
    POST /sp/schema.procedureName
    Json body: 
    {"parameters": {"param1": value1, "param2": value2  } } 
```    
Get detailed argument information about a stored procedure
```
    GET /sp/schema.procedureName
``` 

List all available stored procedure	
```
    GET /sp/list
``` 


