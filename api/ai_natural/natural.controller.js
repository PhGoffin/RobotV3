
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-02 16:49:50
 * @Description: All the controllers (call operations) for the API natural
 */


const {
  createNatural,
  getNatural,
  getNaturalByCode,
  getNaturalByHeader,
  updateNatural,
  updateNaturalPosition, 
  reorderNatural, 
  copyNatural, 
  copyAllNatural, 
  deleteNatural,
  deleteAllNatural
} = require("./natural.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new natural record 
  // -----------------------------------------------------------
  createNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a natural
    const result = await createNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Natural created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get natural info
  // ---------------------------------------------------------------------------
  getNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get a specific code for a natural
    const result = await getNatural(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get natural info by the code (and translation)
  // ---------------------------------------------------------------------------
  getNaturalByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a natural
    const result = await getNaturalByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get all records from natural by a header
  // ---------------------------------------------------------------------------
  getNaturalByHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all natural records by a dataset
    const body = req.body;
    const result = await getNaturalByHeader(body);
    return res.json({
      success: 1,
      data: result
    });
  }),

  // ---------------------------------------------------------------------------
  // update a natural
  // ---------------------------------------------------------------------------
  updateNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a natural
    const result = await updateNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "natural updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a natural position
  // -----------------------------------------------------------
  updateNaturalPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Natural
    const result = await updateNaturalPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Natural position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Natural table
  // -----------------------------------------------------------
  reorderNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Natural table
    const body = req.body;
    const result = await reorderNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Natural reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Natural 
  // -----------------------------------------------------------
  copyNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Natural
    const result = await copyNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Natural record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Natural copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy all Natural records from the same naturalheader
  // -----------------------------------------------------------
  copyAllNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Natural
    const result = await copyAllNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a full Natural record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Full Natural copied successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a record in the natural
  // ---------------------------------------------------------------------------
  deleteNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "natural deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all natural record linked to a naturalheader
  // ---------------------------------------------------------------------------
  deleteAllNatural: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteAllNatural(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Full natural deleted successfully",
    });
  })


};



