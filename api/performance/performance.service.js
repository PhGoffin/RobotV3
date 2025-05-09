const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2023-12-09 07:49:49 
   * @Last Modified by: 
   * @Last Modified time: 2024-12-13 11:03:28
   * @Description: All the database services available for the API performance
   */

  // -----------------------------------------------------------
  // Insert info into the table performance
  // -----------------------------------------------------------
  createPerformance: (data) => {

    //console.log ('Data', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into performance(projectID, scenarioID, space, topic, created, sequenceID, measure) 
                  values(?,?,?,?,?,?, ?)`,
        [
          data.projectID,
          data.scenarioID,
          data.space,
          data.topic,
          data.created,
          data.sequenceID,
          data.measure
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
  // Get a performance by id
  // ---------------------------------------------------------------------------
  getPerformance: (performanceId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT performanceID, projectID, scenarioID, space, topic, created, sequenceID, measure FROM performance 
        WHERE performanceID=?`,
        [performanceId],
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
  // Get a performance by Project
  // ---------------------------------------------------------------------------
  getPerformanceByProject: (projectId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT A.performanceID, A.projectID, B.project, A.scenarioID, C.scenario, A.space, A.topic, A.created, A.sequenceID, A.measure,
        lpad(A.sequenceID, 2, 0) as sequencePad 
        FROM performance A, project B, scenario C
        WHERE A.projectID=? AND B.projectID = A.projectID AND C.scenarioID = A.scenarioID
        ORDER BY A.projectID, A.scenarioID, A.space, A.topic, sequencePad `,
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



  // -----------------------------------------------------------
  // Get performance by code (scenarioID/Space/Topic)
  // -----------------------------------------------------------
  getPerformanceByCode: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {

      try {
        mysql.query(
          `SELECT performanceID, projectID, scenarioID, space, topic, created, sequenceID, measure, lpad(sequenceID, 2, 0) as sequencePad 
           FROM performance 
           WHERE projectID=? AND scenarioID=? AND space=? AND topic=?  ORDER BY sequencePad`,
          [
            data.projectID,
            data.scenarioID,
            data.space,
            data.topic
          ],
          (error, results, fields) => {
            //console.log('Result: ', results)
            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        );
      } catch (err) {
        console.log('getReferenceByCode: Fatal error: Browser not responding!')
        return reject({ success: 0, message: "Stop Browser not responding!" })
      }
    });
  },


  // -----------------------------------------------------------
  // Get performance by sequence (scenarioID/Space/Topic)
  // -----------------------------------------------------------
  getPerformanceBySequence: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {

      try {
        mysql.query(
          `SELECT performanceID, projectID, scenarioID, space, topic, created, sequenceID, measure, lpad(sequenceID, 2, 0) as sequencePad
           FROM performance 
           WHERE projectID=? AND scenarioID=? AND space=? AND topic=? AND sequenceID=? ORDER BY sequencePad`,
          [
            data.projectID,
            data.scenarioID,
            data.space,
            data.topic,
            data.sequenceID
          ],
          (error, results, fields) => {
            //console.log('Result: ', results)
            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        );
      } catch (err) {
        console.log('getReferenceByCode: Fatal error: Browser not responding!')
        return reject({ success: 0, message: "Stop Browser not responding!" })
      }
    });
  },

  // ---------------------------------------------------------------------------
  // Get all performance info from the table reference for a story in a space
  // ---------------------------------------------------------------------------
  getPerformanceByStory: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT P.performanceID, P.projectID, P.scenarioID, P.space, P.topic, P.created, P.sequenceID, P.measure, S.scenario, lpad(P.sequenceID, 2, 0) as sequencePad 
        FROM performance P, scenario S
        WHERE P.projectID=?  and P.space=? AND P.scenarioID in (
        SELECT B.scenarioID FROM story A, scenario B WHERE A.storyheaderID=? and B.scenarioID = A.scenarioID
        UNION
        SELECT C.scenarioID FROM story A, suiteheader B, suite C, scenario D 
        WHERE A.storyheaderID=? and B.suiteheaderID = A.suiteID and  C.suiteheaderID = B.suiteheaderID and D.scenarioID = C.scenarioID
        )
        AND S.scenarioID = P.scenarioID
        ORDER BY P.topic, sequencePad `,
        [
          data.projectID,
          data.space,
          data.storyheaderID,
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
  },



  // ---------------------------------------------------------------------------
  // Get all performance info from the table reference for a step in a space
  // ---------------------------------------------------------------------------
  getPerformanceByStep: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT P.performanceID, P.projectID, P.scenarioID, P.space, P.topic, P.created, P.sequenceID, P.measure, S.scenario, lpad(P.sequenceID, 2, 0) as sequencePad  
        FROM performance P, scenario S
        WHERE P.projectID=?  and P.space=? AND P.scenarioID in (
        SELECT B.scenarioID FROM story A, scenario B WHERE A.storyheaderID=? and A.storyID=? and B.scenarioID = A.scenarioID
        UNION
        SELECT C.scenarioID FROM story A, suiteheader B, suite C, scenario D 
        WHERE A.storyheaderID=? and A.storyID=? and B.suiteheaderID = A.suiteID and C.suiteheaderID = B.suiteheaderID and D.scenarioID = C.scenarioID
        )
        AND S.scenarioID = P.scenarioID
        ORDER BY P.topic, sequencePad `,
        [
          data.projectID,
          data.space,
          data.storyheaderID,
          data.storyID,
          data.storyheaderID,
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
  // Get all performance info from the table reference for a scenario in a space
  // ---------------------------------------------------------------------------
  getPerformanceByScenario: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT performanceID, projectID, scenarioID, space, topic, created, sequenceID, measure, lpad(sequenceID, 2, 0) as sequencePad
         FROM performance 
         WHERE projectID=? AND scenarioID=? and space=?  ORDER BY topic, sequencePad`,
        [
          data.projectID,
          data.scenarioID,
          data.space
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


  // ---------------------------------------------------------------------------------------------------------------------
  // get the max sequenceID for a specific performance (Space/Topic)
  // ---------------------------------------------------------------------------------------------------------------------
  getMaxPerformance: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT max(sequenceID) FROM performance 
         WHERE projectID=? and scenarioID=? AND space=? AND topic=?`,
        [
          data.projectID,
          data.scenarioID,
          data.space,
          data.topic
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          //console.log (results)
          return resolve(results);
        }
      );
    });
  },

  // ---------------------------------------------------------------------------------------------------------------------
  // get the average performance for a specific performance (Space/Topic) on the first 10 records
  // ---------------------------------------------------------------------------------------------------------------------
  getAveragePerformance: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT AVG(measure) FROM performance 
         WHERE projectID=? AND scenarioID=? AND space=? AND topic=? AND sequenceID <= 10`,
        [
          data.projectID,
          data.scenarioID,
          data.space,
          data.topic
        ],
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          //console.log (results)
          return resolve(results);
        }
      );
    });
  },


  // -----------------------------------------------------------
  // Export performance into a json file
  // data.filename
  // data.projectID
  // -----------------------------------------------------------
  exportPerformance: async (data) => {
    const { getPerformanceByProject } = require("./performance.service"); 

    console.log('Data: ', data)

    let fs = require("fs")
    let jsonPerformance = []

    try {
      fs.statSync(data.filename)
      fs.unlink(data.filename, function (err) {
        if (err) return console.log(err)
        console.log('file deleted successfully')
      })
    } catch (err) {
      console.log('file not exists')
    }

    // Write a empty template
    fs.writeFileSync(data.filename, '{ "Performance": [] }', "utf8")

    // Read the file to parse a json format
    let content = fs.readFileSync(data.filename, 'utf8');
    // parse the json file
    try {
      jsonPerformance = JSON.parse(content);
      console.log('File parsed')
    }
    catch (err) {
      console.log("export Performance Error: " + err.message);
    }

    // Read the tests of a scenario
    const result = await getPerformanceByProject(data.projectID);
    if (!result.length) {
      console.log('No Performance available for the projectID: ' + data.projectID)
      result.affectedRows = 0
      return (result.length)
    }

    // Push the performances into a json array
    for (let elt = 0; elt < result.length; elt++) {
      //console.log ('Push: ' + result[elt].testID)
      jsonPerformance["Performance"].push({
        performanceID: result[elt].performanceID, projectID: result[elt].projectID, project: result[elt].project, scenarioID: result[elt].scenarioID,
        scenario: result[elt].scenario, space: result[elt].space, topic: result[elt].topic, created: result[elt].created,
        sequenceID: result[elt].sequenceID, sequenceID2: result[elt].sequencePad, measure: result[elt].measure
      })
    }

    try {
      fs.writeFileSync(data.filename, JSON.stringify(jsonPerformance), "utf8")
      result.affectedRows = result.length
      return (result)
    } catch (err) {
      console.log("Error writing data into json file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }

  },


  // ---------------------------------------------------------------------------
  // Update a performance record 
  // ---------------------------------------------------------------------------
  updatePerformance: (data) => {
    //console.log('Data: ', data)

    return new Promise((resolve, reject) => {

      try {
        mysql.query(
          `UPDATE performance SET measure=?, created=? WHERE projectID=? AND scenarioID=? AND space=? AND topic=? AND sequenceID=?`,
          [
            data.measure,
            data.created,
            data.projectID,
            data.scenarioID,
            data.space,
            data.topic,
            data.sequenceID
          ],
          (error, results) => {
            //console.log('Results: ', results)

            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        );
      } catch (err) {
        console.log('updatePerformance: Fatal error: Browser not responding!')
        return reject({ success: 0, message: "Stop Browser not responding!" })
      }

    });
  },

  // ---------------------------------------------------------------------------
  // Update a performance record by its ID
  // ---------------------------------------------------------------------------
  updatePerformanceById: (data) => {
    //console.log('Data: ', data)

    return new Promise((resolve, reject) => {

      try {
        mysql.query(
          `UPDATE performance SET measure=?, created=?, space=?, topic=?, sequenceID=? WHERE performanceID=?`,
          [
            data.measure,
            data.created,
            data.space,
            data.topic,
            data.sequenceID,
            data.performanceID
          ],
          (error, results) => {
            //console.log('Results: ', results)

            if (error) {
              return reject(error);
            }
            return resolve(results);
          }
        );
      } catch (err) {
        console.log('updatePerformanceById: Fatal error: Browser not responding!')
        return reject({ success: 0, message: "Stop Browser not responding!" })
      }

    });
  },



  // ---------------------------------------------------------------------------
  // Delete a performance
  // ---------------------------------------------------------------------------
  deletePerformance: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM performance WHERE performanceID = ? `,
        [
          data.performanceID
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
  // Delete all the performance of a scenario
  // ---------------------------------------------------------------------------
  deleteAllPerformance: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM performance WHERE projectID=? AND space=? and scenarioID=? `,
        [
          data.projectID,
          data.space,
          data.scenarioID
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
