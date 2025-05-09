const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-05
   * @Last Modified by: 
   * @Last Modified time: 2024-05-28 11:32:23
   * @Description: All the database services available for the API DatasetHeader
   */

  // -----------------------------------------------------------
  // Insert Datasetheader info into the table Datasetheader
  // -----------------------------------------------------------
  createDatasetheader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into datasetheader(subprojectID, code, comment, position, active) 
                  values(?,?,?,?,?)`,
        [
          data.subprojectID,
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
  // Get a Datasetheaders by id
  // ---------------------------------------------------------------------------
  getDatasetheader: (datasetheaderId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT datasetheaderID, subprojectID, code, comment, position, active FROM datasetheader 
        WHERE datasetheaderID=?`,
        [datasetheaderId],
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
  // Get Datasetheader by code
  // -----------------------------------------------------------
  getDatasetheaderByCode: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT datasetheaderID, comment FROM datasetheader WHERE subprojectID = ? AND code = ? ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          data.subprojectID,
          data.code
        ],
        (error, results, fields) => {
          //console.log ('Results: ', results)
          //console.log ('Error: ', error)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Get all Datasetheaders info from the table Datasetheader for a project
  // ---------------------------------------------------------------------------
  getDatasetheaderBySubProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT datasetheaderID, subprojectID, code, comment, position, active FROM datasetheader 
         WHERE subprojectID=? ORDER BY LPAD(LOWER(position), 10, 0) asc`,
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


  // ---------------------------------------------------------------------------
  // Update a Datasetheader record 
  // ---------------------------------------------------------------------------
  updateDatasetheader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE datasetheader SET code=?, comment=?, active=? WHERE subprojectID = ? AND datasetheaderID = ?`,
        [
          data.code,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.subprojectID,
          data.datasetheaderID

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
  // Update Datasetheader position
  // -----------------------------------------------------------
  updateDatasetheaderPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE datasetheader SET position = ? WHERE datasetheaderID = ?`,
        [
          data.position,
          data.datasetheaderID
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
  // reorder all Datasetheaders
  // -----------------------------------------------------------

 
  reorderDatasetheader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(    
        `UPDATE datasetheader AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, datasetheaderID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM datasetheader,
         (SELECT @row_number:=0) as t
          WHERE subprojectID=?
          ORDER BY subprojectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.datasetheaderID = T2.datasetheaderID`,
        [
          data.subprojectID
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
  // Copy a Datasetheader record
  // -----------------------------------------------------------
  copyDatasetheader: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO datasetheader ( subprojectID, code, comment, active, position )
        SELECT t1.subprojectID, t1.code, t1.comment, t1.active, ? FROM datasetheader t1 WHERE t1.datasetheaderID = ?`,
        [
          data.position,
          data.datasetheaderID
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
  // Import Datasetheader
  // ---------------------------------------------------------------------------
  importDatasetheader: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO datasetheader ( subprojectID, code, comment, position, active )
         SELECT ?, ?, t1.comment, 99999, t1.active 
         FROM datasetheader t1 WHERE t1.datasetheaderID = ?`,
        [
          data.currentSubprojectID,
          data.datasetheaderName,
          data.datasetheaderID,
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
  // Delete a Datasetheader
  // ---------------------------------------------------------------------------
  deleteDatasetheader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM datasetheader WHERE subprojectID = ? AND datasetheaderID = ?`,
        [
          data.subprojectID,
          data.datasetheaderID
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
