const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-15
   * @Last Modified by: 
   * @Last Modified time: 2024-07-29 15:21:29
   * @Description: All the database services available for the API Pattern
   */

  // -----------------------------------------------------------
  // Insert Pattern info into the table Pattern
  // -----------------------------------------------------------
  createPattern: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into pattern(projectID, selector, path, tag, attribute, result, weight, comment, position, active) 
                  values(?,?,?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.selector,
          data.path,
          data.tag,
          data.attribute,
          data.result,
          data.weight,
          data.comment,
          data.position,
          (data.active != undefined ? data.active : 1)
        ],

        (error, results) => {
          // console.log ('Results: ', results)
          // console.log ('Error : ', error)

          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Get a Patterns by id
  // ---------------------------------------------------------------------------
  getPattern: (patternID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT patternID, projectID, selector, path, tag, attribute, result, weight, comment, position, active 
        FROM pattern 
        WHERE patternID=?`,
        [patternID],
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
  // Get Patterns by code (selector)
  // -----------------------------------------------------------
  getPatternsByCode: (data) => {
    //console.log ('getPatternsByCode Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT P.patternID, P.selector, P.path, P.tag, P.attribute, P.result, P.weight, P.comment, P.position, P.active  
        FROM pattern P, ai_selector S
        WHERE P.projectID=? AND S.selectorID = ? AND P.selector=S.name AND P.active=1
        ORDER BY LPAD(LOWER(P.position), 10, 0)`,
        [data.projectID,
        data.selectorID
        ],
        (error, results, fields) => {
          //console.log ('getPatternsByCode results: ', results)
          //console.log ('getPatternsByCode error: ', error)

          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

    // -----------------------------------------------------------
  // Get Patterns by path (projectID, path, selector)
  // -----------------------------------------------------------
  getPatternsByPath: (data) => {
    //console.log ('getPatternsByPath Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT patternID, selector, path, tag, attribute, result, weight, comment, position, active  
        FROM pattern 
        WHERE projectID=? AND selector=? AND path=? AND active=1
        ORDER BY LPAD(LOWER(position), 10, 0)`,
        [data.projectID,
         data.path,
         data.selector
        ],
        (error, results, fields) => {
          // console.log ('Results: ', results)
          // console.log ('Error : ', error)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // -----------------------------------------------------------
  // Get all Patterns of the project
  // -----------------------------------------------------------
  getPatternByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT patternID, selector, path, tag, attribute, result, weight, comment, position, active  
        FROM pattern 
        WHERE projectID=?
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
  // Update a Pattern record 
  // ---------------------------------------------------------------------------
  updatePattern: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE pattern SET selector=?, path=?, tag=?, attribute=?, result=?, weight=?, comment=?, active=?
        WHERE patternID = ?`,
        [
          data.selector,
          data.path,
          data.tag,
          data.attribute,
          data.result,
          data.weight,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.patternID
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

  // ------------------------------------------------------------------------------------------------
  // Update a Pattern record for the statistics (no API for that, just a direct call to the function)
  // ------------------------------------------------------------------------------------------------
  updatePatternStatistic: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE pattern SET attribute=?, result=?
        WHERE patternID = ?`,
        [
          data.attribute,
          data.result,
          data.patternID
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
  // Update Pattern position
  // -----------------------------------------------------------
  updatePatternPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE pattern SET position = ? WHERE patternID = ?`,
        [
          data.position,
          data.patternID
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
  // reorder all Patterns
  // -----------------------------------------------------------

  reorderPattern: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE pattern AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, patternID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM pattern,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
         ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.patternID = T2.patternID`,
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
  // Copy a Pattern record
  // -----------------------------------------------------------
  copyPattern: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO pattern ( projectID, selector, path, tag, attribute, result, weight, comment, active, position )
         SELECT t1.projectID, t1.selector, t1.path, t1.tag, t1.attribute, t1.result, t1.weight, t1.comment, t1.active, ? 
         FROM testPattern t1 WHERE t1.PatternID = ?`,
        [
          data.position,
          data.patternID
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
  // Delete a Pattern
  // ---------------------------------------------------------------------------
  deletePattern: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM pattern WHERE patternID = ?`,
        [
          data.patternID
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
  // Delete all Patterns for a selector on a project
  // ---------------------------------------------------------------------------
  deleteAllPattern: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM pattern WHERE projectID = ? AND selector=?`,
        [
          data.projectID,
          data.selector
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
  // Import Patterns
  // ---------------------------------------------------------------------------
  importPattern: (data) => {
    const { importPatterns } = require("../Selenium/library/file.library")
    let dataAPI = {}
    //console.log ('Data: ', data)

    return new Promise((resolve, reject) => {

      importPatterns(data.projectID, data.fileName).then((res) => {
        if (!res.success) {
          return reject(res);
        } else {
          return resolve(res);
        }
      })
    });
  },


  // ---------------------------------------------------------------------------
  // Export Patterns
  // ---------------------------------------------------------------------------
  exportPattern: (data) => {
    return new Promise((resolve, reject) => {
    });
  },




};
