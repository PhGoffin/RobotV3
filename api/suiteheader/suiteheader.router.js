
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API SuiteHeader
 */

const router = require("express").Router();
const {
  createSuiteHeader,
  getSuiteHeader,
  getSuiteHeaderBylabel,
  getSuiteHeaderBySubProject,
  updateSuiteHeader,
  updateSuiteHeaderPosition, 
  reorderSuiteHeader,
  copySuiteHeader, 
  deleteSuiteHeader
} = require("./suiteheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getSuiteHeader); 
router.post("/subproject", getSuiteHeaderBySubProject); 
router.post("/label", getSuiteHeaderBylabel);
router.post("/update", updateSuiteHeader); 
router.post("/position", updateSuiteHeaderPosition); 
router.post("/reorder", reorderSuiteHeader); 
router.post("/copy", copySuiteHeader);
router.post("/delete", deleteSuiteHeader);
router.post("/create", createSuiteHeader); 


module.exports = router;
