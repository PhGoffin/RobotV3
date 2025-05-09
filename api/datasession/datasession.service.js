const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-11-28 07:49:49 
   * @Last Modified by: 
   * @Last Modified time: 2023-12-06 15:57:27
   * @Description: All the database services available for the API datasession (data is used to exchange information during a session )
   * The user must be provided by the front-end by the browser: let userID = browser.params.userId
   */


  // -----------------------------------------------------------
  // Insert data session into the table datasession
  // -----------------------------------------------------------
  createDataSession: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into datasession(user, code, value) 
                  values(?,?,?)`,
        [
          data.user,
          data.code,
          data.value
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });    
  },

  // -----------------------------------------------------------
  // Get session data by the code
  // -----------------------------------------------------------
  getDataSessionByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT value FROM datasession WHERE user = ? AND code = ?`,
        [
          data.user,
          data.code
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Get all session data from the table datasession
  // ---------------------------------------------------------------------------
  getDataSession: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dataSessionId, user, code, value FROM datasession`,
        [],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });    
  },


  // ------------------------------------------------------------------------------------------
  // Update session data based on a user (provided by the browser in the front-end) and a code
  // ------------------------------------------------------------------------------------------
  updateDataSession: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE datasession SET value=? WHERE user = ? and code = ?`,
        [
          data.value,
          data.user,
          data.code
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );  
    });
  },


  // --------------------------------------------------------------------------------------------
  // Delete a data session based on a user (provided by the browser in the front-end) and a code
  // --------------------------------------------------------------------------------------------
  deleteDataSession: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM datasession WHERE user = ? AND code = ?`,
        [
          data.user,
          data.code
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------------------------------
  // Delete all data session based on a user (provided by the browser in the front-end)
  // -----------------------------------------------------------------------------------
  resetDataSession: (userID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM datasession WHERE user = ?`,
        [
          userID
        ],
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }

};
