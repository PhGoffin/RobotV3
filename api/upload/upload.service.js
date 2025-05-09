const mysql = require("../../config/database");

module.exports = {

  /*
   * @Author: Philippe Goffin 
   * @Email: artcomputer123@gmail.com
   * @Date: 2024-03-16
 * @Last Modified by: Philippe Goffin
   * @Last Modified time: 2024-03-17 08:56:36
   * @Description: All the primary services available for the API upload
   */

  // -----------------------------------------------------------
  // return a list of all the uploaded files
  // -----------------------------------------------------------
  getAllFiles: (data) => {
    //console.log('Data: ', data)
    return new Promise((resolve, reject) => {

      //console.log("Current directory:", process.cwd());
      let fs = require('fs');
      let files = fs.readdirSync('./uploads/' + data.projectID + '_' + data.projectName);
      //console.log ('Files: ', files)  

      resolve(files)

    });
  },


  // -----------------------------------------------------------
  // Delete an uploaded file
  // -----------------------------------------------------------
  deleteFile: (data) => {
    //console.log (data)
    return new Promise((resolve, reject) => {

      let fs = require('fs');
      let filename = './uploads/' + data.projectID + '_' + data.projectName + '/' + data.fileName
      console.log('Filename: ', filename)

      // check if the file exists
      try {
        fs.statSync(filename)
        fs.unlink(filename, function (err) {
          if (err) return reject(err)
          resolve('file deleted successfully')
        })
      } catch (err) {
        reject('File not found!')
      }

    });
  },


};
