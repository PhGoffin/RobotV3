
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2025-05-08
 * @Last Modified by: 
 * @Last Modified time: 2024-11-27 07:04:56
 * @Description: All the routes available for Playwright robot
 */


const router = require("express").Router();
const {
  testScenario,
  testSuite,
  testStory,
  testAllStory,
  cryptpassword,
  checkFilename,
  debugMsg

  //decryptpassword,
} = require("./robot.controller");



// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------

router.post("/test", testScenario); 
router.post("/suite", testSuite); 
router.post("/allstory", testAllStory); 
router.post("/story", testStory); 
router.post("/crypt", cryptpassword); 
router.post("/isFile", checkFilename)
router.post("/console", debugMsg)



module.exports = router;
