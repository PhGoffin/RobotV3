
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-10-03 07:04:27
 * @Description: All the routes available for the API function
 */

const router = require("express").Router();
const {
  createFunction,
  getFunction,
  getFunctionByName,
  getAllFunctions,
  updateFunction,
  updateFunctionPosition, 
  reorderFunction,
  copyFunction, 
  deleteFunction
} = require("./function.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getFunction); 
router.get("/", getAllFunctions); 
router.post("/name", getFunctionByName); 
router.post("/update", updateFunction); 
router.post("/position", updateFunctionPosition); 
router.post("/reorder", reorderFunction); 
router.post("/copy", copyFunction);
router.post("/delete", deleteFunction);
router.post("/create", createFunction); 


module.exports = router;
