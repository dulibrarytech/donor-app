/**
 Copyright 2021 University of Denver
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

 'use strict'

const {databaseHost, databaseUser, databasePassword, databaseName} = require(`../../config/${process.env.CONFIGURATION_FILE}`),
	    mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : databaseHost,
    user     : databaseUser,
    password : databasePassword,
    database : databaseName,
    multipleStatements: true
  });

if(pool == null) {
  console.error(`Error connecting to database: database is not running or is not available. Check database service.`)
}
else {
  console.log(`Connection established to database at ${databaseHost}`)
}

module.exports = pool;
