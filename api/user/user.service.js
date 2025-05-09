const mysql = require("../../config/database");

module.exports = {

  /*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:49:49 
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-08 16:01
 * @Description: All the database services available for the API user
 */

  // -----------------------------------------------------------
  // Insert user data into the table user
  // -----------------------------------------------------------
  createUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into user(workspaceID, login, password, firstName, lastName, email, superuser,active, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.workspaceID,
          data.login,
          data.password,
          data.firstName,
          data.lastName,
          data.email,
          (data.superuser != undefined ? data.superuser : 0),
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
  // Get all users based on the table user
  // ---------------------------------------------------------------------------
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT U.workspaceID, W.workspace, U.userID, U.login, U.password, U.firstName, U.lastName, U.email, 
         U.superuser, U.active, U.createdby, U.created, U.updatedby, U.updated 
         FROM user U, workspace W 
         WHERE U.workspaceID = W.workspaceID`,
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

  // -----------------------------------------------------------
  // Link a user to a project into the table userproject
  // -----------------------------------------------------------
  linkProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into userproject(userID, workspaceID, projectID, roleID, preference, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?)`,
        [
          data.userID,
          data.workspaceID,
          data.projectID,
          data.roleID,
          data.preference,
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
  // Get user data by the user login (password is processed by the controller)
  // ---------------------------------------------------------------------------
  getUserByLogin: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT userID, login, password, firstName, lastName, email, superuser, active, createdby, created, updatedby, updated  
         FROM user 
         WHERE (workspaceID = ? OR superuser = 1) AND login = ?`,
        [
          data.workspaceID,
          data.login
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    })
  },

  // ---------------------------------------------------------------------------
  // Get user data by the user ID
  // ---------------------------------------------------------------------------
  getUserByUserId: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT userID, login, password, firstName, lastName, email, superuser, active, createdby, created, updatedby, updated 
         FROM user 
         WHERE workspaceID = ? AND userID = ?`,
        [
          data.workspaceID,
          data.userID
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
  // Get all users from a project based on the table user and userproject
  // ---------------------------------------------------------------------------
  getUsersByProjectId: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT P.userprojectID, P.projectID, U.userID, U.login, U.firstName, U.lastName, U.email, U.active, P.createdby, P.created, P.updatedby, P.updated,
         U.superuser, P.roleID, R.role, P.preference 
         FROM user U, userproject P, role R 
         WHERE P.workspaceID = ? AND U.userID = P.userID and P.projectID = ? and P.roleID = R.roleID`,
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
  },

  // ---------------------------------------------------------------------------
  // Get all free users (user not linked to a project)
  // ---------------------------------------------------------------------------
  getFreeUsersByProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT  U.userID, U.login, U.firstName, U.lastName, U.email, U.active, U.superuser, U.createdby, U.created, U.updatedby, U.updated 
        FROM user U  
        WHERE U.active = 1 AND U.userID NOT IN (SELECT P.userID FROM userproject P WHERE  P.workspaceID = ? AND P.projectID = ?)`,
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
  },

  // ---------------------------------------------------------------------------
  // Get detail of a free user (user linked to a project)
  // ---------------------------------------------------------------------------
  getLinkedUser: (userprojectID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT UP.userprojectID, UP.workspaceID, UP.projectID, UP.userID, U.login, U.firstName, U.lastName, 
         UP.roleID, UP.preference, UP.createdby, UP.created, UP.updatedby, UP.updated 
         FROM userproject UP, user U 
         WHERE  UP.userprojectID = ? AND UP.userID = U.userID`,
        [userprojectID],
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
  // Update linked user from the table userproject
  // ---------------------------------------------------------------------------
  updateLinkedUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE userproject SET roleID=?, preference=?, updatedby=?, updated=? 
         WHERE workspaceID = ? AND projectID = ? AND userprojectID = ?`,
        [
          data.roleID,
          data.preference,
          data.user,
          data.today,
          data.workspaceID,
          data.projectID,
          data.userprojectID
        ],
        (error, results) => {
          if (error) {
            //console.log ("Error");
            return reject(error);
          }
          //console.log ("Success");
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Delete a linked user from the table userproject
  // ---------------------------------------------------------------------------
  deleteLinkedUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM userproject WHERE workspaceID = ? AND userprojectID = ?`,
        [
          data.workspaceID,
          data.userprojectID
        ],
        (error, results) => {
          if (error) {
            //console.log ("Error");
            return reject(error);
          }
          //console.log ("Success");
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Get all active users from a workspace based on the table user
  // ---------------------------------------------------------------------------
  getUsersByWorkspaceId: (workspaceId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT userID, login, password, firstName, lastName, email, superuser, active, createdby, created, updatedby, updated  
         FROM user WHERE workspaceID = ? AND active = 1`,
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
  // Check if a user is linked to a project based on the table userproject
  // ---------------------------------------------------------------------------
  isUserOnProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT count(userID) as isOnProject FROM userproject WHERE workspaceID = ? AND projectID = ? AND userID = ?`,
        [
          data.workspaceID,
          data.projectID,
          data.userID
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
  // Check if a user is linked to a project based on the table userproject
  // ---------------------------------------------------------------------------
  getRoleOfUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT R.role FROM userproject U, role R WHERE U.roleID = R.roleID AND U.workspaceID = ? AND U.projectID = ? AND U.userID = ?`,
        [
          data.workspaceID,
          data.projectID,
          data.userID
        ],
        (error, result, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Update user data based on user ID (workspace cannot be updated)
  // ---------------------------------------------------------------------------
  updateUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE user SET login=?, firstName=?, lastName=?, email=?, superuser=?, active=?, updatedby=?, updated=?  
         WHERE workspaceID = ? AND userID = ?`,
        [
          data.login,
          data.firstName,
          data.lastName,
          data.email,
          (data.superuser != undefined ? data.superuser : 0),
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.workspaceID,
          data.userID
        ],
        (error, results) => {
          if (error) {
            //console.log ("Error");
            return reject(error);
          }
          //console.log ("Success");
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------
  // Update user password based on user ID
  // ---------------------------------------------------------------------------
  updatePassword: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE user SET password=? WHERE workspaceID = ? AND userID = ?`,
        [
          data.password,
          data.workspaceID,
          data.userID
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
  // Delete all user data based on user ID
  // ---------------------------------------------------------------------------
  deleteUser: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM user WHERE workspaceID = ? AND userID = ?`,
        [
          data.workspaceID,
          data.userID
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
  // Delete a user in all the project link
  // ---------------------------------------------------------------------------
  unlinkProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM userproject WHERE workspaceID = ? AND projectID = ? AND userID = ?`,
        [
          data.workspaceID,
          data.projectID,
          data.userID
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

};
