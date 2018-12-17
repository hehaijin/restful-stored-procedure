# Restful-Stored-Procedure
## for SQL Server(TSQL)

This project is to automatically provide restful API for stored procedures in a SQL Server database.

Libraries like Sandman that automatically restify databases usually do not include stored procedures, which is the purpose of this package.

The package will provide an easy API for accessing stored procedures in a SQL Server database.



### How to run the package
#### Install globally
```
npm install restful-stored-procedure -g
```

## Usage

## Use as a library 
First install the package.
```
npm install restful-stored-procedure 
```
 code sample

```
const express = require('express');
const createRoutes = require('restful-stored-procedure');
const server = express();
// Here add your own middle ware and other routes if needed.
const config= {
    "user": "user",
    "password": "password",
    "server": "server",
    "database": "your database",
    "port": 1433
};

createRoutes(server, config);
server.listen(8080, ()=>{
   console.log('Server start listing at port 8080');
});

```
Done. 

You can now access the database with restiful API at port 8080.


##  Use as commandline program.
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
	
A simeple express server is set up to receive restiful API calls.


## APIs: 
```
    POST /schema.procedureName
    Json body: 
    {"parameters": {"param1": value1, "param2": value2  } } 
```    
Execute a stored procedure with given parameters.
	
  

### Features to be added.	

##### Logging: 
 log every request, result with morgan.
 log detailed error info.
 
##### Error:
 505: for database related error.
 500: for other errors. 
	
	


