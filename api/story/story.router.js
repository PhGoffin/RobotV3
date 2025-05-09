
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API Story
 */

const router = require("express").Router();
const {
  createStory,
  getStory,
  getStoryByCode,
  getStoryByHeader,
  updateStory,
  updateStoryPosition, 
  reorderStory,
  copyStory,
  copyAllStory, 
  deleteStory,
  deleteAllStory
} = require("./story.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getStory); 
router.post("/header", getStoryByHeader); 
router.post("/code", getStoryByCode);
router.post("/update", updateStory); 
router.post("/position", updateStoryPosition); 
router.post("/reorder", reorderStory); 
router.post("/copy", copyStory);
router.post("/fullcopy", copyAllStory);
router.post("/delete", deleteStory);
router.post("/fulldelete", deleteAllStory);
router.post("/create", createStory); 


module.exports = router;
