
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-15
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:17:42
 * @Description: All the controllers (call operations) for the API Pattern
 */


const {
  createPattern,
  getPattern,
  getPatternByProject,
  getPatternsByCode,
  getPatternsByPath,
  updatePattern,
  updatePatternPosition, 
  reorderPattern,
  copyPattern, 
  deletePattern,
  deleteAllPattern,
  importPattern,
  exportPattern
} = require("./pattern.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Pattern 
  // -----------------------------------------------------------
  createPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a Pattern
    const result = await createPattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Pattern created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get a Pattern by ID
  // ---------------------------------------------------------------------------
  getPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a Pattern
    const id = req.params.id;
    //console.log ('Id: ' + id)
    const result = await getPattern(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get all Patterns for a pattern code
  // ---------------------------------------------------------------------------
  getPatternsByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all patterns from a code
    const body = req.body;
    const result = await getPatternsByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

    // ---------------------------------------------------------------------------
  // get a Pattern for a path/selector code
  // ---------------------------------------------------------------------------
  getPatternsByPath: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get a pattern from a projectID, pathId and a selectorID
    const body = req.body;
    const result = await getPatternsByPath(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),



  // ---------------------------------------------------------------------------
  // get all Patterns by project
  // ---------------------------------------------------------------------------
  getPatternByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all patterns by project
    const id = req.params.id;
    const result = await getPatternByProject(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Pattern
  // ---------------------------------------------------------------------------
  updatePattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Pattern
    const result = await updatePattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Pattern updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Pattern position
  // -----------------------------------------------------------
  updatePatternPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Pattern
    const result = await updatePatternPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Pattern position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Pattern table
  // -----------------------------------------------------------
  reorderPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Pattern table
    const body = req.body;
    const result = await reorderPattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Pattern reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Pattern 
  // -----------------------------------------------------------
  copyPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Pattern
    const result = await copyPattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Pattern record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Pattern copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a Pattern
  // ---------------------------------------------------------------------------
  deletePattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Pattern
    const result = await deletePattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Pattern deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all Patterns of a project
  // ---------------------------------------------------------------------------
  deleteAllPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a Pattern
    const result = await deleteAllPattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to full delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Pattern full deleted successfully",
    });
  }),



  // ---------------------------------------------------------------------------
  // Import patterns into a project
  // ---------------------------------------------------------------------------
  importPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to import Patterns
    const result = await importPattern(body);
    console.log ('result: ' , result)
    if (!result.success) {
      throw new AppError('Failed to import pattern', 200);
    }
    return res.json({
      success: 1,
      message: result.message,
    });
  }),

  // ---------------------------------------------------------------------------
  // Export patterns from a project
  // ---------------------------------------------------------------------------
  exportPattern: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to export Patterns
    const result = await exportPattern(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to export pattern', 200);
    }
    return res.json({
      success: 1,
      message: "Pattern exported successfully",
    });
  })



};



