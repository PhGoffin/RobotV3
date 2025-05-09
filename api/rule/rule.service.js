const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-01
 * @Last Modified by: 
   * @Last Modified time: 2024-07-05 09:44:02
   * @Description: All the database services available for the API Rule
   */

  // -----------------------------------------------------------
  // Insert Rule info into the table Rule
  // -----------------------------------------------------------
  createRule: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      // projectID, ruleheaderID, ruleContinue, condition, result, message, comment, position, active
      mysql.query(
        `insert into rule(projectID, ruleheaderID, ruleContinue, ruleCondition, ruleResult, ruleMessage, comment, position, active) 
                  values(?,?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.ruleheaderID,
          data.continue,
          data.condition,
          data.result,
          data.message,
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
  // Get a Rules by id
  // ---------------------------------------------------------------------------
  getRule: (ruleID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT R.ruleID, R.ruleheaderID, R.projectID, H.rule, R.ruleContinue, R.ruleCondition, R.ruleResult, R.ruleMessage, R.comment, R.commentType, R.position, R.active 
        FROM rule R, ruleheader H
        WHERE ruleID=? AND R.ruleheaderID = H.ruleheaderID`,
        [ruleID],
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
  // Get active Rules by rule code
  // -----------------------------------------------------------
  getRulesByCode: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT R.ruleID, R.ruleheaderID, R.projectID, H.rule, R.ruleContinue, R.ruleCondition, R.ruleResult, R.ruleMessage, R.comment, R.commentType, R.position, R.active  
         FROM rule R, ruleheader H
         WHERE H.projectID = ? AND H.rule = ? AND R.active = 1 AND R.ruleheaderID = H.ruleheaderID
         ORDER BY LPAD(LOWER(R.position), 10, 0)`,
        [
          data.projectID,
          data.ruleName
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
  // get Rules by dictionary word in the Result field
  // -----------------------------------------------------------
  getRulesByDictionary: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT R.ruleID, R.ruleheaderID, R.projectID, R.ruleResult, R.position, R.active  
         FROM rule R
         WHERE R.projectID = ? 
         AND R.ruleResult like ?`,
        [
          data.projectID,
          '%' + data.word + '%'
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
  // Get all Rules info from the table Rule
  // ---------------------------------------------------------------------------
  getRulesByProject: (projectID) => {
    //console.log ('ProjectID: ', projectID)
    return new Promise((resolve, reject) => {
      mysql.query(
        // `SELECT R.ruleID, R.ruleheaderID, R.projectID, H.rule, R.ruleContinue, R.ruleCondition, R.ruleResult, R.ruleMessage, R.comment, R.position, R.active 
        //  FROM rule R, ruleheader H
        //  WHERE R.projectID = ? AND R.ruleheaderID = H.ruleheaderID
        //  ORDER BY LPAD(LOWER(R.position), 10, 0)`,
        `SELECT H.ruleheaderID, H.projectID, H.rule, H.position, H.active 
         FROM ruleheader H
         WHERE H.projectID = ? 
         ORDER BY LPAD(LOWER(H.position), 10, 0)`,
        [projectID],
        (error, results, fields) => {
          //console.log ('error: ', error)
          //console.log ('results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Get all Rules info from the table Ruleheader
  // ---------------------------------------------------------------------------
  getRulesByHeader: (ruleheaderID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT R.ruleID, R.ruleheaderID, R.projectID, H.rule, R.ruleContinue, R.ruleCondition, R.ruleResult, R.ruleMessage, R.comment, R.commentType, R.position, R.active 
         FROM rule R, ruleheader H
         WHERE R.ruleheaderID = ? AND R.ruleheaderID = H.ruleheaderID
         ORDER BY LPAD(LOWER(R.position), 10, 0)`,
        [ruleheaderID],
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
  // Export rules into a json file
  // data.filename
  // data.ruleheaderID
  // -----------------------------------------------------------
  exportRule: async (data) => {
    const { getRulesByHeader } = require("./rule.service");

    console.log ('Data: ', data)

    let fs = require("fs")
    let myRuleData = [];
    let jsonRule = []

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
    fs.writeFileSync(data.filename, '{ "Rules": [] }', "utf8")

    // Read the file to parse a json format
    let content = fs.readFileSync(data.filename, 'utf8');
    // parse the json file
    try {
      jsonRule = JSON.parse(content);
      console.log ('File parsed')
    }
    catch (err) {
      console.log("exportTest Error: " + err.message);
    }

    // Read the tests of a scenario
    const result = await getRulesByHeader(data.ruleheaderID);
    if (!result.length) {
      console.log ('No rule available for the ruleheaderID: ' + data.ruleheaderID)
      result.affectedRows = 0
      return (result.length)
    }

    // Push the rules into a json array
    for (let elt = 0; elt < result.length; elt++) {
      //console.log ('Push: ' + result[elt].testID)
      jsonRule["Rules"].push({
        ruleID: result[elt].ruleID, position: result[elt].position, comment: result[elt].comment, commentType: result[elt].commentType, continue: result[elt].continue, 
        condition: result[elt].ruleCondition, result: result[elt].ruleResult, message: result[elt].ruleMessage,
        active: result[elt].active
      })
    }

    try {
      fs.writeFileSync(data.filename, JSON.stringify(jsonRule), "utf8")
      result.affectedRows = result.length
      return (result)
    } catch (err) {
      console.log("Error writing data into json file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }

  },


  // ---------------------------------------------------------------------------
  // Update a Rule record 
  // ---------------------------------------------------------------------------
  updateRule: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE rule set ruleContinue=?, ruleCondition=?, ruleResult=?, ruleMessage=?, comment=?, commentType=?, active=? WHERE ruleID = ?`,
        [
          data.continue,
          data.condition,
          data.result,
          data.message,
          data.comment,
          data.commentType,
          (data.active != undefined ? data.active : 1),
          data.ruleID
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
  // Update Rule position
  // -----------------------------------------------------------
  updateRulePosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE rule SET position = ? WHERE ruleID = ?`,
        [
          data.position,
          data.ruleID
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
  // Update Rule result
  // -----------------------------------------------------------
  updateRuleResult: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE rule SET ruleResult = ? WHERE ruleID = ?`,
        [
          data.ruleResult,
          data.ruleID
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
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE rule SET active = ? WHERE ruleID = ?`,
        [
          data.active,
          data.ruleID
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
  // Update test comment type
  // -----------------------------------------------------------
  updateCommentType: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE rule SET commentType = ? WHERE ruleID = ?`,
        [
          data.commentType,
          data.ruleID
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
  // reorder all Rules
  // -----------------------------------------------------------
  reorderRule: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(

        `UPDATE rule AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, ruleID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM Rule,
         (SELECT @row_number:=0) as t
          WHERE ruleheaderID=?
          ORDER BY ruleheaderID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.ruleID = T2.ruleID `,
        [data.ruleheaderID],
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
  // Copy a Rule record
  // -----------------------------------------------------------
  copyRule: (data) => {
    //console.log ('Data:', data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO rule ( projectID, ruleheaderID,  ruleContinue, ruleCondition, ruleResult, ruleMessage, comment, commentType, active, position )
        SELECT t1.projectID, t1.ruleheaderID, t1.ruleContinue, t1.ruleCondition, t1.ruleResult, t1.ruleMessage,  t1.comment, t1.commentType, t1.active, ? FROM rule t1 WHERE t1.ruleID = ?`,
        [
          data.position,
          data.ruleID
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
  // Copy all Rules from the same ruleheader
  // -----------------------------------------------------------
  copyAllRules: (data) => {
    //console.log (data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO rule ( projectID, ruleheaderID, ruleContinue, ruleCondition, ruleResult, ruleMessage, comment, commentType, active, position )
         SELECT t1.projectID, ?, t1.ruleContinue, t1.ruleCondition, t1.ruleResult, t1.ruleMessage,  t1.comment, t1.commentType, t1.active, t1.position 
         FROM rule t1 WHERE t1.ruleheaderID = ?`,
        [
          data.ruleheaderIDCopy,
          data.ruleheaderIDOrigin
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
  // Import all Rules from the another project
  // -----------------------------------------------------------
  importRule: (data) => {
    //console.log ('importRule: ', data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO rule ( projectID, ruleheaderID, ruleContinue, ruleCondition, ruleResult, ruleMessage, comment, commentType, active, position )
         SELECT ?, ?, t1.ruleContinue, t1.ruleCondition, t1.ruleResult, t1.ruleMessage, t1.comment, t1.commentType, t1.active, t1.position 
         FROM rule t1 WHERE projectID = ? AND t1.ruleheaderID = ?`,
        [
          data.currentProjectID,
          data.currentRuleheaderID,
          data.projectID,
          data.ruleheaderID
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
  // Delete a Rule
  // ---------------------------------------------------------------------------
  deleteRule: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM rule WHERE ruleID = ?`,
        [
          data.ruleID
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
  // Delete all Rules from a ruleheader
  // ---------------------------------------------------------------------------
  deleteAllRules: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM rule WHERE ruleheaderID = ?`,
        [
          data.ruleheaderID
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
