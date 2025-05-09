const mysql = require("../../config/database");

module.exports = {

 /*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: 
 * @Last Modified time: 2024-07-29 09:36:42
 * @Description: All the database services available for the API AI Path
 */


  // -----------------------------------------------------------
  // Insert a new Path
  // -----------------------------------------------------------
  createPath: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_path(projectID, fullPath, pathCondition, weight, comment, position, active) 
                  values(?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.fullPath,
          data.pathCondition,
          data.weight,
          data.comment,
          data.position,
          data.active
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
  // Get a Path
  // ---------------------------------------------------------------------------
  getPath: (pathID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT pathID, projectID, fullPath, pathCondition, weight, comment, position, active 
         FROM ai_path WHERE pathID=?`,
        [pathID],
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
  // Get Path by project
  // -----------------------------------------------------------
  getPathByProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT pathID, projectID, fullPath, pathCondition, weight, comment, position, active 
         FROM ai_path WHERE projectID=? AND active like ?
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          data.projectID,
          (data.active != undefined ? data.active : '%'),
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


  // ------------------------------------------------------------------------------------------
  // Update Path
  // ------------------------------------------------------------------------------------------
  updatePath: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_path SET fullPath=?, pathCondition=?, weight=?, comment=?, active=? WHERE pathID = ?`,
        [
          data.fullPath,
          data.pathCondition,
          data.weight,
          data.comment,
          data.active,
          data.pathID
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


  // ------------------------------------------------------------------------------------------
  // Update Path position
  // ------------------------------------------------------------------------------------------
  updatePathPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_path SET position=? WHERE pathID = ?`,
        [
          data.position,
          data.pathID
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
  // reorder all Paths
  // -----------------------------------------------------------
  reorderPath: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_path AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, pathID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_path,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.pathID = T2.pathID`,
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

  // -----------------------------------------------------------
  // Copy a Path
  // -----------------------------------------------------------
  copyPath: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_path ( projectID, fullPath, pathCondition, weight, comment, active, position )
        SELECT t1.projectID, t1.fullPath, t1.pathCondition, t1.weight, t1.comment, t1.active, ? 
        FROM ai_path t1 WHERE t1.pathID = ?`,
        [
          data.position,
          data.pathID
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


  // --------------------------------------------------------------------------------------------
  // Delete a Path
  // --------------------------------------------------------------------------------------------
  deletePath: (pathID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_path WHERE pathID = ?`,
        [
          pathID        ],
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
  // Delete all paths of a project
  // ---------------------------------------------------------------------------
  deleteAllPath: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_path WHERE projectID = ?`,
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
  // Import Paths
  // ---------------------------------------------------------------------------
  importPath: (data) => {
    const { importPaths } = require("../Selenium/library/file.library")
    //let dataAPI = {}
    //console.log ('Data: ', data)

    return new Promise((resolve, reject) => {

      importPaths(data.projectID, data.fileName).then((res) => {
        if (!res.success) {
          return reject(res);
        } else {
          return resolve(res);
        }
      })
    });
  },  

};
