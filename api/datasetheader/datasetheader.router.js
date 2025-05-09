
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-05
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API DatasetHeader
 */

const router = require("express").Router();
const {
  createDatasetheader,
  getDatasetheader,
  getDatasetheaderByCode,
  getDatasetheaderBySubProject,
  updateDatasetheader,
  updateDatasetheaderPosition, 
  reorderDatasetheader,
  copyDatasetheader, 
  importDatasetheader,
  deleteDatasetheader
} = require("./datasetheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getDatasetheader); 
router.post("/subproject", getDatasetheaderBySubProject); 
router.post("/code", getDatasetheaderByCode);
router.post("/update", updateDatasetheader); 
router.post("/position", updateDatasetheaderPosition); 
router.post("/reorder", reorderDatasetheader); 
router.post("/copy", copyDatasetheader);
router.post("/import", importDatasetheader);
router.post("/delete", deleteDatasetheader);
router.post("/create", createDatasetheader); 


module.exports = router;
