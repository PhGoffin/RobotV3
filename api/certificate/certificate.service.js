const mysql = require("../../config/database");

module.exports = {

/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-10
 * @Last Modified by: Someone
 * @Last Modified time: 2026-03-10 11:20:59
 * @Description: All the database services available for the API Certificate
 */

  // -----------------------------------------------------------
  // Insert Certificate info into the table Certificate
  // -----------------------------------------------------------
  createCertificate: (data) => {
    //console.log ('*Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into certificate (subprojectID, code, token) 
                  values(?,?,?)`,
        [
          data.subprojectID,
          data.code,
          data.token
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
  // Get Certificate by code
  // -----------------------------------------------------------
  getCertificateByCode: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT certificateID, subprojectID, code, token 
        FROM certificate
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
  // Update a Certificate record 
  // ---------------------------------------------------------------------------
  updateCertificate: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE certificate SET token=? 
         WHERE certificateID = ?`,
        [
          data.token,
          data.certificateID

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
  // Delete a Certificate
  // ---------------------------------------------------------------------------
  deleteCertificate: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM certificate WHERE certificateID = ?`,
        [
          data.certificateID
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
