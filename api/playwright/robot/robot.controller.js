
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2025-05-08
 * @Last Modified by: Someone
 * @Last Modified time: 2025-05-27 08:03:22
 * @Description: All the controllers (call operations) for the Playwright robot
 */


const {
  testScenario,
  testSuite,
  testStory,
  testAllStory,
  cryptpassword,
  checkFilename,
  AIAnalyse,
  AIAnalyseScreen,
  AITraining,
  AIStopBrowser,
  AIStatistic,
  debugMsg
} = require("./robot.service");

const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");

module.exports = {

  // -----------------------------------------------------------
  // AI Analyse: Open a webpage
  // -----------------------------------------------------------
  AIAnalyseScreen: catchAsync(async (req, res, next) => {

    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to open a webpage (scenario or url)
    const result = await AIAnalyseScreen(body);
    //console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message,
      data: result.data
    });
  }),

  // -----------------------------------------------------------
  // AI Analyse a webpage
  // -----------------------------------------------------------
  AIAnalyse: catchAsync(async (req, res, next) => {

    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to analyse a webpage
    const result = await AIAnalyse(body);
    console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message,
      data: result.data
    });
  }),


  // -----------------------------------------------------------
  // AI Training to discover new patterns
  // -----------------------------------------------------------
  AITraining: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to train the robot
    const result = await AITraining(body);
    //console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message,
      data: result.data
    });
  }),

  // -----------------------------------------------------------
  // AI Robot: Stop (Quit) the browser
  // -----------------------------------------------------------
  AIStopBrowser: catchAsync(async (req, res, next) => {

    res.set('Access-Control-Allow-Origin', '*');    
    // Call the selenium services to close the browser
    const result = await AIStopBrowser();
    console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message,
    });
  }),  

  // -----------------------------------------------------------
  // AI Statistic to refine the patterns
  // -----------------------------------------------------------
  AIStatistic: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to produce statistics to refine the patterns
    const result = await AIStatistic(body);
    //console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message,
      data: result.data
    });
  }),

  // -----------------------------------------------------------
  // Execute a scenario
  // -----------------------------------------------------------
  testScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to execute a scenario
    const result = await testScenario(body);
    console.log ('testScenario controller', result)
    if (!result.success) {
      throw new AppError(result.message, 200);     
    }
    return res.status(200).json({
      success: 1,
      message: result.message
    });
  }),

  // -----------------------------------------------------------
  // Execute a suite
  // -----------------------------------------------------------
  testSuite: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to execute a suite
    //console.log ('Result Body: ', body)
    const result = await testSuite(body);
    //console.log ('Result Suite: ', result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message
    });
  }),  

  // -----------------------------------------------------------
  // Execute a story
  // -----------------------------------------------------------
  testStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to execute a story
    const result = await testStory(body);
    console.log ('Result Story: ', result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message
    });
  }),  

  // -----------------------------------------------------------
  // Execute all stories
  // -----------------------------------------------------------
  testAllStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to execute a story
    const result = await testAllStory(body);
    console.log ('Result Story: ', result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      message: result.message
    });
  }),  





  // -----------------------------------------------------------
  // Crypt a password
  // -----------------------------------------------------------
  cryptpassword: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to crypt a password
    const result = await cryptpassword(body);
    //console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      password: result.password,
      message: result.message
    });
  }),
  
  // -----------------------------------------------------------
  // Decrypt a password
  // -----------------------------------------------------------
  decryptpassword: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to crypt a password
    const result = await decryptpassword(body);
    console.log (result)
    if (!result.success) {
      throw new AppError(result.message, 200);
    }
    return res.status(200).json({
      success: 1,
      password: result.password,
      message: result.message
    });
  }),
  
  // -----------------------------------------------------------
  // Check if a file exists
  // -----------------------------------------------------------
  checkFilename: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to crypt a password
    const result = await checkFilename(body);
    //console.log (result)
    return res.status(200).json({
      success: result,
      message: "checkFile OK!"
    });
  }),

    // -----------------------------------------------------------
  // AI Analyse: Open a webpage
  // -----------------------------------------------------------
  debugMsg: catchAsync(async (req, res, next) => {

    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the selenium services to display a debug message on the console
    const result = await debugMsg(body);
    //console.log (result)
    return res.status(200).json({
      success: 1,
      message: "debugMsg OK",
      data: 1
    });
  }),

};



