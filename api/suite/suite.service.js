const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-21
 * @Last Modified by: Philippe Goffin
   * @Last Modified time: 2024-03-09 10:25:57
   * @Description: All the database services available for the API Suite
   */

  // -----------------------------------------------------------
  // Insert Suite info into the table Suite
  // -----------------------------------------------------------
  createSuite: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into suite(suiteheaderID, scenarioID, comment, position, active) 
                  values(?,?,?,?,?)`,
        [
          data.SuiteheaderID,
          data.scenarioID,
          data.comment,
          data.position,
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


  // ---------------------------------------------------------------------------
  // Get a Suite by id
  // ---------------------------------------------------------------------------
  getSuite: (suiteId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT H.subprojectID, D.suiteID, D.suiteheaderID, D.scenarioID, D.comment, H.label as headerlabel, D.position, D.active 
        FROM suite D, suiteheader H
        WHERE D.suiteID=? AND D.suiteheaderID=H.suiteheaderID`,
        [suiteId],

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
  // Get all Suites info from the table Suite for a subproject
  // ---------------------------------------------------------------------------
  getSuiteBySubProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT H.subprojectID, D.suiteID, D.suiteheaderID, D.scenarioID, D.comment, H.label as headerlabel, D.position, D.active 
        FROM suite D, suiteheader H
        WHERE H.subprojectID=? 
        AND D.suiteheaderID = H.suiteheaderID
        ORDER BY LPAD(LOWER(D.position), 10, 0) asc`,
        [
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
  },

  // ---------------------------------------------------------------------------
  // Get all Suites info from the table Suiteheader
  // ---------------------------------------------------------------------------
  getSuiteByHeader: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT H.subprojectID, D.suiteID, D.suiteheaderID, D.scenarioID, D.comment, H.label as headerlabel, D.position, D.active 
         FROM suite D, suiteheader H 
         WHERE D.suiteheaderID=? 
         AND D.suiteheaderID = H.suiteheaderID
         ORDER BY LPAD(LOWER(D.position), 10, 0) asc`,
        [
          data.suiteheaderID
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          //console.log ('Result: ', results)
          return resolve(results);
        }
      );
    });
  },



  // ---------------------------------------------------------------------------
  // Update a Suite record 
  // ---------------------------------------------------------------------------
  updateSuite: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE suite SET scenarioID=?, comment=?, active=? WHERE suiteID = ?`,
        [
          data.scenarioID,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.suiteID
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
  // Update Suite position
  // -----------------------------------------------------------
  updateSuitePosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE suite SET position = ? WHERE suiteID = ?`,
        [
          data.position,
          data.suiteID
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
  // reorder all Suites
  // -----------------------------------------------------------
  reorderSuite: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(    
        `UPDATE suite AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, suiteID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM suite,
         (SELECT @row_number:=0) as t
          WHERE suiteheaderID=?
          ORDER BY suiteheaderID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.suiteID = T2.suiteID`,
        [
          data.suiteheaderID
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
  // Copy a Suite record
  // -----------------------------------------------------------
  copySuite: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO suite ( suiteheaderID, scenarioID, comment, active, position )
        SELECT t1.suiteheaderID, t1.scenarioID, t1.comment, t1.active, ? FROM suite t1 WHERE t1.suiteID = ?`,
        [
          data.position,
          data.suiteID
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
  // Copy all Suite of a headerSuite
  // -----------------------------------------------------------
  copyAllSuite: (data) => {

    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO suite ( SuiteheaderID, scenarioID, comment, active, position )
        SELECT ?, t1.scenarioID, t1.comment, t1.active, t1.position FROM suite t1 WHERE t1.suiteheaderID = ?`,
        [
          data.suiteheaderIDCopy,
          data.suiteheaderIDOrigin
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
  // Delete a Suite
  // ---------------------------------------------------------------------------
  deleteSuite: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM suite WHERE suiteID = ?`,
        [
          data.suiteID
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
  // Delete all Suite of a headerSuite
  // ---------------------------------------------------------------------------
  deleteAllSuite: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM suite WHERE suiteheaderID = ? `,
        [
          data.suiteheaderID,
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
