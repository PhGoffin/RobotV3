const mysql = require("../../config/database");
  
module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-12-18 07:49:49 
 * @Last Modified by: 
   * @Last Modified time: 2024-07-30 08:54:53
   * @Description: All the database services available for the API subproject
   */

  // -----------------------------------------------------------
  // Insert subproject info into the table subproject
  // -----------------------------------------------------------
  createSubproject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into subproject(projectID, subproject, comment, createdby, created, updatedby, updated, position)
                  values(?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.subproject,
          data.comment,
          data.user,
          data.today,
          data.user,
          data.today,
          data.position
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
  // Get subproject info data by the name
  // -----------------------------------------------------------
  getSubprojectByName: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, subprojectID, subproject, comment, createdby, created, updatedby, updated, position 
         FROM subproject WHERE projectID = ? AND subproject = ?
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          data.projectID,
          data.subproject
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
  // Get subproject info data by the subproject ID
  // -----------------------------------------------------------
  getSubprojectById: (subprojectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, subprojectID, subproject, comment, createdby, created, updatedby, updated, position 
         FROM subproject WHERE subprojectID = ?`,
        [subprojectID],
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
  // Get all subproject from project from the table subproject
  // ---------------------------------------------------------------------------
  getSubprojectByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, subprojectID, subproject, comment, createdby, created, updatedby, updated, position 
         FROM subproject WHERE projectID = ?
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [projectID],
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
  // Update subproject info based on the subproject ID
  // ---------------------------------------------------------------------------
  updateSubproject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE subproject SET subproject=?, comment=?, updatedby=?, updated=?  
         WHERE subprojectID = ?`,
        [
          data.subproject,
          data.comment,
          data.user,
          data.today,
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

  // -----------------------------------------------------------
  // Update subproject position
  // -----------------------------------------------------------
  updateSubprojectPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE subproject SET position = ? WHERE subprojectID = ?`,
        [
          data.position,
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

  // -----------------------------------------------------------
  // reorder all Subprojects
  // -----------------------------------------------------------
  reorderSubproject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE subproject AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, subprojectID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM subproject,
         (SELECT @row_number:=0) as t
          WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.subprojectID = T2.subprojectID`,
        [
          data.projectID
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
  // Delete all subproject info based on the subproject ID
  // ---------------------------------------------------------------------------
  deleteSubproject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM subproject WHERE projectID = ? AND subprojectID = ?`,
        [
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
