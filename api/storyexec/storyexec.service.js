const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-28
 * @Last Modified by: 
   * @Last Modified time: 2024-07-10 14:12:48
   * @Description: All the database services available for the API Exec
   */

  // ---------------------------------------------------------------------------
  // Get all Stories with the execution
  // ---------------------------------------------------------------------------
  getExecutedStory: () => {   
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT S.*, E.userID, E.count  FROM  story S
        LEFT JOIN storyexec E ON S.storyID = E.storyID
        UNION
        SELECT S.*, E.userID, E.count FROM  story S
        RIGHT JOIN storyexec E ON S.storyID = E.storyID
        ORDER BY storyheaderID, LPAD(LOWER(position), 10, 0) asc`,
        [ ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          //console.log ('results', results)
          return resolve(results);
        }
      );
    });
  },

  
  // -----------------------------------------------------------
  // Reset all executed Story record
  // -----------------------------------------------------------
  resetExecutedStory: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO storyexec ( storyheaderID, storyID, userID, count )
        SELECT t1.storyheaderID, t1.storyID, ?, 0 FROM story t1 WHERE t1.storyheaderID = ?`,
        [
          data.userID,
          data.storyheaderID
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
  // Update the counter
  // -----------------------------------------------------------
  counterExecutedStory: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE storyexec SET count = ? WHERE storyheaderID = ? AND storyID = ? AND userID = ?`,
        [
          data.count,
          data.storyheaderID,
          data.storyID,
          data.userID
        ],
        (error, results) => {
          //console.log ('Results:', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },  

  // ---------------------------------------------------------------------------
  // Delete all Story of a headerStory
  // ---------------------------------------------------------------------------
  deleteExecutedStory: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM storyexec WHERE storyheaderID = ? AND userID = ?`,
        [
          data.storyheaderID,
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
  }

};
