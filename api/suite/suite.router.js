
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API Suite
 */

const router = require("express").Router();
const {
  createSuite,
  getSuite,
  getSuiteBySubProject,
  getSuiteByHeader,
  updateSuite,
  updateSuitePosition, 
  reorderSuite,
  copySuite,
  copyAllSuite, 
  deleteSuite,
  deleteAllSuite
} = require("./suite.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getSuite); 
router.post("/subproject", getSuiteBySubProject); 
router.post("/header", getSuiteByHeader); 
router.post("/update", updateSuite); 
router.post("/position", updateSuitePosition); 
router.post("/reorder", reorderSuite); 
router.post("/copy", copySuite);
router.post("/fullcopy", copyAllSuite);
router.post("/delete", deleteSuite);
router.post("/fulldelete", deleteAllSuite);
router.post("/create", createSuite); 


module.exports = router;
