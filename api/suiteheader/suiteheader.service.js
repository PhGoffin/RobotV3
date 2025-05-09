const mysql = require("../../config/database");

module.exports = {

/*
* @Author: Philippe Goffin 
* @Email: artcomputer123@gmail.com
* @Date: 2024-02-21
 * @Last Modified by: Philippe Goffin
* @Last Modified time: 2024-03-09 08:37:28
* @Description: All the database services available for the API SuiteHeader
*/

  // -----------------------------------------------------------
  // Insert SuiteHeader info into the table SuiteHeader
  // -----------------------------------------------------------
  createSuiteHeader: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into suiteheader(subprojectID, label, comment, position, active, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?)`,
        [
          data.subprojectID,
          data.label,
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
  // Get a SuiteHeader by id
  // ---------------------------------------------------------------------------
  getSuiteHeader: (suiteheaderID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT suiteheaderID, subprojectID, label, comment, position, active, createdby, created, updatedby, updated 
        FROM suiteheader 
        WHERE suiteheaderID=?`,
        [suiteheaderID],
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
  // Get SuiteHeader by label
  // -----------------------------------------------------------
  getSuiteHeaderBylabel: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT suiteheaderID, comment, createdby, created, updatedby, updated 
         FROM suiteheader 
         WHERE subprojectID = ? AND label = ? 
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          data.subprojectID,
          data.label
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
  // Get all SuiteHeaders info from the table SuiteHeader for a subproject
  // ---------------------------------------------------------------------------
  getSuiteHeaderBySubProject: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT suiteheaderID, subprojectID, label, comment, position, active, createdby, created, updatedby, updated 
         FROM suiteheader 
         WHERE subprojectID=? ORDER BY LPAD(LOWER(position), 10, 0) asc`,
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
  // Update a SuiteHeader record 
  // ---------------------------------------------------------------------------
  updateSuiteHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE suiteheader SET label=?, comment=?, active=?, updatedby=?, updated=? 
         WHERE subprojectID = ? AND suiteheaderID = ?`,
        [
          data.label,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.subprojectID,
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
  // Update SuiteHeader position
  // -----------------------------------------------------------
  updateSuiteHeaderPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE suiteheader SET position = ? WHERE suiteheaderID = ?`,
        [
          data.position,
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
  // reorder all SuiteHeaders
  // -----------------------------------------------------------


  reorderSuiteHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE suiteheader AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, suiteheaderID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM suiteheader,
         (SELECT @row_number:=0) as t
          WHERE subprojectID=?
          ORDER BY subprojectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.suiteheaderID = T2.suiteheaderID`,
        [
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
  // Copy a SuiteHeader record
  // -----------------------------------------------------------
  copySuiteHeader: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO suiteheader ( subprojectID, label, comment, active, position, createdby, created, updatedby, updated )
         SELECT t1.subprojectID, t1.label, t1.comment, t1.active, ?, ?, ?, ?, ? 
         FROM suiteheader t1 WHERE t1.suiteheaderID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
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

  // ---------------------------------------------------------------------------
  // Delete a SuiteHeader
  // ---------------------------------------------------------------------------
  deleteSuiteHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM suiteheader WHERE subprojectID = ? AND suiteheaderID = ?`,
        [
          data.subprojectID,
          data.suiteheaderID
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
