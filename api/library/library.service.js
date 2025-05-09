const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-12-21 07:49:49 
   * @Last Modified by: 
   * @Last Modified time: 2023-12-21 15:57:27
   * @Description: All the database services available for the API library
   */



  // ---------------------------------------------------------------------------
  // Get all the libraries from the table library
  // ---------------------------------------------------------------------------
  getLibrary: () => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT libraryID, library, comment FROM library`,
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



};
