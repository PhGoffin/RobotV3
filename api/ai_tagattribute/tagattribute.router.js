
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-17
 * @Last Modified by: 
 * @Last Modified time: 2024-06-07 14:43:48
 * @Description: All the routes available for the API AI TagAttribute
 */

const router = require("express").Router();
const {
  createTagAttribute,
  getTagAttribute,
  getTagAttributeByProject,
  getTagAttributeByTraining,
  getTagAttributeByTagelement,
  getTagAttributeByPath,
  updateTagAttribute,
  deleteTagAttribute,
  restoreTagAttribute,
  deleteByTagElement,
  deleteAllTagAttribute,
  updateTagAttributePosition, 
  reorderTagAttribute, 
  copyTagAttribute 

} = require("./tagattribute.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getTagAttribute);
router.get("/project/:id", getTagAttributeByProject);
router.post("/training", getTagAttributeByTraining);
router.post("/tagelement", getTagAttributeByTagelement);
router.post("/path", getTagAttributeByPath);
router.post("/create", createTagAttribute);
router.post("/update", updateTagAttribute);
router.get("/delete/:id", deleteTagAttribute);
router.get("/restore/:id", restoreTagAttribute);
router.post("/fulldelete", deleteAllTagAttribute);
router.post("/deletebytagelement", deleteByTagElement);
router.post("/position", updateTagAttributePosition); 
router.post("/reorder", reorderTagAttribute); 
router.post("/copy", copyTagAttribute);



module.exports = router;
