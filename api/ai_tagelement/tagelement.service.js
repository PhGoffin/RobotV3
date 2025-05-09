const mysql = require("../../config/database");

module.exports = {

  /*
  * @Author: Philippe Goffin 
  * @Email: artcomputer123@gmail.com
  * @Date: 2024-04-20
 * @Last Modified by: 
  * @Last Modified time: 2024-07-29 11:20:27
  * @Description: All the database services available for the API AI TagElement
  */


  // -----------------------------------------------------------
  // Insert a new TagElement
  // -----------------------------------------------------------
  createTagElement: (data) => {
    return new Promise((resolve, reject) => {


      mysql.query(
        `insert into ai_tagelement(projectID, trainingID, pathID, selectorID, position, active) 
                  values(?,?,?,?,?,?)`,
        [
          data.projectID,
          data.trainingID,
          data.pathID,
          data.selectorID,
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
  // Get a TagElement
  // ---------------------------------------------------------------------------
  getTagElement: (tagelementID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT tagelementID, projectID, trainingID, pathID, selectorID, position, active 
         FROM ai_tagelement WHERE tagelementID=?`,
        [tagelementID],
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
  // Get TagElement by project
  // -----------------------------------------------------------
  getTagElementByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.tagelementID, T.projectID, T.trainingID, T.pathID, P.fullPath, T.selectorID, S.name as selectorName, T.position, T.active 
         FROM ai_tagelement T, ai_path P, ai_selector S
         WHERE T.pathID = P.pathID 
         AND T.selectorID = S.selectorID
         AND T.projectID=?
         ORDER BY LPAD(LOWER(T.position), 10, 0)`,
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
  // Get distinct path TagElement by project
  // -----------------------------------------------------------
  getPathTagElement: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT DISTINCT T.pathID, P.fullPath, P.weight
         FROM ai_tagelement T, ai_path P, ai_training S
         WHERE T.pathID = P.pathID 
         AND S.trainingID = T.trainingID
         AND S.active = 1
         AND T.active = 1
         AND T.projectID=?
         AND T.selectorID=?`,
        [
          data.projectID,
          data.selectorID
        ],
        (error, results, fields) => {
          // console.log('Error: ', error)
          // console.log('Results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // Get TagElement by pattern
  // -----------------------------------------------------------
  getTagElementByPattern: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT X.patternID, P.fullPath, S.name
         FROM ai_tagelement T, ai_path P, ai_selector S, pattern X
         WHERE T.tagelementID = ? 
         AND P.pathID = T.pathID
         AND S.selectorID = T.selectorID
         AND X.selector = S.name
         AND X.path = P.fullPath
         AND X.active = 1`,
        [
          data.tagelementID
        ],
        (error, results, fields) => {
          // console.log('Error: ', error)
          // console.log('Results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },




  // -----------------------------------------------------------
  // Get TagElement by training (and by project)
  // -----------------------------------------------------------
  getTagElementByTraining: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(

        `SELECT T.tagelementID, T.projectID, T.trainingID, T.pathID, P.fullPath, T.selectorID, S.name as selectorName, T.position, T.active 
         FROM ai_tagelement T, ai_path P, ai_selector S
         WHERE T.pathID = P.pathID 
         AND T.selectorID = S.selectorID
         AND T.projectID=?
         AND T.trainingID=?
         ORDER BY LPAD(LOWER(T.position), 10, 0)`,         
        [
          data.projectID,
          data.trainingID
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
  // Update TagElement
  // ------------------------------------------------------------------------------------------
  updateTagElement: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagelement SET pathID=?, selectorID=?, active=? WHERE tagelementID = ?`,
        [
          data.pathID,
          data.selectorID,
          data.active,
          data.tagelementID
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
  // Update TagElement position
  // ------------------------------------------------------------------------------------------
  updateTagElementPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagelement SET position=? WHERE tagelementID = ?`,
        [
          data.position,
          data.tagelementID
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
  // reorder all TagElements
  // -----------------------------------------------------------
  reorderTagElement: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagelement AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, tagelementID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_tagelement,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.tagelementID = T2.tagelementID`,
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
  // Copy a TagElement
  // -----------------------------------------------------------
  copyTagElement: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_tagelement ( projectID, trainingID, pathID, selectorID, active, position )
        SELECT t1.projectID, t1.trainingID, t1.pathID, t1.selectorID, t1.active, ? 
        FROM ai_tagelement t1 WHERE t1.tagelementID = ?`,
        [
          data.position,
          data.tagelementID
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
  // Delete a TagElement
  // --------------------------------------------------------------------------------------------
  deleteTagElement: (tagelementID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_tagelement WHERE tagelementID = ?`,
        [
          tagelementID],
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
  // Delete all TagElements of a training (and project)
  // ---------------------------------------------------------------------------
  deleteAllTagElement: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_tagelement 
        WHERE projectID = ? and trainingID=?`,
        [
          data.projectID,
          data.trainingID
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
