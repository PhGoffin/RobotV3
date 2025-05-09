const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-21
 * @Last Modified by: 
   * @Last Modified time: 2024-08-09 10:07:26
   * @Description: All the database services available for the API scenario
   */

  // -----------------------------------------------------------
  // Insert scenario info into the table scenario
  // -----------------------------------------------------------
  createScenario: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into scenario(subprojectID, scenario, comment, position, active, createdby, created, updatedby, updated) 
                  values(?,?,?,?, ?,?,?,?,?)`,
        [
          data.subprojectID,
          data.scenario,
          data.comment,
          data.position,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.user,
          data.today
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
  // Get specific scenario info from the table scenario
  // ---------------------------------------------------------------------------
  getScenarioById: (scenarioID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT S.scenarioID, S.subprojectID, Z.subproject, S.scenario, S.comment, S.position, S.active, S.createdby, S.created, S.updatedby, S.updated 
         FROM scenario S, subproject Z 
         WHERE scenarioID=? AND S.subprojectID = Z.subprojectID`,
        [scenarioID],
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
  // Get all the scenario from a subproject
  // -----------------------------------------------------------
  getScenarioBySubproject: (subprojectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT S.scenarioID, S.subprojectID, Z.subproject, S.scenario, S.comment, S.position, S.active, S.createdby, S.created, S.updatedby, S.updated  
        FROM scenario S, subproject Z 
        WHERE S.subprojectID=? AND S.subprojectID = Z.subprojectID
        ORDER BY LPAD(LOWER(S.position), 10, 0)`,
        [subprojectID],
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
  // Get a scenario by code (name)
  // -----------------------------------------------------------
  getScenarioByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT S.scenarioID, S.subprojectID, S.scenario, S.comment, S.position, S.active, S.createdby, S.created, S.updatedby, S.updated  
        FROM scenario S 
        WHERE S.subprojectID=? AND S.scenario = ?`,
        [data.subprojectID,
         data.scenario
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
  // Update a scenario record 
  // ---------------------------------------------------------------------------
  updateScenario: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE scenario SET  subprojectID = ?, scenario=?, comment=?, active=?, updatedby=?, updated=? WHERE scenarioID = ?`,
        [
          data.subprojectID,
          data.scenario,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.scenarioID
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
  // Update Scenario position
  // -----------------------------------------------------------
  updateScenarioPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE scenario SET position = ? WHERE scenarioID = ?`,
        [
          data.position,
          data.scenarioID
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
  // reorder all Scenarios
  // -----------------------------------------------------------

  reorderScenario: (data) => {
    //console.log ('Data', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE scenario AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, scenarioID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM scenario,
         (SELECT @row_number:=0) as t
          WHERE subprojectID=?
          ORDER BY  subprojectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.scenarioID = T2.scenarioID`,
        [
          data.subprojectID
        ],
        (error, results) => {
          //console.log ('Error', error)
          //console.log ('Results', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // Copy a Scenario record
  // -----------------------------------------------------------
  copyScenario: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO scenario ( subprojectID, scenario, comment, active, position, createdby, created, updatedby, updated )
         SELECT t1.subprojectID, t1.scenario, t1.comment, t1.active, ?, ?, ?, ?, ? 
         FROM scenario t1 WHERE t1.scenarioID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
          data.scenarioID
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
  // Import a Scenario 
  // -----------------------------------------------------------
  importScenario: (data) => {

    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO scenario ( subprojectID, scenario, comment, active, position, createdby, created, updatedby, updated )
         SELECT ?, ?, t1.comment, t1.active, 99999, t1.createdby, t1.created, t1.updatedby, t1.updated 
         FROM scenario t1 WHERE t1.scenarioID = ?`,
        [
          data.currentSubprojectID,
          data.scenarioName,
          data.scenarioID,
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
  // Delete a scenario
  // ---------------------------------------------------------------------------
  deleteScenario: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM scenario WHERE scenarioID = ? and subprojectID = ?`,
        [
          data.scenarioID,
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
