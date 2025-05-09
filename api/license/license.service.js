const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-11-28 07:49:49 
   * @Last Modified by: 
   * @Last Modified time: 2024-01-09 09:10:30
   * @Description: All the database services available for the API License
   */

  // -----------------------------------------------------------
  // Insert a license info into the table license
  // -----------------------------------------------------------
  createLicense: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into license(license, projectNb, subprojectNb, scenarioNb, userNb, moduleAI) 
                  values(?,?,?,?,?,?)`,
        [
          data.license,
          data.projectNb,
          data.subprojectNb,
          data.scenarioNb,
          data.userNb,
          data.moduleAI
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
  // Get a license by name
  // -----------------------------------------------------------
  getLicenseByName: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT licenseID, license, projectNb, subprojectNb, scenarioNb, userNb, moduleAI FROM license WHERE license = ?`,
        [
          data.license
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
  // Get a license by Id
  // -----------------------------------------------------------
  getLicenseById: (licenseID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT licenseID, license, projectNb, subprojectNb, scenarioNb, userNb, moduleAI FROM license WHERE licenseID = ?`,
        [
          licenseID
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
  // Get all licenses info from the table license
  // ---------------------------------------------------------------------------
  getLicenses: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT licenseID, license, projectNb, subprojectNb, scenarioNb, userNb, moduleAI FROM license`,
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
  // Update a license record 
  // ---------------------------------------------------------------------------
  updateLicense: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE license SET license=?, projectNb=?, subprojectNb=?, scenarioNb=?, userNb=?, moduleAI=? WHERE licenseID = ?`,
        [
          data.license,
          data.projectNb,
          data.subprojectNb,
          data.scenarioNb,
          data.userNb,
          data.moduleAI,
          data.licenseID
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
  // Delete a license
  // ---------------------------------------------------------------------------
  deleteLicense: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM license WHERE licenseID = ?`,
        [
          data.licenseID
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
