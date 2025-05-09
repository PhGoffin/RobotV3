const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-21
 * @Last Modified by: 
   * @Last Modified time: 2024-11-08 07:20:12
   * @Description: All the database services available for the API Story
   */

  // -----------------------------------------------------------
  // Insert Story info into the table Story
  // -----------------------------------------------------------
  createStory: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into story(storyheaderID, scenarioID, suiteID, story, graphlabel, position, active) 
                  values(?,?,?,?,?,?,?)`,
        [
          data.storyheaderID,
          data.scenarioID,
          data.suiteID,
          data.story,
          data.graphlabel,
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
  // Get a Stories by id
  // ---------------------------------------------------------------------------
  getStory: (storyID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.storyID, D.storyheaderID, D.scenarioID, D.suiteID, D.comment, H.label as headerlabel, D.story, D.graphlabel, D.position, D.active 
        FROM story D, storyheader H
        WHERE D.storyID=? AND D.storyheaderID=H.storyheaderID`,
        [storyID],

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
  // Get Story by Storyheader and code (Story)
  // -----------------------------------------------------------
  getStoryByCode: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.storyID, D.story, D.comment 
        FROM story D, storyheader H 
        WHERE D.subprojectID = ? 
        AND D.story = ?
        and D.active = ?
        AND D.storyheaderID = H.storyheaderID 
        ORDER BY LPAD(LOWER(D.position), 10, 0)`,
        [
          data.subprojectID,
          data.story,
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
  // Get all Stories info from the table Storyheader
  // ---------------------------------------------------------------------------
  getStoryByHeader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.storyID, D.storyheaderID, scenarioID, suiteID, D.comment, H.label as headerlabel, D.story, D.graphlabel, D.position, D.active 
        FROM story D, storyheader H 
         WHERE D.storyheaderID=? 
         AND D.storyheaderID = H.storyheaderID
         AND D.active like ?
         ORDER BY LPAD(LOWER(D.position), 10, 0) asc`,
        [
          data.storyheaderID,
          data.active,
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
  // Update a Story record 
  // ---------------------------------------------------------------------------
  updateStory: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE story SET story=?, graphlabel=?, scenarioID=?, suiteID=?, comment=?, active=? WHERE storyID = ?`,
        [
          data.story,
          data.graphlabel,
          data.scenarioID,
          data.suiteID,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.storyID

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
  // Update Story position
  // -----------------------------------------------------------
  updateStoryPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE story SET position = ? WHERE storyID = ?`,
        [
          data.position,
          data.storyID
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
  // reorder all Stories
  // -----------------------------------------------------------

 
  reorderStory: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(    
        `UPDATE story AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, storyID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM story,
         (SELECT @row_number:=0) as t
          WHERE storyheaderID=?
          ORDER BY storyheaderID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.storyID = T2.storyID`,
        [
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
  // Copy a Story record
  // -----------------------------------------------------------
  copyStory: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO story ( storyheaderID, scenarioID, suiteID, comment, story, graphlabel, active, position )
        SELECT t1.storyheaderID, t1.scenarioID, t1.suiteID, t1.comment, t1.story, t1.graphlabel, t1.active, ? FROM story t1 WHERE t1.storyID = ?`,
        [
          data.position,
          data.storyID
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
  // Copy all Story of a headerStory
  // -----------------------------------------------------------
  copyAllStory: (data) => {

    console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO story ( storyheaderID, scenarioID, suiteID, comment, story, graphlabel, active, position )
        SELECT ?, t1.scenarioID, t1.suiteID, t1.comment, t1.story, t1.graphlabel, t1.active, t.position FROM story t1 WHERE t1.storyheaderID = ?`,
        [
          data.storyheaderIDCopy,
          data.storyheaderIDOrigin
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
  // Delete a Story
  // ---------------------------------------------------------------------------
  deleteStory: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM story WHERE storyID = ?`,
        [
          data.storyID
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
  // Delete all Story of a headerStory
  // ---------------------------------------------------------------------------
  deleteAllStory: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM story WHERE storyheaderID = ? `,
        [
          data.storyheaderID,
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
