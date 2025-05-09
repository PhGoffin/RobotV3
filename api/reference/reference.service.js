const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-11-28 07:49:49 
 * @Last Modified by: 
   * @Last Modified time: 2024-12-19 07:21:49
   * @Description: All the database services available for the API reference
   */

  // -----------------------------------------------------------
  // Insert reference info into the table reference
  // -----------------------------------------------------------
  createReference: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into reference(projectID, userID, code, label, comment, position, active) 
                  values(?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.userID,
          data.code,
          data.label,
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
  // Get a references by id
  // ---------------------------------------------------------------------------
  getReference: (referenceId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT referenceID, projectID, userID, code, label, 99 as inputoutput, comment, position, active FROM reference 
        WHERE referenceID=?`,
        [referenceId],
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
  // Get reference by code
  // -----------------------------------------------------------
  getReferenceByCode: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {

      try {
        mysql.query(
          `SELECT referenceID, label, 99 as inputoutput FROM reference WHERE projectID = ? AND userID=? AND code = ? ORDER BY LPAD(LOWER(position), 10, 0)`,
          [
            data.projectID,
            data.userID,
            data.code
          ],
          (error, results, fields) => {
            //console.log('Result: ', results)
            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        );        
      } catch (err) {
        console.log('getReferenceByCode: Fatal error: Browser not responding!')
        return reject({ success: 0, message: "Stop Browser not responding!" })
      }
    });
  },


  // ---------------------------------------------------------------------------
  // Get all references info from the table reference for a project
  // ---------------------------------------------------------------------------
  getReferenceByProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT referenceID, projectID, userID, code, label, 99 as inputoutput, comment, position, active FROM reference 
         WHERE projectID=? AND userID=? ORDER BY LPAD(LOWER(position), 10, 0) asc`,
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

  // ---------------------------------------------------------------------------------------------------------------------
  // get the references ready for the dashboard (by projectID, userID and defined in the active parameter of the project)
  // ---------------------------------------------------------------------------------------------------------------------
  getReferenceByDashboard: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        //  `select R.referenceID, R.projectID, R.userID, R.code, R.label, R.comment, R.position, R.active from reference R
        //  INNER JOIN parameter P 
        //  ON P.code = 'Reference' AND P.active = 1 AND P.paramValue = R.code AND R.projectID = ? and R.userID = ? and P.storyheaderID=?
        //  ORDER BY LPAD(LOWER(P.position), 6, 0)`,    
        `select R.referenceID, R.projectID, R.userID, R.code, R.label, P.inputoutput, R.comment, P.comment as paramComment, R.position, R.active 
         from reference R, parameter P
         WHERE P.code = 'Reference' AND P.active = 1 AND P.paramValue = R.code AND R.projectID = ? and R.userID = ? and P.storyheaderID=?
         ORDER BY LPAD(LOWER(P.position), 6, 0)`,
        [
          data.projectID,
          data.userID,
          data.storyheaderID
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          //console.log (results)
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Update a reference record 
  // ---------------------------------------------------------------------------
  updateReference: (data) => {
    //console.log('Data: ', data)

    return new Promise((resolve, reject) => {

      try {
        mysql.query(
          `UPDATE reference SET code=?, label=?, comment=?, active=? WHERE projectID = ? AND userID= ? AND referenceID = ?`,
          [
            data.code,
            data.label,
            data.comment,
            (data.active != undefined ? data.active : 1),
            data.projectID,
            data.userID,
            data.referenceID

          ],
          (error, results) => {
            // console.log('Results: ', results)
            // console.log('Error: ', error)

            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        );
      } catch (err) {
        console.log('updateReference: Fatal error: Browser not responding!')
        return reject({ success: 0, message: "Stop Browser not responding!" })
      }

    });
  },

  // -----------------------------------------------------------
  // Update reference position
  // -----------------------------------------------------------
  updateReferencePosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE reference SET position = ? WHERE referenceID = ?`,
        [
          data.position,
          data.referenceID
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
  // reorder all References
  // -----------------------------------------------------------

  reorderReference: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE reference AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, referenceID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM reference,
         (SELECT @row_number:=0) as t
          WHERE projectID=? AND userID=?
          ORDER BY  projectID, userID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.referenceID = T2.referenceID`,
        [
          data.projectID,
          data.userID
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
  // Copy a reference record
  // -----------------------------------------------------------
  copyReference: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO reference ( projectID, userID, code, label, comment, active, position )
        SELECT t1.projectID, t1.userID, t1.code, t1.label, t1.comment, t1.active, ? FROM reference t1 WHERE t1.referenceID = ?`,
        [
          data.position,
          data.referenceID
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
  // Delete a reference
  // ---------------------------------------------------------------------------
  deleteReference: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM reference WHERE projectID = ? AND userID= ? AND referenceID = ?`,
        [
          data.projectID,
          data.userID,
          data.referenceID
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
  // Delete all the references of the user
  // ---------------------------------------------------------------------------
  deleteAllReference: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM reference WHERE projectID = ? AND userID= ?`,
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
  }

};
