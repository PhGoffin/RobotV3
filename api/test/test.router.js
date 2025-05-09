
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 10:29:29
 * @Description: All the routes available for the API Test
 */

const router = require("express").Router();
const {
  createTest,
  getTestByScenario,
  getTest,
  getTestByDictionary,
  importTest,
  exportTest,
  downloadFile,
  updateTest,
  updateTestPosition, 
  updateTestParameter,  
  updateActive,
  updateCommentType,
  reorderTest,
  copyTest, 
  copyAllTest, 
  deleteTest,
  deleteAllTest
} = require("./test.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getTest); 
router.get("/scenario/:id", getTestByScenario);
router.post("/dictionary", getTestByDictionary); 
router.post("/import", importTest); 
router.post("/export", exportTest); 
router.get("/download/:id", downloadFile);
router.post("/update", updateTest); 
router.post("/parameter", updateTestParameter); 
router.post("/active", updateActive); 
router.post("/commentType", updateCommentType); 
router.post("/position", updateTestPosition); 
router.post("/reorder", reorderTest); 
router.post("/copy", copyTest);
router.post("/fullcopy", copyAllTest);
router.post("/delete", deleteTest);
router.post("/fulldelete", deleteAllTest);
router.post("/create", createTest); 


module.exports = router;
