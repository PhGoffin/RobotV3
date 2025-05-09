
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04 
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 04/03/2024
 * @Description: All the routes available for the API reference backup header
 */

const router = require("express").Router();
const {
  createRefBackHeader,
  getRefBackHeaderByProject,
  getRefBackHeaderByUser,
  getRefBackHeaderBySlot,
  getUserFromRefBackHeader,
  deleteRefBackHeader
} = require("./referencebackupheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/project", getRefBackHeaderByProject); 
router.post("/user", getRefBackHeaderByUser); 
router.post("/slot", getRefBackHeaderBySlot); 
router.post("/who", getUserFromRefBackHeader); 
router.post("/delete", deleteRefBackHeader);
router.post("/create", createRefBackHeader); 


module.exports = router;
