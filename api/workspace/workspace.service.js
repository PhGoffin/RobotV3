const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-11-28 07:49:49 
 * @Last Modified by: Goffin Philippe
   * @Last Modified time: 2024-03-08 15:08
   * @Description: All the database services available for the API workspace
   */

  // -----------------------------------------------------------
  // Insert workspace info into the table workspace
  // -----------------------------------------------------------
  createWorkspace: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into workspace(licenseID, workspace, comment, active, createdby, created, updatedby, updated )) 
                  values(?,?,?,?,?,?,?,?)`,
        [
          data.licenseID,
          data.workspace,
          data.comment,
          (data.active ? data.active : 1),
          data.user,
          data.today,
          data.user,
          data.today,
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
  // Get workspace by ID
  // -----------------------------------------------------------
  getWorkspaceById: (id) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT W.workspaceID, W.workspace, W.licenseID, L.license, W.comment, W.active, W.createdby, W.created, W.updatedby, W.updated  
        FROM workspace W, license L
        WHERE W.workspaceID = ?
        AND W.licenseID = L.licenseID`,
        [ id ],
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
  // Get workspace by name
  // -----------------------------------------------------------
  getWorkspaceByName: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT workspaceID, licenseID, comment, active, createdby, created, updatedby, updated  
         FROM workspace 
         WHERE workspace = ? and active = ?`,
        [
          data.workspace,
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
  // Get all workspaces info from the table workspace
  // ---------------------------------------------------------------------------
  getWorkspaces: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT workspaceID, licenseID, workspace, comment, active, createdby, created, updatedby, updated 
         FROM workspace`,
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
  // Update a workspace record 
  // ---------------------------------------------------------------------------
  updateWorkspace: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE workspace SET workspace=?, licenseID=?, comment=?, active=?, updatedby=?, updated=?  
         WHERE workspaceID = ?`,
        [
          data.workspace,
          data.licenseID,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.workspaceID,

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
  // Delete a workspace
  // ---------------------------------------------------------------------------
  deleteWorkspace: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM workspace WHERE workspaceID = ?`,
        [
          data.workspaceID
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
