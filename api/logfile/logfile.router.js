
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-29
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API logfile
 */

const router = require("express").Router();
const {
  createLogfile,
  getLogfileByUser,
  reorderLogfile,
  deleteLogfile,
  exportLog
} = require("./logfile.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/user/:id", getLogfileByUser); 
router.get("/reorder/:id", reorderLogfile); 
router.get("/delete/:id", deleteLogfile);
router.post("/create", createLogfile); 
router.post("/export", exportLog); 


module.exports = router;
