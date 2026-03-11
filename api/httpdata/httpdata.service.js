const mysql = require("../../config/database");

module.exports = {

/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-10
 * @Last Modified by: Someone
 * @Last Modified time: 2026-03-11 08:13:28
 * @Description: All the database services available for the API Httpdata
 */

  // -----------------------------------------------------------
  // Insert Httpdata info into the table Httpdata
  // -----------------------------------------------------------
  createHttpdata: (data) => {
    //console.log ('*Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into httpdata (subprojectID, code, jsondata) 
                  values(?,?,?)`,
        [
          data.subprojectID,
          data.code,
          data.jsondata
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
  // Get Httpdata by code
  // -----------------------------------------------------------
  getHttpdataByCode: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT httpdataID, subprojectID, code, jsondata 
        FROM httpdata
        WHERE subprojectID = ? 
        AND code = ?`,
        [
          data.subprojectID,
          data.code
        ],

        (error, results, fields) => {
          //console.log ('Error: ', error)
          //console.log ('results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },



  // ---------------------------------------------------------------------------
  // Update a Httpdata record 
  // ---------------------------------------------------------------------------
  updateHttpdata: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE httpdata SET jsondata=? 
         WHERE httpdataID = ?`,
        [
          data.jsondata,
          data.httpdataID

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


  // ---------------------------------------------------------------------------
  // Delete a Httpdata
  // ---------------------------------------------------------------------------
  deleteHttpdata: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM httpdata WHERE httpdataID = ?`,
        [
          data.httpdataID
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

};
