const mysql = require("../../config/database");

module.exports = {

 /*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-20 11:20:45
 * @Description: All the database services available for the API AI Training
 */


  // -----------------------------------------------------------
  // Insert a new Training
  // -----------------------------------------------------------
  createTraining: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_training(subprojectID, selectorID, criteria, position, active, createdby, created) 
                  values(?,?,?,?,?,?,?)`,
        [
          data.subprojectID,
          data.selectorID,
          data.criteria,
          data.position,
          data.active,
          data.createdby,
          data.created
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
  // Get a Training
  // ---------------------------------------------------------------------------
  getTraining: (trainingID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT trainingID, subprojectID, selectorID, criteria, position, active, createdby, created
         FROM ai_training WHERE trainingID=?`,
        [trainingID],
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
  // Get Training by project
  // -----------------------------------------------------------
  getTrainingByProject: (subprojectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.trainingID, T.subprojectID, T.selectorID, S.name as selector,
         T.criteria, T.position, T.active, T.createdby, T.created 
         FROM ai_training T, ai_selector S 
         WHERE T.subprojectID=?
         AND S.selectorID = T.selectorID
         ORDER BY LPAD(LOWER(T.position), 10, 0)`,
        [
          subprojectID
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
  // Update Training
  // ------------------------------------------------------------------------------------------
  updateTraining: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_training SET selectorID=?, criteria=?, active=?, createdby=?, created=?  WHERE trainingID = ?`,
        [
          data.selectorID,
          data.criteria,
          data.active,
          data.createdby,
          data.created,
          data.trainingID
        ],
        (error, results, fields) => {
          // console.log ('Error: ', error)
          // console.log ('Results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );  
    });
  },

  // ------------------------------------------------------------------------------------------
  // Update Training active status
  // ------------------------------------------------------------------------------------------
  updateTrainingActive: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_training SET active=? WHERE trainingID = ?`,
        [
          data.active,
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
  // Update Training position
  // ------------------------------------------------------------------------------------------
  updateTrainingPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_training SET position=? WHERE trainingID = ?`,
        [
          data.position,
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

  // -----------------------------------------------------------
  // reorder all Trainings
  // -----------------------------------------------------------
  reorderTraining: (data) => {
    //console.log ('Reorder Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_training AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, trainingID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_training,
         (SELECT @row_number:=0) as t
         WHERE subprojectID=?
          ORDER BY  subprojectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.trainingID = T2.trainingID`,
        [
          data.subprojectID
        ],
        (error, results) => {
          // console.log ('Error: ', error)
          // console.log ('Results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },  

  // -----------------------------------------------------------
  // Copy a Training
  // -----------------------------------------------------------
  copyTraining: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_training ( subprojectID, selectorID, criteria, active, createdby, created, position )
        SELECT t1.subprojectID, t1.selectorID, t1.criteria, t1.active, t1.createdby, t1.created, ? 
        FROM ai_training t1 WHERE t1.trainingID = ?`,
        [
          data.position,
          data.trainingID
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
  // Delete a Training
  // --------------------------------------------------------------------------------------------
  deleteTraining: (trainingID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_training WHERE trainingID = ?`,
        [
          trainingID        ],
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
  // Delete all Trainings of a project
  // ---------------------------------------------------------------------------
  deleteAllTraining: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_training WHERE subprojectID = ?`,
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
  
  

};
