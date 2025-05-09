const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-10
 * @Last Modified by: Philippe Goffin
   * @Last Modified time: 2025-01-23 07:48:17
   * @Description: All the database services available for the API natural
   */


  // -----------------------------------------------------------
  // Insert natural info into the table natural
  // -----------------------------------------------------------
  createNatural: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into ai_natural(naturalheaderID, code, label, comment, language, position, active) 
                  values(?,?,?,?,?,?,?)`,
        [
          data.naturalheaderID,
          data.code,
          data.label,
          data.comment,
          data.language,
          data.position,
          (data.active != undefined ? data.active : 1)
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
  // Get a natural by id
  // ---------------------------------------------------------------------------
  getNatural: (naturalId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.naturalID, D.naturalheaderID, CONCAT(H.code, D.code) as fullcode, H.code as headercode, D.code, 
         D.label, D.comment, D.language, D.position, D.active 
         FROM ai_natural D, ai_naturalheader H
         WHERE D.naturalId = ? AND D.naturalheaderID = H.naturalheaderID`,
        [naturalId],
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
  // Get natural by full code and language (optional) and active (optional)
  // ---------------------------------------------------------------------
  getNaturalByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.naturalID, D.label
         FROM ai_natural D, ai_naturalheader H 
         WHERE concat (H.code, D.code) = ? 
         AND ( D.language = ? OR D.language = '*') AND D.active = ? 
         AND D.naturalheaderID = H.naturalheaderID 
         ORDER BY D.language DESC`,
        [
          data.code,
          (data.language ? data.language : '*'),          
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
  // Get all records from the table natural by a header
  // ---------------------------------------------------------------------------
  getNaturalByHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.naturalID, D.naturalheaderID, CONCAT(H.code, D.code) as fullcode, H.code as headercode, D.code,
         D.label, D.comment, D.language, D.position, D.active 
         FROM ai_natural D, ai_naturalheader H
         WHERE D.naturalheaderID = ?
         AND D.naturalheaderID = H.naturalheaderID 
         ORDER BY LPAD(LOWER(D.position), 10, 0)`,
        [data.naturalheaderID],
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
  // Update a natural record 
  // ---------------------------------------------------------------------------
  updateNatural: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_natural SET code=?, label=?, comment=?, language=?, active=?  
         WHERE naturalID = ?`,
        [
          data.code,
          data.label,
          data.comment,
          (data.language ? data.language : '*'),          
          (data.active != undefined ? data.active : 1),
          data.naturalID
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
  // Update Natural position
  // -----------------------------------------------------------
  updateNaturalPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_natural SET position = ? WHERE naturalID = ?`,
        [
          data.position,
          data.naturalID
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
  // reorder all Naturals
  // -----------------------------------------------------------

  reorderNatural: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE ai_natural AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, naturalID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM ai_natural,
         (SELECT @row_number:=0) as t
         WHERE naturalheaderID=?
          ORDER BY  naturalheaderID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.naturalID = T2.naturalID`,
        [
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
  // Copy a Natural record
  // -----------------------------------------------------------
  copyNatural: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_natural ( naturalheaderID, code, label, comment, language, active, position)
        SELECT t1.naturalheaderID, t1.code, t1.label, t1.comment, t1.language, t1.active, ? 
        FROM ai_natural t1 WHERE t1.naturalID = ?`,
        [
          data.position,
          data.naturalID
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
  // Copy all Natural records from a naturalheader
  // -----------------------------------------------------------
  copyAllNatural: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO ai_natural ( naturalheaderID, code, label, comment, language, active, position )
        SELECT t1.code, t1.label, t1.comment, t1.language, t1.active, t1.position 
        FROM ai_natural t1 WHERE t1.naturalheaderID = ?`,
        [
          data.naturalheaderIDCopy,
          data.naturalheaderIDOrigin
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
  // Delete a record in the natural
  // ---------------------------------------------------------------------------
  deleteNatural: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(       
        `DELETE FROM ai_natural WHERE naturalheaderID = ? AND naturalID = ?`,
        [
          data.naturalheaderID,
          data.naturalID
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
  // Delete all natural record linked to a naturalheader
  // ---------------------------------------------------------------------------
  deleteAllNatural: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM ai_natural WHERE naturalheaderID = ?`,
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
