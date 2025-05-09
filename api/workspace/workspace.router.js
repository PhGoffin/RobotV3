
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 10:29:29
 * @Description: All the routes available for the API Workspace
 */

const router = require("express").Router();
//const { checkToken } = require("../../auth/token_validation");
const {
  createWorkspace,
  getWorkspaceByName,
  getWorkspaceById,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace
} = require("./workspace.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getWorkspaces); 
router.get("/:id", getWorkspaceById); 
router.post("/value", getWorkspaceByName);
router.post("/update", updateWorkspace); 
router.post("/delete", deleteWorkspace);
router.post("/create", createWorkspace); 


module.exports = router;
