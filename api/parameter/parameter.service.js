const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-26
 * @Last Modified by: 
   * @Last Modified time: 2024-05-24 11:37:16
   * @Description: All the database services available for the API Parameter
   */

  // -----------------------------------------------------------
  // Insert a Parameter
  // -----------------------------------------------------------
  createParameter: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into parameter(projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active) 
                  values(?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          (data.storyheaderID != undefined ? data.storyheaderID : 0),
          data.code,
          data.paramValue,
          data.inputoutput,
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

  // -----------------------------------------------------------
  // Get Parameter by projectID
  // -----------------------------------------------------------
  getParametersByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT parameterID, projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active FROM parameter 
        WHERE projectID = ? AND storyheaderID = 0
        ORDER BY LPAD(LOWER(position), 10, 0) asc`,
        [ projectID ],
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
  // Get Parameter by projectID and storyheaderID
  // -----------------------------------------------------------
  getParametersByStory: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT parameterID, projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active FROM parameter WHERE projectID = ? AND storyheaderID=? ORDER BY LPAD(LOWER(position), 10, 0) asc`,
        [ data.projectID,
          data.storyheaderID
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
  // Get Parameter by Code (active and projectID)
  // -----------------------------------------------------------
  getParametersByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT parameterID, projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active FROM parameter WHERE projectID = ? AND code = ? AND active = 1`,
        [
          data.projectID,
          data.code
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
  // Get detail of a Parameter
  // ---------------------------------------------------------------------------
  getParameter: (parameterID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT parameterID, projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active FROM parameter WHERE parameterID = ?`,
        [parameterID],
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
  // Update a Parameter record 
  // ---------------------------------------------------------------------------
  updateParameter: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE parameter SET code=?, paramValue=?, inputoutput=?, comment=?, active=? WHERE parameterID = ?`,
        [
          data.code,
          data.paramValue,
          data.inputoutput,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.parameterID,
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
  // Update parameter position
  // -----------------------------------------------------------
  updateParameterPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE parameter SET position = ? WHERE parameterID = ?`,
        [
          data.position,
          data.parameterID
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
  // reorder all Parameters
  // -----------------------------------------------------------

  reorderParameter: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE parameter AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, parameterID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3   
          FROM parameter,
         (SELECT @row_number:=0) as t
          WHERE  projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.parameterID = T2.parameterID`,     
        [
          data.projectID,
        ],
        (error, results) => {
          //console.log ('Error: ', error)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },  

  // -----------------------------------------------------------
  // Copy a parameter record
  // -----------------------------------------------------------
  copyParameter: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO parameter ( projectID, storyheaderID, code, paramValue, inputoutput, comment, position, active )
        SELECT t1.projectID, t1.storyheaderID, t1.code, t1.paramValue, t1.inputoutput, t1.comment, ?, t1.active FROM parameter t1 WHERE t1.parameterID = ?`,
        [
          data.position,
          data.parameterID
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
  // Delete a Parameter
  // ---------------------------------------------------------------------------
  deleteParameter: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM parameter WHERE parameterID = ?`,
        [
          data.parameterID
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
