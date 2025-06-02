const mysql = require("../../config/database");

module.exports = {

  /*
  * @Author: Philippe Goffin 
  * @Email: artcomputer123@gmail.com
  * @Date: 2024-04-17
 * @Last Modified by: Someone
  * @Last Modified time: 2025-06-02 09:43:15
  * @Description: All the database services available for the API AI TagAttribute
  */


  // -----------------------------------------------------------
  // Insert a new TagAttribute
  // -----------------------------------------------------------
  createTagAttribute: (data) => {
    return new Promise((resolve, reject) => {


      mysql.query(
        `insert into ai_tagattribute(projectID, trainingID, tagelementID, level, pathID, pathValue, attributeID, value, original, position, active) 
                  values(?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.trainingID,
          data.tagelementID,
          data.level,
          data.pathID,
          data.pathValue,
          data.attributeID,
          data.value,
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
  // Get a TagAttribute
  // ---------------------------------------------------------------------------
  getTagAttribute: (tagattributeID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT tagattributeID, projectID, trainingID, tagelementID, level, pathID, attributeID, pathValue, value, original, position, active 
         FROM ai_tagattribute WHERE tagattributeID=?`,
        [tagattributeID],
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
  // Get TagAttribute by project
  // -----------------------------------------------------------
  getTagAttributeByProject: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.tagattributeID, T.projectID, T.trainingID, T.tagelementID, T.level, T.pathID, P.fullPath, T.attributeID, A.name, T.pathValue, T.value, T.original, T.position, T.active 
         FROM ai_tagattribute T
         LEFT JOIN ai_path P
         ON T.pathID = P.pathID 
         AND T.projectID=?
         LEFT JOIN ai_attribute A
         ON T.attributeID = A.attributeID`,
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
  // Get TagAttribute by training (and by project)
  // -----------------------------------------------------------
  getTagAttributeByTraining: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        // `SELECT T.tagattributeID, T.projectID, T.trainingID, T.level, T.pathID, P.fullPath, T.attributeID, A.name, T.pathValue, T.value, T.position, T.active 
        //  FROM ai_tagattribute T
        //  LEFT JOIN ai_path P
        //  ON T.pathID = P.pathID 
        //  AND T.projectID=?
        //  AND T.trainingID=?
        //  LEFT JOIN ai_attribute A
        //  ON T.attributeID = A.attributeID`,
        `SELECT T.tagattributeID, T.projectID, T.trainingID, T.tagelementID, T.level, T.pathID, P.fullPath, T.attributeID, A.name, T.pathValue, T.value, T.original, T.position, T.active 
         FROM ai_tagattribute T, ai_path P, ai_attribute A
         WHERE T.pathID = P.pathID 
         AND T.projectID=?
         AND T.trainingID=?
         AND T.attributeID = A.attributeID
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

  // -----------------------------------------------------------
  // Get TagAttribute by tag element (and by project)
  // -----------------------------------------------------------
  getTagAttributeByTagelement: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.tagattributeID, T.projectID, T.trainingID, T.tagelementID, T.level, T.pathID, P.fullPath, T.attributeID, A.name, T.pathValue, T.value, T.original, T.position, T.active 
         FROM ai_tagattribute T, ai_path P, ai_attribute A
         WHERE T.pathID = P.pathID 
         AND T.projectID=?
         AND T.tagelementID=?
         AND T.attributeID = A.attributeID
         ORDER BY LPAD(LOWER(T.position), 10, 0)`,
        [
          data.projectID,
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
  // Get TagAttribute by pathID (and by project)
  // -----------------------------------------------------------
  getTagAttributeByPath: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT T.tagattributeID, T.projectID, T.trainingID, T.tagelementID, T.level, T.pathID, P.fullPath, T.attributeID, A.name, A.first, A.intermediate, A.last,
         T.pathValue, T.value, T.original, T.position, T.active, S.selectorID
         FROM ai_tagattribute T, ai_path P, ai_attribute A, ai_training S
         WHERE T.pathID = P.pathID 
         AND T.projectID=?
         AND T.pathID=?
         AND T.active = 1
         AND S.trainingID = T.trainingID
         AND S.selectorID = ?
         AND S.active = 1
         AND T.attributeID = A.attributeID
         ORDER BY T.level, T.attributeID `,
        [
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




  // ------------------------------------------------------------------------------------------
  // Update TagAttribute
  // ------------------------------------------------------------------------------------------
  updateTagAttribute: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagattribute SET level=?, pathID=?, pathValue=?, attributeID=?, value=?, active=? WHERE tagattributeID = ?`,
        [
          data.level,
          data.pathID,
          data.pathValue,
          data.attributeID,
          data.value,
          data.active,
          data.tagattributeID
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
  // Update TagAttribute position
  // ------------------------------------------------------------------------------------------
  updateTagAttributePosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagattribute SET position=? WHERE tagattributeID = ?`,
        [
          data.position,
          data.tagattributeID
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
  // reorder all TagAttributes
  // -----------------------------------------------------------
  reorderTagAttribute: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagattribute AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, tagattributeID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_tagattribute,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.tagattributeID = T2.tagattributeID`,
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
  // Copy a TagAttribute
  // -----------------------------------------------------------
  copyTagAttribute: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_tagattribute ( projectID, trainingID, tagelementID, level, pathID, attributeID, pathValue, value, original, active, position )
        SELECT t1.projectID, t1.trainingID, t1.tagelementID, t1.level, t1.pathID, t1.attributeID, t1.pathValue, t1.value, t1.original, t1.active, ? 
        FROM ai_tagattribute t1 WHERE t1.tagattributeID = ?`,
        [
          data.position,
          data.tagattributeID
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
  // Delete a TagAttribute (disable by replacing the value by '??')
  // --------------------------------------------------------------------------------------------
  deleteTagAttribute: (tagattributeID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        //`DELETE FROM ai_tagattribute WHERE tagattributeID = ?`,
        `UPDATE ai_tagattribute SET value = ?  WHERE tagattributeID = ?`,
        [ '??',
          tagattributeID],
        (error, results) => {
          //console.log ('Error: ', error)
          //console.log ('Results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // --------------------------------------------------------------------------------------------
  // Restore original TagAttribute 
  // --------------------------------------------------------------------------------------------
  restoreTagAttribute: (tagattributeID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_tagattribute SET value = original  WHERE tagattributeID = ?`,
        [ tagattributeID],
        (error, results) => {
          //console.log ('Error: ', error)
          //console.log ('Results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Delete all TagAttributes of a training (and project)
  // ---------------------------------------------------------------------------
  deleteAllTagAttribute: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_tagattribute 
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

  // ---------------------------------------------------------------------------
  // Delete all TagAttributes of a TagElement (and project)
  // ---------------------------------------------------------------------------
  deleteByTagElement: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_tagattribute 
        WHERE projectID = ? and tagelementID=?`,
        [
          data.projectID,
          data.tagelementID
        ],
        (error, results, fields) => {
          //console.log ('Error: ', error)
          //console.log ('Results: ', results)
          
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  }  



};
