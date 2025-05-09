/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: 
 * @Last Modified time: 2024-06-13 11:42:07
 * @Description: All the database services available for the API reference backup
 */

const mysql = require("../../config/database");

module.exports = {

  // -----------------------------------------------------------
  // Insert reference info into the table reference
  // -----------------------------------------------------------
  importRefrencebackup: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO reference ( projectID, userID, code, label, comment, active, position )
         SELECT ?, ?, t1.code, t1.label, t1.comment, t1.active, t1.position 
         FROM referencebackup t1 
         WHERE t1.backupheaderID = ?`,
        [
          data.projectID,
          data.userID,
          data.backupheaderID
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
  // Get a references by id
  // ---------------------------------------------------------------------------
  exportReferencebackup: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO referencebackup ( backupheaderID, code, label, comment, active, position )
         SELECT ?, t1.code, t1.label, t1.comment, t1.active, t1.position 
         FROM reference t1 
         WHERE t1.projectID = ? AND t1.userID = ?`,
        [
          data.backupheaderID,
          data.projectID,
          data.userID
        ],
        (error, results, fields) => {
          //console.log ('Error: ', error)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },



  // ---------------------------------------------------------------------------
  // Delete a reference backup
  // ---------------------------------------------------------------------------
  deleteReferencebackup: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM referencebackup WHERE backupheaderID = ?`,
        [
          data.backupheaderID
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }

};
