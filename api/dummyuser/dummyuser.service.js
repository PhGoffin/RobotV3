const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-07
 * @Last Modified by: 
   * @Last Modified time: 2024-11-27 08:02:19
   * @Description: All the database services available for the API dummy users
   */


  // -----------------------------------------------------------
  // Insert a dummy user info into the table Dummyuser
  // -----------------------------------------------------------
  createDummyuser: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into dummyuser(projectID, dummy, user, password, crypted, extraInfo, position, active, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.projectID,
          data.dummy,
          data.user,
          data.password,
          (data.crypted != undefined ? data.crypted : 0),
          data.extraInfo,
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
  // Get a dummyuser by id
  // ---------------------------------------------------------------------------
  getDummyuser: (dummyuserID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dummyuserID, projectId, dummy, user, crypted, password, extraInfo, position, active, createdby, created, updatedby, updated 
        FROM dummyuser WHERE dummyuserId = ?`,
        [dummyuserID],
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
  // Get dummyuser by user and by project
  // ---------------------------------------------------------------------
  getDummyuserByUser: (data) => {
    //console.log(data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dummyuserID, projectId, dummy, user, crypted, password, extraInfo, position, active, createdby, created, updatedby, updated 
         FROM dummyuser 
         WHERE projectID = ? AND dummy = ? AND active = ?`,
        [
          data.projectID,
          data.dummy,
          (data.active ? data.active : 1)
        ],
        (error, results, fields) => {
          // console.log ('Error:', error)
          // console.log ('results:', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Get all dummyuser records by project
  // ---------------------------------------------------------------------------
  getDummyuserByProject: (projectId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT dummyuserID, projectId, dummy, user, crypted, password, extraInfo, position, active, createdby, created, updatedby, updated 
         FROM dummyuser 
         WHERE projectID = ?
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
  // Update a dummyuser record 
  // ---------------------------------------------------------------------------
  updateDummyuser: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dummyuser SET dummy=?, user=?, crypted=?, password=?, extraInfo=?, active=?, updatedby=?, updated=?  
         WHERE dummyuserID = ? AND projectID = ?`,
        [
          data.dummy,
          data.user,
          data.crypted,
          data.password,
          data.extraInfo,
          (data.active != undefined ? data.active : 1),
          data.userName,
          data.today,
          data.dummyuserID,
          data.projectID
        ],
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

  // -----------------------------------------------------------
  // Update dummyuser position
  // -----------------------------------------------------------
  updateDummyuserPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dummyuser SET position = ? WHERE dummyuserID = ?`,
        [
          data.position,
          data.dummyuserID
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
  // reorder all dummyusers
  // -----------------------------------------------------------
  reorderDummyuser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dummyuser AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, dummyuserID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM dummyuser,
         (SELECT @row_number:=0) as t
         WHERE projectID=?
          ORDER BY  projectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.dummyuserID = T2.dummyuserID`,
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
  // Copy a Dummyuser record
  // -----------------------------------------------------------
  copyDummyuser: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO dummyuser ( projectID, dummy, user, crypted, password, extraInfo, active, position, createdby, created, updatedby, updated )
        SELECT t1.projectID, t1.dummy, t1.user, t1.crypted, t1.password, t1.extraInfo, t1.active, ?, ?, ?, ?, ? 
        FROM dummyuser t1 WHERE t1.dummyuserID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
          data.dummyuserID
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
  // Delete a record in the dummyuser
  // ---------------------------------------------------------------------------
  deleteDummyuser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM dummyuser WHERE dummyuserID = ? and projectID = ?`,
        [
          data.dummyuserID,
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
