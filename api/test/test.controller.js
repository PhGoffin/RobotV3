
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-28
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-06-01 12:55:21
 * @Description: All the controllers (call operations) for the API test
 */


const {
  createTest,
  getTestByScenario,
  getTest,
  getTestByDictionary,
  importTest,
  exportTest,
  updateTest,
  updateTestPosition, 
  updateTestParameter,  
  updateActive,  
  updateCommentType,
  reorderTest,
  copyTest, 
  copyAllTest, 
  deleteTest,
  deleteAllTest
} = require("./test.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new test 
  // -----------------------------------------------------------
  createTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a test
    const result = await createTest(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Test created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get test by the scenarioID
  // ---------------------------------------------------------------------------
  getTestByScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get all tests for a scenario
    const result = await getTestByScenario(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get detail of a test
  // ---------------------------------------------------------------------------
  getTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get detail of a test
    const id = req.params.id;
    const result = await getTest(id);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // Get Test by dictionary (used in parameter1, 2, 3 or 4)
  // ---------------------------------------------------------------------------
  getTestByDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to search for dictionary used in a test
    const result = await getTestByDictionary(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result
    });
  }),  


  // ---------------------------------------------------------------------------
  // Import a Test into another scenario
  // ---------------------------------------------------------------------------
  importTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to import a test
    const result = await importTest(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to import a test!', 200);
    }
    return res.json({
      success: 1,
      message: "Test imported successfully",
    });
  }),  

  // ---------------------------------------------------------------------------
  // Export Tests into a json file
  // ---------------------------------------------------------------------------
  exportTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to export tests
    const result = await exportTest(body);
    //console.log ('Result: ', result)
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to export a test!', 200);
    }
    return res.json({
      success: 1,
      message: "Test exported successfully with " + result.affectedRows + " record(s)",
    });
  }),  

  // ---------------------------------------------------------------------------
  // Download an export json file
  // ---------------------------------------------------------------------------
  downloadFile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const path = require('path')
    let fileName = req.params.id;
    console.log('fileName: ', fileName)
    fileName = './data/' + fileName.replace(/@/g, '/')
    console.log('fileName: ', fileName)

    res.download(
      fileName,
      (err) => {
        if (err) {
          res.send({
            error: err,
            msg: "Problem downloading the file"
          })
        }
      });
  }),


  // ---------------------------------------------------------------------------
  // update a Test
  // ---------------------------------------------------------------------------
  updateTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a test
    const result = await updateTest(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Test updated successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // update parameters
  // ---------------------------------------------------------------------------
  updateTestParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update test parameters
    const result = await updateTestParameter(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to update test parameters!', 200);
    }
    return res.json({
      success: 1,
      message: "Test parameters updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // update active status
  // ---------------------------------------------------------------------------
  updateActive: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update test active status
    const result = await updateActive(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to update test active!', 200);
    }
    return res.json({
      success: 1,
      message: "Test active updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // update Comment Type
  // ---------------------------------------------------------------------------
  updateCommentType: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update test comment type
    const result = await updateCommentType(body);
    if (!result.affectedRows) {
      //console.log (result)
      throw new AppError('Failed to update test Comment Type!', 200);
    }
    return res.json({
      success: 1,
      message: "Test Comment Type updated successfully",
    });
  }),



  // -----------------------------------------------------------
  // Update a test position
  // -----------------------------------------------------------
  updateTestPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a test
    const result = await updateTestPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Test position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Test table
  // -----------------------------------------------------------
  reorderTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the test table
    const body = req.body;
    const result = await reorderTest(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Test reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Test 
  // -----------------------------------------------------------
  copyTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a test
    const result = await copyTest(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a test record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Test copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Test 
  // -----------------------------------------------------------
  copyAllTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a test
    const result = await copyAllTest(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying all tests from a scenario record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Test copied successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a Test
  // ---------------------------------------------------------------------------
  deleteTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Test
    const result = await deleteTest(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Test deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all Tests linked to a scenario
  // ---------------------------------------------------------------------------
  deleteAllTest: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete all Tests linked to a scenario
    const result = await deleteAllTest(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Test full deleted successfully",
    });
  })  

};



