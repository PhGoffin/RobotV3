const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-11-28 07:49:49 
   * @Last Modified by: 
   * @Last Modified time: 2023-12-06 12:11:53
   * @Description: All the database services available for the API faker
   */

  // -----------------------------------------------------------
  // Insert faker info into the table faker
  // -----------------------------------------------------------
  createFaker: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into faker(projectID, subprojectID, code, label, comment, active) 
                  values(?,?,?,?,?,?)`,
        [
          data.projectID,
          data.subprojectID,
          data.code,
          data.label,
          data.comment,
          (data.active != undefined ? data.active : 1),
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
  // Get faker by code
  // -----------------------------------------------------------
  getFakerByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT fakerID, label FROM faker WHERE projectID = ? AND subprojectID = ? AND code = ? AND active = ?`,
        [
          data.projectID,
          data.subprojectID,
          data.code,
          data.active
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
  // Get all fakers info from the table faker
  // ---------------------------------------------------------------------------
  getFakers: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT fakerID, projectId, subprojectID, code, label, comment, active FROM faker`,
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

  // ---------------------------------------------------------------------------
  // Update a faker record 
  // ---------------------------------------------------------------------------
  updateFaker: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE faker SET code=?, label=?, comment=?, active=? WHERE fakerID = ? and projectID = ? AND subprojectID = ?`,
        [
          data.code,
          data.label,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.fakerID,
          data.projectID,
          data.subprojectID
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
  // Delete a faker
  // ---------------------------------------------------------------------------
  deleteFaker: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM faker WHERE fakerID = ? and projectID = ? AND subprojectID = ?`,
        [
          data.fakerID,
          data.projectID,
          data.subprojectID
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
