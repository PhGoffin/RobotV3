/*
* @Author: Philippe Goffin 
* @Email: artcomputer123@gmail.com
* @Date: 2024-03-04 
 * @Last Modified by: Philippe Goffin
* @Last Modified time: 2024-03-19 12:52:19
* @Description: All the database services available for the API reference backup header
*/


const mysql = require("../../config/database");

module.exports = {

  // -----------------------------------------------------------
  // Insert reference backup header
  // -----------------------------------------------------------
  createRefBackHeader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into referencebackupheader(projectID, userID, slotID, comment) 
                  values(?,?,?,?)`,
        [
          data.projectID,
          data.userID,
          data.slotID,
          data.comment
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
  // Get reference backup header by project
  // -----------------------------------------------------------
  getRefBackHeaderByProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT backupheaderID, projectID, userID, slotID, comment 
         FROM referencebackupheader 
         WHERE projectID=? AND userID=?
         ORDER BY slotID`,
        [
          data.projectID,
          data.userID
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


  // -----------------------------------------------------------
  // Get reference backup header by user
  // -----------------------------------------------------------
  getRefBackHeaderByUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT backupheaderID, projectID, userID, slotID, comment FROM referencebackupheader WHERE projectID = ? AND userID=?`,
        [
          data.projectID,
          data.userID
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

  // -----------------------------------------------------------
  // Get reference backup header by slot
  // -----------------------------------------------------------
  getRefBackHeaderBySlot: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT backupheaderID, projectID, userID, slotID, comment FROM referencebackupheader WHERE projectID = ? AND userID=? AND slotID = ?`,
        [
          data.projectID,
          data.userID,
          data.slotID
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

  
  // -----------------------------------------------------------
  // Get reference backup header by slot
  // -----------------------------------------------------------
  getUserFromRefBackHeader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        // login, password, firstName, lastName
        `SELECT distinct U.userID, U.lastName, U.firstName, U.login, CONCAT(U.lastName, ' ', U.firstName, ' (' , U.login, ')' ) as fullName 
        FROM user U, referencebackupheader H 
        WHERE H.projectID = ? 
        AND H.userID=U.userID
		    ORDER BY U.lastName`,
        [
          data.projectID
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
  // Delete a reference backup header
  // ---------------------------------------------------------------------------
  deleteRefBackHeader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM referencebackupheader WHERE projectID = ? AND userID = ? AND slotID = ?`,
        [
          data.projectID,
          data.userID,
          data.slotID
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
