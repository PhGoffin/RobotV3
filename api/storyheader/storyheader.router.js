
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API StoryHeader
 */

const router = require("express").Router();
const {
  createStoryHeader,
  getStoryHeader,
  getStoryHeaderByCode,
  getStoryHeaderBySubProject,
  updateStoryHeader,
  updateStoryHeaderPosition, 
  reorderStoryHeader,
  copyStoryHeader, 
  deleteStoryHeader
} = require("./storyheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getStoryHeader); 
router.post("/subproject", getStoryHeaderBySubProject); 
router.post("/code", getStoryHeaderByCode);
router.post("/update", updateStoryHeader); 
router.post("/position", updateStoryHeaderPosition); 
router.post("/reorder", reorderStoryHeader); 
router.post("/copy", copyStoryHeader);
router.post("/delete", deleteStoryHeader);
router.post("/create", createStoryHeader); 


module.exports = router;
