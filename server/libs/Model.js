'use strict'

const mysql = require('mysql');

class Model {
  constructor(database_handle=null, queries={}) {
    this.database_handle = database_handle;
    this.queries = queries;
  }

  execute_query(query_key="", params=[]) {
    let query = this.queries[query_key] || "";
    // let response = {
    //   flags: {},
    //   data: []
    // };

    if(params.length > 0) {
      query = mysql.format(query, params);
    }

    console.log("Model gets query request: query data:", query)

    return new Promise((resolve, reject) => {
      this.database_handle.getConnection((error, connection) => {
        try {
          if(error) throw new Error(`Error connecting to database: ${error}`);

          connection.query(query, (error, results, fields) => {
            if(error) {
              reject(error)
            }
            else {
              console.log("Model Results", results)

              // TODO process response fields. InsertId, affectedRows, serverStatus (check on npm docs). Throw error if server status not ok.
              // TODO If no fields, it is a get response array.
              // Only get requests will return data[]
              // Other requests, data is [], fields are present.
              // Module model gets this response object

              resolve(results);
            }
            connection.release();
          });
        }
        catch(error) {
          reject(`Database error: ${error}`);
        }
      });
    });
  }
}

module.exports = Model;
