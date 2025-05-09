
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-26
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:18:19
 * @Description: All the controllers (call operations) for the API parameter
 */


const {
  createParameter,
  getParametersByProject,
  getParametersByCode,
  getParameter,
  getParametersByStory,
  updateParameter,
  updateParameterPosition, 
  reorderParameter,
  copyParameter, 
  deleteParameter
} = require("./parameter.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Parameter 
  // -----------------------------------------------------------
  createParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a parameter
    const result = await createParameter(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Parameter created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Parameter by the projectID
  // ---------------------------------------------------------------------------
  getParametersByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get all parameter for a project
    const result = await getParametersByProject(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get Parameter by  projectID and code
  // ---------------------------------------------------------------------------
  getParametersByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get one Parameter
    const body = req.body;
    const result = await getParametersByCode(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get Parameter by  projectID and storyheaderID
  // ---------------------------------------------------------------------------
  getParametersByStory: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get one Parameter by story
    const body = req.body;
    const result = await getParametersByStory(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // get detail of a parameter
  // ---------------------------------------------------------------------------
  getParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get detail of a Parameter
    const id = req.params.id;
    const result = await getParameter(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Parameter
  // ---------------------------------------------------------------------------
  updateParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Parameter
    const result = await updateParameter(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Parameter updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a parameter position
  // -----------------------------------------------------------
  updateParameterPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a parameter
    const result = await updateParameterPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Parameter position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Parameter table
  // -----------------------------------------------------------
  reorderParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the parameter table
    const body = req.body;
    const result = await reorderParameter(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Parameter reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Parameter 
  // -----------------------------------------------------------
  copyParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a parameter
    const result = await copyParameter(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a parameter record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Parameter copied successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a Parameter
  // ---------------------------------------------------------------------------
  deleteParameter: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Parameter
    const result = await deleteParameter(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Parameter deleted successfully",
    });
  })

};



