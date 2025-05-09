
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-19 14:15:25
 * @Description: All the routes available for the API project
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createProject,
  getProjectById,
  getProjectByName,
  getProjectsByUser,
  getProjectsByWorkspace,
  updateProject,
  deleteProject
} = require("./project.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getProjectById); //router.get("/:id", checkToken, getProjectByProjectId);
router.get("/user/:id", getProjectsByUser); //router.get("/", checkToken, getProjects);
router.get("/workspace/:id", getProjectsByWorkspace); //router.get("/", checkToken, getProjects);
router.post("/create", createProject); //router.post("/", checkToken, createProject);
router.post("/name", getProjectByName); 
router.post("/update", updateProject); //router.patch("/", checkToken, updateProject);
router.post("/delete", deleteProject); //router.delete("/", checkToken, deleteProject);


module.exports = router;
