
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 08:56:16
 * @Description: All the controllers (call operations) for the API Naturalheader
 */


const {
  createNaturalheader,
  getNaturalheader,
  getNaturalheaderById,
  getNaturalheaderByCode,
  updateNaturalheader,
  updateNaturalheaderPosition,
  reorderNaturalheader,
  copyNaturalheader,
  deleteNaturalheader
} = require("./naturalheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Naturalheader record 
  // -----------------------------------------------------------
  createNaturalheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createNaturalheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Natural set created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Naturalheader info
  // ---------------------------------------------------------------------------
  getNaturalheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    // Call the database services to get all Naturalheader
    const result = await getNaturalheader();
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get Naturalheader info
  // ---------------------------------------------------------------------------
  getNaturalheaderById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const id = req.params.id;
    // Call the database services to get a specific code for a Naturalheader
    const result = await getNaturalheaderById(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get Naturalheader info by the code (and translation)
  // ---------------------------------------------------------------------------
  getNaturalheaderByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a specific code for a Naturalheader
    const result = await getNaturalheaderByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Naturalheader
  // ---------------------------------------------------------------------------
  updateNaturalheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a Naturalheader
    const result = await updateNaturalheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Natural set updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Naturalheader position
  // -----------------------------------------------------------
  updateNaturalheaderPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Naturalheader
    const result = await updateNaturalheaderPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Natural set position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Naturalheader table
  // -----------------------------------------------------------
  reorderNaturalheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Naturalheader table
    const result = await reorderNaturalheader();
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Natural set reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Naturalheader 
  // -----------------------------------------------------------
  copyNaturalheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Naturalheader
    const result = await copyNaturalheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Natural set record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Natural set copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a record in the Naturalheader
  // ---------------------------------------------------------------------------
  deleteNaturalheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteNaturalheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Natural set deleted successfully",
    });
  })

};



