## Restful-TSQL

This project is to automatically provide restful API for stored procedures in a SQL Server database.

Libraries like snowman that automatically restify databases usually do not include stored procedures, which is the purpose of this package.

The package will provide an easy API for accessing stored procedures in a SQL Server database.



### How to run the package
#### database config
1. config file
create Config.js under the root folder. add:
```
module.exports=  {
    user: "user",
    password: "password",
    "server": "server",
    "database": "your database",
    port: 1433
}
```

2. command line parameters.


	to be added.

### running
node index.js


### APIs: 
```
    POST /schema.procedureName
    Json body: 
    {"parameters": {"param1": value1, "param2": value2  } } 
```    
execute a stored procedure with given parameters.
	


### features to be added.	

##### Logging: 
 log every request, result with morgan.
 log detailed error info.
 
##### Error:
 505: for database related error.
 500: for other errors. 
	
	


