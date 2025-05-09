const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-01-29
   * @Last Modified by: 
   * @Last Modified time: 2024-08-05 08:52:52
   * @Description: All the database services available for the API logfile
   */

  // -----------------------------------------------------------
  // Insert log into the table logfile
  // -----------------------------------------------------------
  createLogfile: (data) => {
    data.message = data.message.substring(0, 300) 
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into logfile(userID, category, message) 
                  values(?,?,?)`,
        [
          data.userID,
          data.category,
          data.message
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
  // Get all logfiles for a user
  // ---------------------------------------------------------------------------
  getLogfileByUser: (userID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT logfileID, userID, category, message FROM logfile WHERE userID=?`,
        [userID],
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
  // reorder all the logfiles
  // -----------------------------------------------------------

  reorderLogfile: (userID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE logfile AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, logfileID, LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 6, 3), 3, 0) as pos3  
          FROM logfile,
         (SELECT @row_number:=0) as t
          WHERE  T1.userID=?
          ORDER BY userID, pos6, pos3) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.logfileID = T2.logfileID`,
        [ userID ],
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
  // Export logfile into a json file
  // data.filename
  // data.userID
  // data.reset (1: erase the previous file, 0: continue with the current file)
  // -----------------------------------------------------------
  exportLog: async (data) => {
    const { getLogfileByUser } = require("./logfile.service");

    //console.log ('Data: ', data)

    let fs = require("fs")
    let jsonLog = []

    if (data.reset == 1) {

      try {
        fs.statSync(data.filename)
        fs.unlink(data.filename, function (err) {
          if (err) return console.log(err)
          console.log('file deleted successfully')
        })      
      } catch (err) {
        console.log ('file not exists')
      }
  
      // Write a empty template
      fs.writeFileSync(data.filename, '{ "Logfiles": [] }', "utf8")

    }

    // Read the file to parse a json format
    let content = fs.readFileSync(data.filename, 'utf8');
    // parse the json file
    try {
      jsonLog = JSON.parse(content);
      console.log ('File parsed')
    }
    catch (err) {
      console.log("exportLog Error: " + err.message);
    }

    // Read the logfile
    const result = await getLogfileByUser(data.userID)
    if (!result.length) {
      console.log ('No log available for the user: ' + data.userID)
      result.affectedRows = 0
      return (result.length)
    }


    // Push the log into a json array
    for (let elt = 0; elt < result.length; elt++) {
      //console.log ('Push: ' + result[elt].testID)
      jsonLog["Logfiles"].push({
        logfileID: result[elt].logfileID, userID: result[elt].userID, position: result[elt].position,
        category: result[elt].category, message: result[elt].message
      })
    }

    try {
      fs.writeFileSync(data.filename, JSON.stringify(jsonLog), "utf8")
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
  // Delete all the logfile of a user
  // ---------------------------------------------------------------------------
  deleteLogfile: (userID) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM logfile WHERE userID= ?`,
        [ userID ],
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
