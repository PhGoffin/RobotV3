const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-30
 * @Last Modified by: 
   * @Last Modified time: 2024-10-04 13:11:57
   * @Description: All the database services available for the API function
   */

  // -----------------------------------------------------------
  // Insert Function info into the table Function
  // -----------------------------------------------------------
  createFunction: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into testfunction(functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, tip2, parameter2, defaultValue2, natural2, 
          tip3, parameter3, defaultValue3, natural3, tip4, parameter4, defaultValue4, natural4, position, active) 
                  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.functionName,
          data.rulefunction,
          data.comment,
          data.tip1,
          data.parameter1,
          data.defaultValue1,
          data.natural1,
          data.tip2,
          data.parameter2,
          data.defaultValue2,
          data.natural2,
          data.tip3,
          data.parameter3,
          data.defaultValue3,
          data.natural3,
          data.tip4,
          data.parameter4,
          data.defaultValue4,
          data.natural4,
          data.position,
          (data.active != undefined ? data.active : 1)
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
  // Get a Functions by id
  // ---------------------------------------------------------------------------
  getFunction: (functionID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT functionID, functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, tip2, parameter2, defaultValue2, natural2, 
        tip3, parameter3, defaultValue3, natural3, tip4, parameter4, defaultValue4, natural4, active, position 
        FROM testfunction 
        WHERE functionID=?`,
        [functionID],
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
  // Get a Functions by name
  // ---------------------------------------------------------------------------
  getFunctionByName: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT functionID, functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, tip2, parameter2, defaultValue2, natural2, 
        tip3, parameter3, defaultValue3, natural3, tip4, parameter4, defaultValue4, natural4, active, position 
        FROM testfunction 
        WHERE functionName=?`,
        [data.functionName],
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
  // Get All Functions
  // -----------------------------------------------------------
  getAllFunctions: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT functionID, functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, tip2, parameter2, defaultValue2, natural2, 
        tip3, parameter3, defaultValue3, natural1, tip4, parameter4, defaultValue4, natural4, active, position 
        FROM testfunction 
        ORDER BY LPAD(LOWER(position), 10, 0)`,
        [  ],
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
  // Update a Function record 
  // ---------------------------------------------------------------------------
  updateFunction: (data) => {
    //console.log ('Data:', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE testfunction SET functionName=?, rulefunction=?, comment=?, tip1=?, parameter1=?, defaultValue1=?, natural1=?, tip2=?, parameter2=?, defaultValue2=?, natural2=?, 
         tip3=?, parameter3=?, defaultValue3=?, natural3=?, tip4=?, parameter4=?, defaultValue4=?, natural4=?, active=?
         WHERE functionID = ?`,
        [
          data.functionName,
          data.rulefunction,
          data.comment,
          data.tip1,
          data.parameter1,
          data.defaultValue1,
          data.natural1,
          data.tip2,
          data.parameter2,
          data.defaultValue2,
          data.natural2,
          data.tip3,
          data.parameter3,
          data.defaultValue3,
          data.natural3,
          data.tip4,
          data.parameter4,
          data.defaultValue4,
          data.natural4,
          (data.active != undefined ? data.active : 1),
          data.functionID
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
  // Update Function position
  // -----------------------------------------------------------
  updateFunctionPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE testfunction SET position = ? WHERE functionID = ?`,
        [
          data.position,
          data.functionID
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
  // reorder all Functions
  // -----------------------------------------------------------

  reorderFunction: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE testfunction AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, functionID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM testfunction,
         (SELECT @row_number:=0) as t
          ORDER BY pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.functionID = T2.functionID`,
        [  ],
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
  // Copy a Function record
  // -----------------------------------------------------------
  copyFunction: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO testfunction ( functionName, rulefunction, comment, tip1, parameter1, defaultValue1, natural1, 
         tip2, parameter2, defaultValue2, natural2, tip3, parameter3, defaultValue3, natural3, tip4, parameter4, defaultValue4, natural4, active, position )
         SELECT t1.functionName, t1.rulefunction, t1.comment, t1.tip1, t1.parameter1, t1.defaultValue1, t1.natural1, 
         t1.tip2, t1.parameter2, t1.defaultValue2, t1.natural2, t1.tip3, t1.parameter3, t1.defaultValue3, t1.natural3,
         t1.tip4, t1.parameter4, t1.defaultValue4, t1.natural4, t1.active, ? 
         FROM testfunction t1 WHERE t1.functionID = ?`,
        [
          data.position,
          data.functionID
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
  // Delete a Function
  // ---------------------------------------------------------------------------
  deleteFunction: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM testfunction WHERE functionID = ?`,
        [
          data.functionID
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
