const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-11-28 07:49:49 
 * @Last Modified by: Goffin Philippe
   * @Last Modified time: 2024-03-08 16:48
   * @Description: All the database services available for the API project
   */

  // -----------------------------------------------------------
  // Insert project info into the table project
  // -----------------------------------------------------------
  createProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into project(workspaceID, project, libraryID, comment, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?)`,
        [
          data.workspaceID,
          data.project,
          data.libraryID,
          data.comment,
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

  // -----------------------------------------------------------
  // Get project info data by the name
  // -----------------------------------------------------------
  getProjectByName: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, workspaceID, project, libraryID, comment, createdby, created, updatedby, updated 
         FROM project WHERE workspaceID = ? AND project = ?`,
        [
          data.workspaceID,
          data.project
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
  // Get project info data by the project ID
  // -----------------------------------------------------------
  getProjectById: (projectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, workspaceID, project, libraryID, comment, createdby, created, updatedby, updated 
         FROM project WHERE projectID = ?`,
        [projectID],
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
  // Get project info data by the name
  // -----------------------------------------------------------
  getProjectByName: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, workspaceID, project, libraryID, comment, createdby, created, updatedby, updated 
         FROM project WHERE workspaceID = ? AND project = ?`,
        [
          data.workspaceID,
          data.project  
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
  // Get all projects from a user from the table project / userproject
  // ---------------------------------------------------------------------------
  getProjectsByUser: (userId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT P.projectID, P.workspaceID, P.project, P.libraryID, P.comment, P.createdby, P.created, P.updatedby, P.updated, U.roleID, R.role 
         FROM project P, userproject U, role R 
         WHERE U.projectID = P.projectID AND U.workspaceID = P.workspaceID AND U.userId = ? AND U.roleID = R.roleID ORDER BY U.preference`,
        [userId],
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
  // Get all projects from a workspace 
  // ---------------------------------------------------------------------------
  getProjectsByWorkspace: (workspaceId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT projectID, workspaceID, project, libraryID, comment, createdby, created, updatedby, updated 
         FROM project WHERE workspaceID = ?`,
        [workspaceId],
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
  // Update project info based on the project ID
  // ---------------------------------------------------------------------------
  updateProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE project SET workspaceID=?, project=?, comment=?, libraryID=?, updatedby=?, updated=? 
         WHERE projectID = ?`,
        [
          data.workspaceID,
          data.project,
          data.comment,
          data.libraryID,
          data.user,
          data.today,
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

  // ---------------------------------------------------------------------------
  // Delete all project info based on the project ID
  // ---------------------------------------------------------------------------
  deleteProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM project WHERE workspaceID = ? AND projectID = ?`,
        [
          data.workspaceID,
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
