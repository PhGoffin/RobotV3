
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 14:30:04
 * @Description: All the routes available for the API project
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createSubproject,
  getSubprojectById,
  getSubprojectByName,
  getSubprojectByProject,
  updateSubproject,
  updateSubprojectPosition,
  reorderSubproject,
  deleteSubproject
} = require("./subproject.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getSubprojectById); 
router.get("/project/:id", getSubprojectByProject); 
router.post("/create", createSubproject); 
router.post("/name", getSubprojectByName); 
router.get("/id", getSubprojectById); 
router.post("/update", updateSubproject); 
router.post("/position", updateSubprojectPosition); 
router.post("/reorder", reorderSubproject); 
router.post("/delete", deleteSubproject); 


module.exports = router;
