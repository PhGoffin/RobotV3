const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-28
 * @Last Modified by: 
   * @Last Modified time: 2025-01-17 11:26:58
   * @Description: All the database services available for the API Test
   */

  // -----------------------------------------------------------
  // Insert a Test
  // -----------------------------------------------------------
  createTest: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into test(scenarioID, action, comment, commentType, transpose, testCondition, functionID, parameter1, parameter2, parameter3, parameter4, active, position) 
                  values(?,?,?,1,?,?,?,?,?,?,?,?,?)`,
        [
          data.scenarioID,
          data.action,
          data.comment,
          data.transpose,
          data.testCondition,
          data.functionID,
          data.parameter1,
          data.parameter2,
          data.parameter3,
          data.parameter4,
          (data.active != undefined ? data.active : 1),
          data.position,
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
  // Get Tests by scenarioID
  // -----------------------------------------------------------
  getTestByScenario: (scenarioID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.testID, T.scenarioID, S.scenario, T.action, T.comment, T.commentType, T.transpose, T.testCondition, T.functionID, F.functionName,
         T.parameter1, F.defaultValue1, F.tip1, F.parameter1 as label1, 
         T.parameter2, F.defaultValue2, F.tip2, F.parameter2 as label2,
         T.parameter3, F.defaultValue3, F.tip3, F.parameter3 as label3, 
         T.parameter4, F.defaultValue4, F.tip4, F.parameter4 as label4, 
         T.active, T.position 
         FROM test T, testfunction F, scenario S 
         WHERE T.scenarioID = ? AND F.functionID = T.functionID
         AND T.scenarioID = S.scenarioID
         ORDER BY LPAD(LOWER(T.position), 6, 0) asc`,
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
  // Get Test by dictionary (used in parameter1, 2, 3 or 4)
  // -----------------------------------------------------------
  getTestByDictionary: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.testID, T.scenarioID, S.scenario, T.action, T.comment, T.commentType, T.transpose, T.testCondition, T.functionID,
         T.parameter1, T.parameter2, T.parameter3, T.parameter4, T.active, T.position 
         FROM test T, scenario S 
         WHERE S.subprojectID = ?
         AND T.scenarioID = S.scenarioID
         AND (T.parameter1 = ? OR T.parameter2 = ? OR T.parameter3 = ? OR T.parameter4 = ?)`,
        [data.subprojectID,
        data.word,
        data.word,
        data.word,
        data.word,
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
  // Get detail of a test
  // ---------------------------------------------------------------------------
  getTest: (testID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.testID, T.scenarioID, S.scenario, T.action, T.comment, T.commentType, T.transpose, T.testCondition, T.functionID, F.functionName,
        T.parameter1, F.defaultValue1, F.tip1, F.parameter1 as label1, 
        T.parameter2, F.defaultValue2, F.tip2, F.parameter2 as label2,
        T.parameter3, F.defaultValue3, F.tip3, F.parameter3 as label3, 
        T.parameter4, F.defaultValue4, F.tip4, F.parameter4 as label4, 
        T.active, T.position 
        FROM test T, testfunction F, scenario S 
        WHERE T.testID = ? AND F.functionID = T.functionID AND S.scenarioID = T.scenarioID `,
        [testID],
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
  // Update a Test record 
  // ---------------------------------------------------------------------------
  updateTest: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE test SET action=?, comment=?, commentType=?, transpose=?, testCondition=? ,functionID=?, parameter1=?, parameter2=?, parameter3=?, parameter4=?, active=?  WHERE testID = ?`,
        [
          data.action,
          data.comment,
          data.commentType,
          data.transpose,
          data.testCondition,
          data.functionID,
          data.parameter1,
          data.parameter2,
          data.parameter3,
          data.parameter4,
          (data.active != undefined ? data.active : 1),
          data.testID
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
  // Update Test Parameters
  // ---------------------------------------------------------------------------
  updateTestParameter: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE test SET parameter1=?, parameter2=?, parameter3=?, parameter4=? WHERE testID = ?`,
        [
          data.parameter1,
          data.parameter2,
          data.parameter3,
          data.parameter4,
          data.testID
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
  // Update test active status
  // -----------------------------------------------------------
  updateActive: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE test SET active = ? WHERE testID = ?`,
        [
          data.active,
          data.testID
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
  // Update test active status
  // -----------------------------------------------------------
  updateCommentType: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE test SET commentType = ? WHERE testID = ?`,
        [
          data.commentType,
          data.testID
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
  // Update test position
  // -----------------------------------------------------------
  updateTestPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE test SET position = ? WHERE testID = ?`,
        [
          data.position,
          data.testID
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
  // reorder all Tests
  // -----------------------------------------------------------

  reorderTest: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE test AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, testID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 7, 4), 4, 0) as pos4 
          FROM test,
         (SELECT @row_number:=0) as t
          WHERE scenarioID=?
          ORDER BY scenarioID, pos6, pos4) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.testID = T2.testID`,
        [
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

  // -----------------------------------------------------------
  // Import a test record
  // -----------------------------------------------------------
  importTest: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO test ( scenarioID, action, comment, commentType, transpose, testCondition, functionID, parameter1, parameter2, parameter3, parameter4, active, position )
         SELECT ?, t1.action, t1.comment, t1.commentType, t1.transpose, t1.testCondition, t1.functionID, t1.parameter1, t1.parameter2, t1.parameter3, t1.parameter4, t1.active, ? 
         FROM test t1 WHERE t1.testID = ?`,
        [
          data.currentScenarioID,
          data.position,
          data.testID
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
  // Export tests into a json file
  // data.filename
  // data.scenarioID
  // -----------------------------------------------------------
  exportTest: async (data) => {
    const { getTestByScenario } = require("./test.service");

    //console.log ('Data: ', data)

    let fs = require("fs")
    let myTestData = [];
    let jsonTest = []

    try {
      fs.statSync(data.filename)
      fs.unlink(data.filename, function (err) {
        if (err) return console.log(err)
        console.log('file deleted successfully')
      })      
    } catch (err) {
      console.log ('file not exists')
    }

    // Write a empty template
    fs.writeFileSync(data.filename, '{ "Tests": [] }', "utf8")

    // Read the file to parse a json format
    let content = fs.readFileSync(data.filename, 'utf8');
    // parse the json file
    try {
      jsonTest = JSON.parse(content);
      console.log ('File parsed')
    }
    catch (err) {
      console.log("exportTest Error: " + err.message);
    }

    // Read the tests of a scenario
    const result = await getTestByScenario(data.scenarioID);
    if (!result.length) {
      console.log ('No test available for the scenarioID: ' + data.scenarioID)
      result.affectedRows = 0
      return (result.length)
    }

    //jsonTest.push({Tests: myTestData})

    // Push the tests into a json array
    for (let elt = 0; elt < result.length; elt++) {
      //console.log ('Push: ' + result[elt].testID)
      jsonTest["Tests"].push({
        testID: result[elt].testID, position: result[elt].position, action: result[elt].action,
        comment: result[elt].comment, commentType: result[elt].commentType, transpose: result[elt].transpose, condition: result[elt].testCondition,  function: result[elt].functionName,
        param1: result[elt].parameter1, param2: result[elt].parameter2,
        param3: result[elt].parameter3, param4: result[elt].parameter4, active: result[elt].active
      })
    }

    try {
      fs.writeFileSync(data.filename, JSON.stringify(jsonTest), "utf8")
      result.affectedRows = result.length
      return (result)
    } catch (err) {
      console.log("Error writing data into json file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }

  },


  // -----------------------------------------------------------
  // Copy a test record
  // -----------------------------------------------------------
  copyTest: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO test ( scenarioID, action, comment, commentType, transpose, testCondition, functionID, parameter1, parameter2, parameter3, parameter4, active, position )
        SELECT t1.scenarioID, t1.action, t1.comment, t1.commentType, t1.transpose, t1.testCondition, t1.functionID, t1.parameter1, t1.parameter2, t1.parameter3, t1.parameter4, t1.active, ? FROM test t1 WHERE t1.testID = ?`,
        [
          data.position,
          data.testID
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
  // Copy all tests linked to a scenario
  // -----------------------------------------------------------
  copyAllTest: (data) => {
    //console.log ('Data: ', data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO test ( scenarioID, action, comment, commentType, transpose, testCondition, functionID, parameter1, parameter2, parameter3, parameter4, active, position )
         SELECT ?, t1.action, t1.comment, t1.commentType, t1.transpose, t1.testCondition, t1.functionID, t1.parameter1, t1.parameter2, t1.parameter3, t1.parameter4, t1.active, t1.position 
         FROM test t1 WHERE t1.scenarioID = ?`,
        [
          data.scenarioIDCopy,
          data.scenarioIDOrigin
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
  // Delete a Test
  // ---------------------------------------------------------------------------
  deleteTest: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM test WHERE testID = ?`,
        [
          data.testID
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
  // Delete a Test
  // ---------------------------------------------------------------------------
  deleteAllTest: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM test WHERE scenarioID = ?`,
        [
          data.scenarioID
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
