#### Run npm install 

1) config file
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
run node


2) command line parameters.


	to be added.




#### APIs: 
```
    POST /schema.procedureName
    Json body: 
    {"parameters": {"param1": value1, "param2": value2  } } 
```    
    execute a stored procedure with given parameters.
	


features to be added.	

##### Logging: 
 log every request, result with morgan.
 log detailed error info.
 
##### Error:
 505: for database related error.
 500: for other errors. 
	
	


