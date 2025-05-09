
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2024-04-10 10:53:41
 * @Description: All the routes available for the API Parameter
 */

const router = require("express").Router();
const {
  createParameter,
  getParametersByProject,
  getParametersByCode,
  getParametersByStory,
  getParameter,
  updateParameter,
  updateParameterPosition, 
  reorderParameter,
  copyParameter, 
  deleteParameter
} = require("./parameter.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getParameter); 
router.get("/project/:id", getParametersByProject);
router.post("/code", getParametersByCode);
router.post("/story", getParametersByStory);
router.post("/update", updateParameter); 
router.post("/position", updateParameterPosition); 
router.post("/reorder", reorderParameter); 
router.post("/copy", copyParameter);
router.post("/delete", deleteParameter);
router.post("/create", createParameter); 


module.exports = router;
