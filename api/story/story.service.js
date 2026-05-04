const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-02-21
   * @Last Modified by: Someone
   * @Last Modified time: 2026-04-30 13:37:04
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

    console.log(data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO story ( storyheaderID, scenarioID, suiteID, comment, story, graphlabel, active, position )
        SELECT ?, t1.scenarioID, t1.suiteID, t1.comment, t1.story, t1.graphlabel, t1.active, t1.position FROM story t1 WHERE t1.storyheaderID = ?`,
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
  },

  // -----------------------------------------------------------
  // Export story into a curl file
  // storyName, storyheaderID, storyID, projectID, subprojectID, userID, userName, resetLog, url, filename
  // -----------------------------------------------------------
  exportStory: async (data) => {


    console.log('Data: ', data)

    let fs = require("fs")
    let result = {}


    /*
    
    // Write a curl file
    let curlContent = "@echo off" + '\n'
    curlContent = curlContent + "setlocal EnableDelayedExpansion"
    curlContent = curlContent + " REM ================================================" + '\n'
    curlContent = curlContent + " REM Playwright Story Execution curl Script" + '\n'
    curlContent = curlContent + " REM Generated automatically by the Robot" + '\n'
    curlContent = curlContent + " REM" + '\n'
    curlContent = curlContent + " REM Please, rename the file into a .bat file" + '\n'
    curlContent = curlContent + " REM ================================================" + '\n'
    curlContent = curlContent + '\n'
    curlContent = curlContent + " set API_URL=" + data.url+ "playwright/robot/story" + '\n'
    curlContent = curlContent + '\n'
    curlContent = curlContent + " set PAYLOAD={^" +
    "\"storyName\": \"" + data.storyName + "\"" +
                                              ", \"storyheaderID\":" + data.storyheaderID +
                                              ", \"storyID\":" + data.storyID +
                                              ", \"projectID\":" + data.projectID +
                                              ", \"subprojectID\":" + data.subprojectID + 
                                              ", \"userID\":" + data.userID +
                                              ", \"userName\": \"" +data.userName + "\"" +
                                              ", \"resetLog\":" + data.resetLog + " }" + '\n'
    curlContent = curlContent + " curl -X POST \"%API_URL%\" ^" + '\n'
    curlContent = curlContent + "   -H \"Content-Type: application/json\" ^" + '\n'
    curlContent = curlContent + "   -d \"%PAYLOAD%\"" + '\n'
    curlContent = curlContent + '\n'
    curlContent = curlContent + "pause" + '\n'


    try {
      fs.writeFileSync(data.filename, curlContent, "utf8")
      result.affectedRows = 1
      return (result)
    } catch (err) {
      console.log("Error writing data into curl file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }
  */

    /*
        try {
          const payloadObj = {
            storyName: data.storyName,
            storyheaderID: data.storyheaderID,
            storyID: data.storyID,
            projectID: data.projectID,
            subprojectID: data.subprojectID,
            userID: data.userID,
            userName: data.userName,
            resetLog: data.resetLog
          };
    
          // Convert to JSON
          const payloadJson = JSON.stringify(payloadObj);
    
          // Escape quotes for CMD
          const payloadForBat = payloadJson.replace(/"/g, '\\"');
    
          console.log(payloadForBat);
    
          const batContent = `@echo off
          setlocal EnableDelayedExpansion
    
          set API_URL=http://localhost:5000/api/playwright/robot/story
          set PAYLOAD=${payloadForBat}
    
          curl -X POST "%API_URL%" ^
            -H "Content-Type: application/json" ^
            -d "!PAYLOAD!"
    
          pause
    `;
    
          fs.writeFileSync("goffipl_curl.bat", batContent, "utf8");
    
          result.affectedRows = 1
          return (result)
        } catch (err) {
          console.log("Error writing data into curl file: " + err.message)
          result.message = err.message
          result.affectedRows = 0
          return (result)
        }
      */

    try {
      const payloadObj = {
        storyName: data.storyName,
        storyheaderID: data.storyheaderID,
        storyID: data.storyID,
        projectID: data.projectID,
        subprojectID: data.subprojectID,
        userID: data.userID,
        userName: data.userName,
        resetLog: data.resetLog
      };


      fs.writeFileSync(
        data.filename,
        JSON.stringify(payloadObj, null, 2),
        "utf8"
      );

      result.affectedRows = 1
      return (result)
    } catch (err) {
      console.log("Error writing data into curl file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }
  },

  // -----------------------------------------------------------
  // Export a batch to execute a story with a curl file
  // -----------------------------------------------------------
  batchStory: async (data) => {
    console.log('Batch Data: ', data)

    let fs = require("fs")
    let result = {}

    try {

      const batContent = `@echo off
    
set API_URL=${data.url}playwright/robot/story

curl -X POST "%API_URL%" ^
  -H "Content-Type: application/json" ^
  --data-binary "@${data.jsonFile}"

pause
    `;

      fs.writeFileSync(data.filename, batContent, "utf8");

      result.affectedRows = 1
      return (result)
    } catch (err) {
      console.log("Error writing data into batch file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }


  }

};
