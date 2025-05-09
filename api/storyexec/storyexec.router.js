
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-28
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-09 16:46:31
 * @Description: All the routes available for the API Story Exec
 */

const router = require("express").Router();
const {
  getExecutedStory,
  resetExecutedStory,
  counterExecutedStory,
  deleteExecutedStory
} = require("./storyexec.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/execute", getExecutedStory); 
router.post("/delete", deleteExecutedStory);
router.post("/reset", resetExecutedStory); 
router.post("/counter", counterExecutedStory); 


module.exports = router;
