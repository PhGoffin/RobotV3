const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-21
 * @Last Modified by: Philippe Goffin
   * @Last Modified time: 2024-03-23 07:41:23
   * @Description: All the database services available for the API StoryHeader
   */

  // -----------------------------------------------------------
  // Insert StoryHeader info into the table StoryHeader
  // -----------------------------------------------------------
  createStoryHeader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into storyheader(subprojectID, label, comment, position, active, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?)`,
        [
          data.subprojectID,
          data.label,
          data.comment,
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
  // Get a StoryHeaders by id
  // ---------------------------------------------------------------------------
  getStoryHeader: (storyheaderID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT storyheaderID, subprojectID, label, comment, position, active, createdby, created, updatedby, updated 
         FROM storyheader 
         WHERE storyheaderID=?`,
        [storyheaderID],
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
  // Get StoryHeader by label
  // -----------------------------------------------------------
  getStoryHeaderBylabel: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT storyheaderID, comment, createdby, created, updatedby, updated  
         FROM storyheader WHERE subprojectID = ? AND label = ? 
         ORDER BY LPAD(LOWER(position), 10, 0)`,
        [
          data.subprojectID,
          data.label
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
  // Get all StoryHeaders info from the table StoryHeader for a project
  // ---------------------------------------------------------------------------
  getStoryHeaderBySubProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT storyheaderID, subprojectID, label, comment, position, active, createdby, created, updatedby, updated 
         FROM storyheader 
         WHERE subprojectID=? AND active >= ?
         ORDER BY LPAD(LOWER(position), 10, 0) asc`,
        [
          data.subprojectID,
          data.active
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
  // Update a StoryHeader record 
  // ---------------------------------------------------------------------------
  updateStoryHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE storyheader SET label=?, comment=?, active=?, updatedby=?, updated=?  
         WHERE subprojectID = ? AND storyheaderID = ?`,
        [
          data.label,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.subprojectID,
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
  // Update StoryHeader position
  // -----------------------------------------------------------
  updateStoryHeaderPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE storyheader SET position = ? WHERE storyheaderID = ?`,
        [
          data.position,
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
  // reorder all StoryHeaders
  // -----------------------------------------------------------

 
  reorderStoryHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(    
        `UPDATE storyheader AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, storyheaderID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM storyheader,
         (SELECT @row_number:=0) as t
          WHERE subprojectID=?
          ORDER BY subprojectID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.storyheaderID = T2.storyheaderID`,
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
  // Copy a StoryHeader record
  // -----------------------------------------------------------
  copyStoryHeader: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO storyheader ( subprojectID, label, comment, active, position, createdby, created, updatedby, updated )
         SELECT t1.subprojectID, t1.label, t1.comment, t1.active, ?, ?, ?, ?, ? 
         FROM storyheader t1 WHERE t1.storyheaderID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
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

  // ---------------------------------------------------------------------------
  // Delete a StoryHeader
  // ---------------------------------------------------------------------------
  deleteStoryHeader: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM storyheader WHERE subprojectID = ? AND storyheaderID = ?`,
        [
          data.subprojectID,
          data.storyheaderID
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
