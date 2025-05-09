const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-10
   * @Last Modified by: 
   * @Last Modified time: 2024-10-02 10:29:01
   * @Description: All the database services available for the API Naturalheader
   */


  // -----------------------------------------------------------
  // Insert Naturalheader info into the table Naturalheader
  // -----------------------------------------------------------
  createNaturalheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_naturalheader(code, comment, position, active) 
                  values(?,?,?,?)`,
        [
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
  // Get all Naturalheader
  // ---------------------------------------------------------------------------
  getNaturalheader: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT naturalheaderID, code, comment, position, active 
        FROM ai_naturalheader
        ORDER BY LPAD(LOWER(position), 10, 0)`,
        [],
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
  // Get a Naturalheader by id
  // ---------------------------------------------------------------------------
  getNaturalheaderById: (NaturalheaderId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT naturalheaderID, code, comment, position, active 
        FROM ai_naturalheader WHERE naturalheaderId = ?`,
        [NaturalheaderId],
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
  // Get Naturalheader by code and active (optional)
  // ---------------------------------------------------------------------
  getNaturalheaderByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT naturalheaderID, code FROM ai_naturalheader WHERE code = ? AND active = ? ORDER BY language DESC`,
        [
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
  // Update a Naturalheader record 
  // ---------------------------------------------------------------------------
  updateNaturalheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_naturalheader SET code=?, comment=?, active=? WHERE naturalheaderID = ?`,
        [
          data.code,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.naturalheaderID
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
  // Update Naturalheader position
  // -----------------------------------------------------------
  updateNaturalheaderPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_naturalheader SET position = ? WHERE naturalheaderID = ?`,
        [
          data.position,
          data.naturalheaderID
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
  // reorder all Naturalheaders
  // -----------------------------------------------------------

  reorderNaturalheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_naturalheader AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, naturalheaderID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_naturalheader,
         (SELECT @row_number:=0) as t
          ORDER BY  pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.naturalheaderID = T2.naturalheaderID`,
        [
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
  // Copy a Naturalheader record
  // -----------------------------------------------------------
  copyNaturalheader: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_naturalheader ( code, comment, active, position )
        SELECT t1.code, t1.comment, t1.active, ? 
        FROM ai_naturalheader t1 WHERE t1.naturalheaderID = ?`,
        [
          data.position,
          data.naturalheaderID
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
  // Delete a record in the Naturalheader
  // ---------------------------------------------------------------------------
  deleteNaturalheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_naturalheader WHERE naturalheaderID = ?`,
        [
          data.naturalheaderID
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
