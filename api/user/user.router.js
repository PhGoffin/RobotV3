/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-11 10:02:34
 * @Description: All the routes available for the API user
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createUser,
  getAllUsers,  
  linkProject,
  login,
  getUserByUserId,
  getUserByLogin,
  getFreeUsersByProject,
  getLinkedUser,
  updateLinkedUser,
  deleteLinkedUser,
  getUsersByProjectId,
  getUsersByWorkspaceId,
  getRoleOfUser,
  isUserOnProject,
  updateUser,
  updatePassword,  
  deleteUser,
  unlinkProject,  
} = require("./user.controller");


// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/create", createUser); 
router.get("/", getAllUsers); 
router.post("/login", login); 
router.post("/userlogin", getUserByLogin); 
router.post("/freeUsersByProject", getFreeUsersByProject); 
router.get("/linkedUser/:id", getLinkedUser); 
router.post("/userid", getUserByUserId); 
router.post("/project", getUsersByProjectId);
router.get("/workspace/:id", getUsersByWorkspaceId); 
router.post("/isonproject", isUserOnProject);
router.post("/update", updateUser); 
router.post("/password", updatePassword);
router.post("/role", getRoleOfUser); 
router.post("/linkproject", linkProject); 
router.post("/unlinkproject", unlinkProject); 
router.post("/delete", deleteUser); 
router.post("/freeUser/update", updateLinkedUser);
router.post("/freeUser/delete", deleteLinkedUser);

module.exports = router;
