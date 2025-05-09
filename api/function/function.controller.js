
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:17:42
 * @Description: All the controllers (call operations) for the API function
 */


const {
  createFunction,
  getFunction,
  getFunctionByName,
  getAllFunctions,
  updateFunction,
  updateFunctionPosition, 
  reorderFunction,
  copyFunction, 
  deleteFunction
} = require("./function.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Function 
  // -----------------------------------------------------------
  createFunction: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a function
    const result = await createFunction(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Function created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Function by ID
  // ---------------------------------------------------------------------------
  getFunction: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Function
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getFunction(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get Function by name
  // ---------------------------------------------------------------------------
  getFunctionByName: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a function by its name
    const result = await getFunctionByName(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  
  // ---------------------------------------------------------------------------
  // get all Functions
  // ---------------------------------------------------------------------------
  getAllFunctions: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a specific code for a Function
    const result = await getAllFunctions();
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Function
  // ---------------------------------------------------------------------------
  updateFunction: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a function
    const result = await updateFunction(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Function updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Function position
  // -----------------------------------------------------------
  updateFunctionPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Function
    const result = await updateFunctionPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Function position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Function table
  // -----------------------------------------------------------
  reorderFunction: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Function table
    const result = await reorderFunction();
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Function reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Function 
  // -----------------------------------------------------------
  copyFunction: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Function
    const result = await copyFunction(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Function record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Function copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Function
  // ---------------------------------------------------------------------------
  deleteFunction: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a function
    const result = await deleteFunction(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Function deleted successfully",
    });
  })

};



