const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-04-09
 * @Last Modified by: Someone
   * @Last Modified time: 2025-05-27 07:17:19
   * @Description: All the database services available for the API Selector
   */


  // -----------------------------------------------------------
  // Insert a new selector
  // -----------------------------------------------------------
  createSelector: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_selector(projectID, name, endTag, comment, position, active) 
                  values(?,?,?,?,?,?)`,
        [
          data.projectID,
          data.name,
          data.endTag,
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
  // Get a selector
  // ---------------------------------------------------------------------------
  getSelector: (selectorID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT selectorID, projectID, name, endTag, comment, position, active 
         FROM ai_selector WHERE selectorID=?`,
        [selectorID],
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
  // Get selector by project
  // -----------------------------------------------------------
  getSelectorByProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT selectorID, projectID, name, endTag, comment, position, active 
         FROM ai_selector WHERE projectID=? AND active LIKE ?`,
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
  // Update selector
  // ------------------------------------------------------------------------------------------
  updateSelector: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_selector SET name=?, endTag=?, comment=?, active=? WHERE selectorID = ?`,
        [
          data.name,
          data.endTag,
          data.comment,
          data.active,
          data.selectorID
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
  // Update selector position
  // ------------------------------------------------------------------------------------------
  updateSelectorPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_selector SET position=? WHERE selectorID = ?`,
        [
          data.position,
          data.selectorID
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
  // reorder all selectors
  // -----------------------------------------------------------
  reorderSelector: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_selector AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, selectorID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_selector,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.selectorID = T2.selectorID`,
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
  // Copy a selector
  // -----------------------------------------------------------
  copySelector: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_selector ( projectID, name, endTag, comment, active, position )
        SELECT t1.projectID, t1.name, t1.endTag, t1.comment, t1.active, ? 
        FROM ai_selector t1 WHERE t1.selectorID = ?`,
        [
          data.position,
          data.selectorID
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
  // Delete a selector
  // --------------------------------------------------------------------------------------------
  deleteSelector: (selectorID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_selector WHERE selectorID = ?`,
        [
          selectorID        ],
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
  // Delete all selectors of a project
  // ---------------------------------------------------------------------------
  deleteAllSelector: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_selector WHERE projectID = ?`,
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
  // Import Selector
  // ---------------------------------------------------------------------------
  importSelector: (data) => {
    const { importSelectors } = require("../playwright/library/file.library")
    //console.log ('Data: ', data)

    return new Promise((resolve, reject) => {

      importSelectors(data.projectID, data.fileName).then((res) => {
        if (!res.success) {
          return reject(res);
        } else {
          return resolve(res);
        }
      })
    });
  },  

};
