
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-20
 * @Last Modified by: 
 * @Last Modified time: 2024-04-17 15:22:30
 * @Description: All the routes available for the API AI TagElement
 */

const router = require("express").Router();
const {
  createTagElement,
  getTagElement,
  getTagElementByProject,
  getTagElementByTraining,
  getTagElementByPattern,
  getPathTagElement,
  updateTagElement,
  deleteTagElement,
  deleteAllTagElement,
  updateTagElementPosition, 
  reorderTagElement, 
  copyTagElement 

} = require("./tagelement.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getTagElement);
router.get("/project/:id", getTagElementByProject);
router.post("/path", getPathTagElement);
router.post("/training", getTagElementByTraining);
router.post("/pattern", getTagElementByPattern);
router.post("/create", createTagElement);
router.post("/update", updateTagElement);
router.get("/delete/:id", deleteTagElement);
router.post("/fulldelete", deleteAllTagElement);
router.post("/position", updateTagElementPosition); 
router.post("/reorder", reorderTagElement); 
router.post("/copy", copyTagElement);



module.exports = router;
