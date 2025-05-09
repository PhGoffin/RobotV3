
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-16
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-17 12:22:54
 * @Description: All the controllers (call operations) for the API upload
 */


const {
  getAllFiles,
  deleteFile
} = require("./upload.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Upload file(s)
  // -----------------------------------------------------------
  uploadFile: ((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');

    console.log('Param: ', req.body.projectID)

    //console.log ('Req: ', req.file)
    if (req.files != undefined) {
      return res.json({
        success: 1,
        data: req.files
      });
    } else {
      return res.json({
        success: 0,
        data: null
      });
    }
  }),


  // ---------------------------------------------------------------------------
  // Get all the uploaded files
  // ---------------------------------------------------------------------------
  getAllFiles: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to send a list of all the uploaded files
    const result = await getAllFiles(body);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // Download an uploaded file
  // ---------------------------------------------------------------------------
  downloadFile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const path = require('path')
    let fileName = req.params.id;
    //console.log('fileName: ', fileName)
    fileName = './uploads/' + fileName.replace(/@/g, '/')
    //console.log('fileName: ', fileName)

    res.download(
      fileName,
      (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file"
          })
        }
      });

  }),

  // ---------------------------------------------------------------------------
  // Delete a Function
  // ---------------------------------------------------------------------------
  deleteFile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a file
    const result = await deleteFile(body);
    return res.json({
      success: 1,
      data: result
    });
  })

};



