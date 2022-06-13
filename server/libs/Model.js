'use strict'

const mysql = require('mysql');

class Model {
  constructor(database_handle=null, queries={}) {
    this.database_handle = database_handle;
    this.queries = queries;
  }

  execute_query(query_key="", params=[]) {
    let query = this.queries[query_key] || "";
    let response = {
      flags: {},
      data: []
    };

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
              if(typeof results.insertId != 'undefined') {
                response.flags["insertId"] = results.insertId;
              }
              if(typeof results.affectedRows != 'undefined') {
                response.flags["affectedRows"] = results.affectedRows;
              }
              if(typeof results.length != 'undefined') {
                response.data = results;
              }
              resolve(response);
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
