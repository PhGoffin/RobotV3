
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-27
 * @Last Modified by: 
 * @Last Modified time: 2024-11-27 07:04:56
 * @Description: All the routes available for Selenium robot
 */


const router = require("express").Router();
const {
  testScenario,
  testSuite,
  testStory,
  testAllStory,
  cryptpassword,
  checkFilename,
  AIAnalyse,
  AIAnalyseScreen,
  AIStopBrowser,
  AITraining,
  AIStatistic,
  debugMsg

  //decryptpassword,
} = require("./robot.controller");

// const BrowserUtility = require('../library/browser.library')
// const myBrowser = new BrowserUtility()

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------

router.post("/test", testScenario); 
router.post("/suite", testSuite); 
router.post("/allstory", testAllStory); 
router.post("/story", testStory); 
router.post("/crypt", cryptpassword); 
router.post("/isFile", checkFilename)
router.post("/analyse", AIAnalyse)
router.post("/analysescreen", AIAnalyseScreen)
router.post("/training", AITraining)
router.get("/stopbrowser", AIStopBrowser)
router.post("/statistic", AIStatistic)
router.post("/console", debugMsg)


//router.post("/decrypt", decryptpassword); 


module.exports = router;
