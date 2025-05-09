
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 11:33:09
 * @Description: All the routes available for the API AI Path
 */

const router = require("express").Router();
const {
  createPath,
  getPath,
  getPathByProject,
  updatePath,
  deletePath,
  deleteAllPath,
  importPath,
  updatePathPosition, 
  reorderPath, 
  copyPath 

} = require("./path.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getPath);
router.post("/project", getPathByProject);
router.post("/create", createPath);
router.post("/update", updatePath);
router.get("/delete/:id", deletePath);
router.post("/fulldelete", deleteAllPath);
router.post("/import", importPath); 
router.post("/position", updatePathPosition); 
router.post("/reorder", reorderPath); 
router.post("/copy", copyPath);





module.exports = router;
