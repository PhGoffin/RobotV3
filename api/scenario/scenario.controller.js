
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-29 15:32:32
 * @Description: All the controllers (call operations) for the API scenario
 */


const {
  createScenario,
  getScenarioById,
  getScenarioBySubproject,
  getScenarioByCode,
  importScenario,  
  updateScenario,
  updateScenarioPosition, 
  reorderScenario,
  copyScenario,   
  deleteScenario
} = require("./scenario.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new scenario 
  // -----------------------------------------------------------
  createScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createScenario(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Scenario created successfully"
    });
  }),



  // ---------------------------------------------------------------------------
  // get scenarios by the Id
  // ---------------------------------------------------------------------------
  getScenarioById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a specific scenario
    const id = req.params.id;
    const result = await getScenarioById(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get all scenarios by subproject
  // ---------------------------------------------------------------------------
  getScenarioBySubproject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get all scenarios for a subproject
    const result = await getScenarioBySubproject(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get scenario by code (name)
  // ---------------------------------------------------------------------------
  getScenarioByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a scenario by the name
    const result = await getScenarioByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // import a scenario
  // ---------------------------------------------------------------------------
  importScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to import a scenario
    const result = await importScenario(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! importing a scenario', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Scenario imported successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // update a scenario
  // ---------------------------------------------------------------------------
  updateScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a scenario 
    const result = await updateScenario(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Scenario updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Scenario position
  // -----------------------------------------------------------
  updateScenarioPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Scenario
    const result = await updateScenarioPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Scenario position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Scenario table
  // -----------------------------------------------------------
  reorderScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Scenario table
    const body = req.body;
    const result = await reorderScenario(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Scenario reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Scenario 
  // -----------------------------------------------------------
  copyScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Scenario
    const result = await copyScenario(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Scenario record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,      
      message: "Scenario copied successfully",
    });
  }),



  // ---------------------------------------------------------------------------
  // Delete a scenario
  // ---------------------------------------------------------------------------
  deleteScenario: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteScenario(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Scenario deleted successfully",
    });
  })

};



