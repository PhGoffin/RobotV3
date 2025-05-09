const mysql = require("../../config/database");

module.exports = {

 /*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: 
 * @Last Modified time: 2024-04-24 16:37:01
 * @Description: All the database services available for the API AI Statistic
 */


  // -----------------------------------------------------------
  // Insert a new Statistic
  // -----------------------------------------------------------
  createStatistic: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_statistic(projectID, selectorID, pathID, pathValue, conditionValue, level, attributeID, value, position, active) 
                  values(?,?,?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.selectorID,
          data.pathID,
          data.pathValue,
          data.conditionValue,
          data.level,
          data.attributeID,
          data.value,
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
  // Get a Statistic
  // ---------------------------------------------------------------------------
  getStatistic: (statisticID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT statisticID, projectID, selectorID, pathID, pathValue, conditionValue, level, attributeID, value, position, active 
         FROM ai_statistic WHERE statisticID=?`,
        [statisticID],
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
  // Get Statistic by project
  // -----------------------------------------------------------
  getStatisticByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT statisticID, projectID, selectorID, pathID, pathValue, conditionValue, level, attributeID, value, position, active 
         FROM ai_statistic WHERE projectID=?`,
        [
          projectID
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
  // Get Statistic by path
  // -----------------------------------------------------------
  getStatisticByPath: (data) => {
    // console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT S.statisticID, S.projectID, S.selectorID, S.pathID, S.pathValue, S.conditionValue, S.level, S.attributeID, A.name, S.value, S.position, S.active 
         FROM ai_statistic S, ai_attribute A
         WHERE S.projectID=? AND S.pathID=? AND S.selectorID=? AND S.level=?
         AND A.attributeID = S.attributeID
         ORDER BY S.selectorID, S.pathID, S.level`,
        [
          data.projectID,
          data.pathID,
          data.selectorID,
          data.level
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



  // ------------------------------------------------------------------------------------------
  // Update Statistic
  // ------------------------------------------------------------------------------------------
  updateStatistic: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_statistic SET selectorID=?, pathID=?, pathValue=?, conditionValue=?, level=?, attributeID=?, value=?, active=? WHERE statisticID = ?`,
        [
          data.selectorID,
          data.pathID,
          data.pathValue,
          data.conditionValue,
          data.level,
          data.attributeID,
          data.value,
          data.active,
          data.statisticID
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
  // Update Statistic position
  // ------------------------------------------------------------------------------------------
  updateStatisticPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_statistic SET position=? WHERE statisticID = ?`,
        [
          data.position,
          data.statisticID
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
  // Update Statistic condition
  // ------------------------------------------------------------------------------------------
  updateStatisticCondition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_statistic SET conditionValue=? WHERE projectID=? AND pathID=? AND selectorID=?`,
        [
          data.conditionValue,
          data.projectID,
          data.pathID,
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
  // reorder all Statistics
  // -----------------------------------------------------------
  reorderStatistic: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_statistic AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, statisticID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_statistic,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.statisticID = T2.statisticID`,
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
  // Copy a Statistic
  // -----------------------------------------------------------
  copyStatistic: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_statistic ( projectID, selectorID, pathID, pathValue, conditionValue, level, attributeID, value, active, position )
        SELECT t1.projectID, t1.selectorID, t1.pathID, t1.pathValue, t1.conditionValue, t1.level, t1.attributeID, t1.value, t1.active, ? 
        FROM ai_statistic t1 WHERE t1.statisticID = ?`,
        [
          data.position,
          data.statisticID
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
  // Delete a Statistic
  // --------------------------------------------------------------------------------------------
  deleteStatistic: (statisticID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_statistic WHERE statisticID = ?`,
        [
          statisticID        ],
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
  // Delete all Statistics of a project
  // ---------------------------------------------------------------------------
  deleteAllStatistic: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_statistic WHERE projectID = ?`,
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
  

};
