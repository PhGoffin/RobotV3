
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-15
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-21 11:27:24
 * @Description: All the routes available for the API AI Attribute
 */

const router = require("express").Router();
const {
  createAttribute,
  getAttribute,
  getAttributeByProject,
  updateAttribute,
  deleteAttribute,
  deleteAllAttribute,
  importAttribute,
  updateAttributePosition, 
  reorderAttribute, 
  copyAttribute 

} = require("./attribute.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getAttribute);
router.post("/project", getAttributeByProject);
router.post("/create", createAttribute);
router.post("/update", updateAttribute);
router.get("/delete/:id", deleteAttribute);
router.post("/fulldelete", deleteAllAttribute);
router.post("/import", importAttribute); 
router.post("/position", updateAttributePosition); 
router.post("/reorder", reorderAttribute); 
router.post("/copy", copyAttribute);





module.exports = router;
