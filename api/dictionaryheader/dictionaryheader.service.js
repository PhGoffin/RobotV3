const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-09
   * @Last Modified by: 
   * @Last Modified time: 2023-12-06 14:45:29
   * @Description: All the database services available for the API Dictionaryheader
   */


  // -----------------------------------------------------------
  // Insert Dictionaryheader info into the table Dictionaryheader
  // -----------------------------------------------------------
  createDictionaryheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into dictionaryheader(projectID, code, comment, position, active) 
                  values(?,?,?,?,?)`,
        [
          data.projectID,
          data.code,
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
  // Get a Dictionaryheader by id
  // ---------------------------------------------------------------------------
  getDictionaryheader: (DictionaryheaderId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dictionaryheaderID, projectId, code, comment, position, active 
        FROM dictionaryheader WHERE dictionaryheaderId = ?`,
        [DictionaryheaderId],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },  
  // ---------------------------------------------------------------------
  // Get Dictionaryheader by code and active (optional)
  // ---------------------------------------------------------------------
  getDictionaryheaderByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dictionaryheaderID, code FROM dictionaryheader WHERE projectID = ? AND code = ? AND active = ? ORDER BY language DESC`,
        [
          data.projectID,
          data.code,
          (data.active ? data.active : 1)
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
  // Get all records from the table Dictionaryheader by project
  // ---------------------------------------------------------------------------
  getDictionaryheaderByProject: (projectId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dictionaryheaderID, projectId, code, comment, position, active 
        FROM dictionaryheader WHERE projectID = ?
        ORDER BY LPAD(LOWER(position), 10, 0)`,
        [projectId],
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
  // Update a Dictionaryheader record 
  // ---------------------------------------------------------------------------
  updateDictionaryheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dictionaryheader SET code=?, comment=?, active=? WHERE dictionaryheaderID = ? AND projectID = ?`,
        [
          data.code,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.dictionaryheaderID,
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
  // Update Dictionaryheader position
  // -----------------------------------------------------------
  updateDictionaryheaderPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dictionaryheader SET position = ? WHERE dictionaryheaderID = ?`,
        [
          data.position,
          data.dictionaryheaderID
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
  // reorder all Dictionaryheaders
  // -----------------------------------------------------------

  reorderDictionaryheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dictionaryheader AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, dictionaryheaderID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM dictionaryheader,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.dictionaryheaderID = T2.dictionaryheaderID`,
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
  // Copy a Dictionaryheader record
  // -----------------------------------------------------------
  copyDictionaryheader: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO dictionaryheader ( projectID, code, comment, active, position )
        SELECT t1.projectID, t1.code, t1.comment, t1.active, ? 
        FROM dictionaryheader t1 WHERE t1.dictionaryheaderID = ?`,
        [
          data.position,
          data.dictionaryheaderID
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
  // Delete a record in the Dictionaryheader
  // ---------------------------------------------------------------------------
  deleteDictionaryheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM dictionaryheader WHERE dictionaryheaderID = ? and projectID = ?`,
        [
          data.dictionaryheaderID,
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
  }

};
