const mysql = require("../../config/database");

module.exports = {

/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: Someone
 * @Last Modified time: 2025-02-26 13:41:52
 * @Description: All the database services available for the API Dataset
 */

  // -----------------------------------------------------------
  // Insert Dataset info into the table Dataset
  // -----------------------------------------------------------
  createDataset: (data) => {
    //console.log ('*Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `insert into dataset(subprojectID, datasetheaderID, code, label, comment, position, active, createdby, created, updatedby, updated) 
                  values(?,?,?,?,?,?,?,?,?,?,?)`,
        [
          data.subprojectID,
          data.datasetheaderID,
          data.code,
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
  // Get a Datasets by id
  // ---------------------------------------------------------------------------
  getDataset: (DatasetId) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.subprojectID, D.datasetID, D.datasetheaderID, CONCAT(H.code, D.code) as fullcode, 
         H.code as headercode, D.code, D.label, D.comment, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated 
         FROM dataset D, datasetheader H
         WHERE D.datasetID=? AND D.datasetheaderID=H.datasetheaderID`,
        [DatasetId],

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
  // Get Dataset by datasetheader and code (datasetheader + dataset)
  // -----------------------------------------------------------
  getDatasetByCode: (data) => {
    //console.log ('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.datasetID, D.label 
        FROM dataset D, datasetheader H 
        WHERE D.subprojectID = ? 
        AND concat (H.code, D.code) = ?
        and D.active = ?
        AND D.datasetheaderID = H.datasetheaderID 
        ORDER BY LPAD(LOWER(D.position), 10, 0)`,
        [
          data.subprojectID,
          data.code,
          data.active
        ],

        (error, results, fields) => {
          //console.log ('Error: ', error)
          //console.log ('results: ', results)
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },


  // ---------------------------------------------------------------------------
  // Get all Datasets info from the table Dataset for a project
  // ---------------------------------------------------------------------------
  getDatasetBySubProject: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.datasetID, D.subprojectID, CONCAT(H.code, D.code) as fullcode, 
         H.code as headercode, D.code, D.label, D.comment, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated  
         FROM dataset D, datasetheader H
         WHERE D.subprojectID=? 
         AND D.datasetheaderID = H.datasetheaderID
         ORDER BY LPAD(LOWER(D.position), 10, 0) asc`,
        [
          data.subprojectID
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
  // Get all Datasets info from the table Datasetheader
  // ---------------------------------------------------------------------------
  getDatasetByHeader: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `SELECT D.datasetID, D.subprojectID, CONCAT(H.code, D.code) as fullcode, 
         H.code as headercode, D.code, D.label, D.comment, D.position, D.active, D.createdby, D.created, D.updatedby, D.updated  
         FROM dataset D, datasetheader H 
         WHERE D.datasetheaderID=? 
         AND D.datasetheaderID = H.datasetheaderID
         ORDER BY LPAD(LOWER(D.position), 10, 0) asc`,
        [
          data.datasetheaderID
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
  // Update a Dataset record 
  // ---------------------------------------------------------------------------
  updateDataset: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dataset SET code=?, label=?, comment=?, active=?, updatedby=?, updated=? 
         WHERE datasetID = ?`,
        [
          data.code,
          data.label,
          data.comment,
          (data.active != undefined ? data.active : 1),
          data.user,
          data.today,
          data.datasetID

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
  // Update Dataset position
  // -----------------------------------------------------------
  updateDatasetPosition: (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dataset SET position = ? WHERE datasetID = ?`,
        [
          data.position,
          data.datasetID
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
  // reorder all Datasets
  // -----------------------------------------------------------


  reorderDataset: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `UPDATE dataset AS T1,
        (SELECT (@row_number:=@row_number + 1) AS newposition, datasetID,  LPAD(LOWER(position), 6, 0) as pos6, lpad(substring(position, 7, 4), 4, 0) as pos4  
          FROM dataset,
         (SELECT @row_number:=0) as t
          WHERE datasetheaderID=?
          ORDER BY datasetheaderID, pos6, pos4) AS T2 
        SET T1.position=T2.newposition
        WHERE T1.datasetID = T2.datasetID`,
        [
          data.datasetheaderID
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
  // Copy a Dataset record
  // -----------------------------------------------------------
  copyDataset: (data) => {

    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO dataset ( subprojectID, datasetheaderID, code, label, comment, active, position, createdby, created, updatedby, updated )
         SELECT t1.subprojectID, t1.datasetheaderID, t1.code, t1.label, t1.comment, t1.active, ?, ?, ?, ?, ?  
         FROM dataset t1 WHERE t1.datasetID = ?`,
        [
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
          data.datasetID
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
  // Copy all Dataset of a headerdataset
  // -----------------------------------------------------------
  copyAllDataset: (data) => {

    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `INSERT INTO dataset ( subprojectID, datasetheaderID, code, label, comment, active, position, createdby, created, updatedby, updated )
         SELECT ?, ?, t1.code, t1.label, t1.comment, t1.active, t1.position, t1.createdby, t1.created, t1.updatedby, t1.updated 
         FROM dataset t1 WHERE t1.datasetheaderID = ?`,
        [
          data.subprojectID,
          data.datasetheaderIDCopy,
          data.datasetheaderIDOrigin
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
  // Export dataset into a json file
  // data.filename
  // data.datasetheaderID
  // -----------------------------------------------------------
  exportDataset: async (data) => {
    const { getDatasetByHeader } = require("./dataset.service");

    console.log ('Data: ', data)

    let fs = require("fs")
    let myDatasetData = [];
    let jsonDataset = []

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
    fs.writeFileSync(data.filename, '{ "Dataset": [] }', "utf8")

    // Read the file to parse a json format
    let content = fs.readFileSync(data.filename, 'utf8');
    // parse the json file
    try {
      jsonDataset = JSON.parse(content);
      console.log ('File parsed')
    }
    catch (err) {
      console.log("export Dataset Error: " + err.message);
    }

    // Read the tests of a scenario
    const result = await getDatasetByHeader(data);
    if (!result.length) {
      console.log ('No Dataset available for the datasetheaderID: ' + data.datasetheaderID)
      result.affectedRows = 0
      return (result.length)
    }

    // Push the rules into a json array
    for (let elt = 0; elt < result.length; elt++) {
      //console.log ('Push: ' + result[elt].testID)
      jsonDataset["Dataset"].push({
        datasetID: result[elt].datasetID, position: result[elt].position, header: result[elt].headercode, code: result[elt].code, value: result[elt].label,
        comment: result[elt].comment, active: result[elt].active
      })
    }

    try {
      fs.writeFileSync(data.filename, JSON.stringify(jsonDataset), "utf8")
      result.affectedRows = result.length
      return (result)
    } catch (err) {
      console.log("Error writing data into json file: " + err.message)
      result.message = err.message
      result.affectedRows = 0
      return (result)
    }

  },  


  // -----------------------------------------------------------
  // Import dataset from another datasetheader
  // data.filename
  // data.datasetheaderID
  // -----------------------------------------------------------
  importDataset: async (data) => {
    return new Promise((resolve, reject) => {
      mysql.query(

        `INSERT INTO dataset ( subprojectID, datasetheaderID, code, label, comment, active, position, createdby, created, updatedby, updated )
        SELECT t1.subprojectID, ?, t1.code, t1.label, t1.comment, t1.active, ?, ?, ?, ?, ?  
        FROM dataset t1 WHERE t1.datasetID = ?`,
        [
          data.currentDatasetheaderID,
          data.position,
          data.user,
          data.today,
          data.user,
          data.today,
          data.datasetID
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
  // Delete a Dataset
  // ---------------------------------------------------------------------------
  deleteDataset: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM dataset WHERE datasetheaderID = ? AND datasetID = ?`,
        [
          data.datasetheaderID,
          data.datasetID
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
  // Delete all Dataset of a headerdataset
  // ---------------------------------------------------------------------------
  deleteAllDataset: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {
      mysql.query(
        `DELETE FROM dataset WHERE datasetheaderID = ? `,
        [
          data.datasetheaderID,
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
