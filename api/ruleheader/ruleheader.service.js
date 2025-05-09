const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-08
 * @Last Modified by: 
   * @Last Modified time: 2024-07-05 11:19:48
   * @Description: All the database services available for the API Rule Header
   */

  // -----------------------------------------------------------
  // Insert Ruleheader info into the table Ruleheader
  // -----------------------------------------------------------
  createRuleheader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ruleheader(rule, projectID, comment, position, active, createdby, created, updatedby, updated)
                  values(?,?,?,?,?,?,?,?,?)`,
        [
          data.rule,
          data.projectID,
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
  // Get a Ruleheaders by id
  // ---------------------------------------------------------------------------
  getRuleheader: (ruleheaderID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT ruleheaderID, projectID, rule, comment, position, active, createdby, created, updatedby, updated 
         FROM Ruleheader 
         WHERE ruleheaderID=?`,
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
  // Get active Ruleheaders by Rule
  // -----------------------------------------------------------
  getRuleheadersByCode: (rule) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT ruleheaderID, projectID, rule, comment, position, active, createdby, created, updatedby, updated  
         FROM ruleheader 
         WHERE rule = ? and active = 1 
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          rule
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
  // Get all Ruleheaders info by project
  // ---------------------------------------------------------------------------
  getRuleheadersByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT ruleheaderID, projectID, rule, comment, position, active, createdby, created, updatedby, updated 
         FROM ruleheader 
         WHERE projectID = ?  
         ORDER BY LPAD(LOWER(position), 10, 0)`,
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


  // ---------------------------------------------------------------------------
  // Update a Ruleheader record 
  // ---------------------------------------------------------------------------
  updateRuleheader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ruleheader SET rule=?, comment=?, active=?, updatedby=?, updated=?
         WHERE ruleheaderID = ?`,
        [
          data.rule,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
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

  // -----------------------------------------------------------
  // Update Ruleheader position
  // -----------------------------------------------------------
  updateRuleheaderPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ruleheader SET position = ? WHERE ruleheaderID = ?`,
        [
          data.position,
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

  // -----------------------------------------------------------
  // reorder all Ruleheaders
  // -----------------------------------------------------------

 
  reorderRuleheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
    
        `UPDATE ruleheader AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, ruleheaderID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ruleheader,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
         ORDER BY projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.ruleheaderID = T2.ruleheaderID `,
        [ data.projectID],
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
  // Copy a Ruleheader record
  // -----------------------------------------------------------
  copyRuleheader: (data) => {
    //console.log (data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ruleheader ( rule, projectID, comment, active, position, createdby, created, updatedby, updated )
         SELECT t1.rule, t1.projectID, t1.comment, t1.active, ?, ?, ?, ?, ? 
         FROM ruleheader t1 WHERE t1.ruleheaderID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
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


  // -----------------------------------------------------------
  // Import a Ruleheader record into another project
  // -----------------------------------------------------------
  importRuleheader: (data) => {
    //console.log ('importRuleheader: ', data)

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ruleheader ( rule, projectID, comment, active, position, createdby, created, updatedby, updated )
         SELECT ?, ?, t1.comment, t1.active, 99999, t1.createdby, t1.created, t1.updatedby, t1.updated
         FROM ruleheader t1 WHERE t1.projectID = ? AND t1.ruleheaderID = ?`,
        [
          data.ruleName,
          data.currentProjectID,
          data.projectID,
          data.ruleheaderID
        ],
        (error, results) => {
          if (error) {
            //console.log (error)
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Delete a Ruleheader
  // ---------------------------------------------------------------------------
  deleteRuleheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ruleheader WHERE ruleheaderID = ?`,
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
