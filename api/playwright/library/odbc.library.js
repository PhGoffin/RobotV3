/**
* @author 	Philippe Goffin
* @name   	database utility
* @property	class 
*
* @description 
*  Playwright ODBC database functions
*  Compliant with the following database:
*    SQL Server
*    Oracle
*    DB2
*    MySQL / MariaDB
*    PostgreSQL
*    Snowflake
*    Teradata
*    SAP HANA
*    Any ODBC-compliant DB
*
* @version 
* V1.0 PGO	27/04/2026	Initial version   
*
*/

const odbc = require('odbc');

class ODBCUtility {
    constructor() {
        this.connectionString = '';
    }

    setConnectionString(connectString) {
        this.connectionString = connectString;
        return this.connectionString
    }

    async executeSql(sql, params = []) {
        let connection;

        if (!this.connectionString) {
            throw new Error('ODBC Error: connection string is empty');
        }
        let connectString = this.connectionString + "ReadOnly=0;OPTION=3;SSLMode=DISABLED;"

        try {
            console.log('executeSql: connection with', connectString)
            connection = await odbc.connect(connectString);
            console.log('connection ok')

            // ✅ Explicit transaction
            await connection.beginTransaction();


            const result = params.length ?
                await connection.query(sql, params) :
                await connection.query(sql);

            // ✅ Force persistence
            await connection.commit();

            return result;

        } finally {
            if (connection) await connection.close();
        }
    }
}

// ✅ EXPORT A SINGLE INSTANCE
module.exports = new ODBCUtility();