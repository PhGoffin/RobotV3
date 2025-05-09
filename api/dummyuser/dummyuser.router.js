
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-07
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:20:34
 * @Description: All the routes available for the API dummy users
 */

const router = require("express").Router();
const {
  createDummyuser,
  getDummyuser,
  getDummyuserByUser,
  getDummyuserByProject,
  updateDummyuser,
  updateDummyuserPosition, 
  reorderDummyuser, 
  copyDummyuser, 
  deleteDummyuser
} = require("./dummyuser.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getDummyuser); 
router.get("/project/:id", getDummyuserByProject); 
router.post("/user", getDummyuserByUser);
router.post("/update", updateDummyuser); 
router.post("/position", updateDummyuserPosition); 
router.post("/reorder", reorderDummyuser); 
router.post("/copy", copyDummyuser);
router.post("/delete", deleteDummyuser);
router.post("/create", createDummyuser); 


module.exports = router;
