'use strict'

class Model {
  constructor(database_handle=null, queries={}) {
    this.database_handle = database_handle;
    this.queries = queries;
  }

  get_query(query_key="") {
    let query = this.queries[query_key];
    return typeof query == 'undefined' ? "" : query;
  }

  execute_query(query_key="") {
    let query = this.get_query(query_key);
    let items = [];

    return new Promise((resolve, reject) => {
      this.database_handle.getConnection((error, connection) => {
        try {
          if(error) throw new Error(`Error connecting to database: ${error}`);

          connection.query(query, (error, results, fields) => {
            if(error) {
              reject(error)
            }
            else {
              items = results;
              console.log("Model items to return:", items)
              resolve(items);
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
