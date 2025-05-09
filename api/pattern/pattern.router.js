
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API Pattern
 */

const router = require("express").Router();
const {
  createPattern,
  getPattern,
  getPatternByProject,
  getPatternsByCode,
  getPatternsByPath,
  updatePattern,
  updatePatternPosition, 
  reorderPattern,
  copyPattern, 
  deletePattern,
  deleteAllPattern,
  importPattern,
  exportPattern

} = require("./pattern.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getPattern); 
router.get("/project/:id", getPatternByProject); 
router.post("/code", getPatternsByCode); 
router.post("/path", getPatternsByPath); 
router.post("/update", updatePattern); 
router.post("/position", updatePatternPosition); 
router.post("/reorder", reorderPattern); 
router.post("/copy", copyPattern);
router.post("/delete", deletePattern);
router.post("/fulldelete", deleteAllPattern);
router.post("/create", createPattern); 
router.post("/import", importPattern); 
router.post("/export", exportPattern); 


module.exports = router;
