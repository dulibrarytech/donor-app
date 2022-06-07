module.exports = class Transaction {
    constructor(databaseHandle=null) {
        this.database = databaseHandle;
    }

    find() {
        let transactions = null;
        return new Promise((resolve, reject) => {
            this.database.getConnection((error, connection) => {
                try {
                    if(error) throw new Error(`Error connecting to database: ${error}`);

                    let query = `SELECT * FROM Transaction`;
                    connection.query(query, (error, results, fields) => {
                        if(error) {
                            console.log("Database error:", error);
                        }
                        else {
                            console.log("DB Results:", results) // DEV
                            
                            // Build response object, remove this else block
                            if(results.length > 0) {
                                for(var result of results) {
                                    console.log("Result:", result.value)
                                }
                            }
                        }

                        connection.release();
                        resolve(transactions);
                    });
                }
                catch(error) {
                    console.log(error.message);
                    connection.release();
                    resolve(null);
                }
            });
        });
    }

    save(data) {
        console.log("Data:", data)
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}

// module.exports = () => {
//     const find = () => {

//     }

//     const save = (data) => {

//     }

//     return {
//         find,
//         save
//     }
// }