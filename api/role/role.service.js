const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-09 
   * @Last Modified by: 
   * @Last Modified time: 2024-01-09 09:14:27
   * @Description: All the database services available for the API Role
   */


  // ---------------------------------------------------------------------------
  // Get all roles info from the table role
  // ---------------------------------------------------------------------------
  getRoles: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT roleID, role FROM role`,
        [],
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
