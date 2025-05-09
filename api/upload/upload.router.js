
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-16
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-17 11:39:16
 * @Description: All the routes available for the upload function
 */

const router = require("express").Router();
const multer = require('multer');
var fs = require('fs');

const fileFilter = function (req, file, callback) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("wrong file type")
    error.code = "LIMIT_FILE_TYPES"
    return callback(error, true)
  }
  callback(null, true)
}

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Param req: ', req.body.projectID)
    //let projectID = req.params.projectID
    // cb(null, `./uploads/${projectID}`);
    //console.log(`./uploads/${projectID}`)
    //cb(null, './uploads/' + req.body.projectID);

    const projectID = req.body.projectID
    const projectName = req.body.projectName
    const dir = './uploads/' + req.body.projectID + '_' + req.body.projectName
    fs.exists(dir, exist => {
      if (!exist) {
        return fs.mkdir(dir, error => cb(error, dir))
      }
      return cb(null, dir)
    })

  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

// const upload = multer ({
//     dest: './uploads/',
//     fileFilter,
//     limits: {
//       fileSize: MAX_SIZE
//     }
// })

const {
  uploadFile,
  getAllFiles,
  deleteFile,
  downloadFile
} = require("./upload.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/file", upload.array('files'), uploadFile);
router.post("/list", getAllFiles);
router.post("/delete", deleteFile);
router.get("/download/:id", downloadFile);

module.exports = router;
