const mysql = require("../../config/database");

module.exports = {

 /*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Someone
 * @Last Modified time: 2025-05-27 07:27:19
 * @Description: All the database services available for the API AI Attribute
 */


  // -----------------------------------------------------------
  // Insert a new Attribute
  // -----------------------------------------------------------
  createAttribute: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_attribute(projectID, name, first, intermediate, last, comment, position, active) 
                  values(?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.name,
          data.first,
          data.intermediate,
          data.last,
          data.comment,
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
  // Get a Attribute
  // ---------------------------------------------------------------------------
  getAttribute: (attributeID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT attributeID, projectID, name, first, intermediate, last, comment, position, active 
         FROM ai_attribute WHERE attributeID=?`,
        [attributeID],
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
  // Get Attribute by project
  // -----------------------------------------------------------
  getAttributeByProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT attributeID, projectID, name, first, intermediate, last, comment, position, active 
         FROM ai_attribute WHERE projectID=? AND active like ?
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          data.projectID,
          (data.active != undefined ? data.active : '%'),
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
  // Update Attribute
  // ------------------------------------------------------------------------------------------
  updateAttribute: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_attribute SET name=?, first=?, intermediate=?, last=?, comment=?, active=? WHERE attributeID = ?`,
        [
          data.name,
          data.first,
          data.intermediate,
          data.last,
          data.comment,
          data.active,
          data.attributeID
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
  // Update Attribute position
  // ------------------------------------------------------------------------------------------
  updateAttributePosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_attribute SET position=? WHERE attributeID = ?`,
        [
          data.position,
          data.attributeID
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
  // reorder all Attributes
  // -----------------------------------------------------------
  reorderAttribute: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_attribute AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, attributeID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_attribute,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.attributeID = T2.attributeID`,
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
  // Copy a Attribute
  // -----------------------------------------------------------
  copyAttribute: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_attribute ( projectID, name, first, intermediate, last, comment, active, position )
        SELECT t1.projectID, t1.name, t1.first, t1.intermediate, t1.last, t1.comment, t1.active, ? 
        FROM ai_attribute t1 WHERE t1.attributeID = ?`,
        [
          data.position,
          data.attributeID
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
  // Delete a Attribute
  // --------------------------------------------------------------------------------------------
  deleteAttribute: (attributeID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_attribute WHERE attributeID = ?`,
        [
          attributeID        ],
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
  // Delete all attributes of a project
  // ---------------------------------------------------------------------------
  deleteAllAttribute: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_attribute WHERE projectID = ?`,
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
  
  // ---------------------------------------------------------------------------
  // Import Attribute
  // ---------------------------------------------------------------------------
  importAttribute: (data) => {
    const { importAttributes } = require("../playwright/library/file.library")
    let dataAPI = {}
    //console.log ('Data: ', data)

    return new Promise((resolve, reject) => {

      importAttributes(data.projectID, data.fileName).then((res) => {
        if (!res.success) {
          return reject(res);
        } else {
          return resolve(res);
        }
      })
    });
  },
  

};
