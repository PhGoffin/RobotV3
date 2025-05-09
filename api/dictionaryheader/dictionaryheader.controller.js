
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-09
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:16:36
 * @Description: All the controllers (call operations) for the API Dictionaryheader
 */


const {
  createDictionaryheader,
  getDictionaryheader,
  getDictionaryheaderByCode,
  getDictionaryheaderByProject,
  updateDictionaryheader,
  updateDictionaryheaderPosition, 
  reorderDictionaryheader, 
  copyDictionaryheader, 
  deleteDictionaryheader
} = require("./dictionaryheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Dictionaryheader record 
  // -----------------------------------------------------------
  createDictionaryheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createDictionaryheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Dictionary set created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Dictionaryheader info
  // ---------------------------------------------------------------------------
  getDictionaryheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get a specific code for a Dictionaryheader
    const result = await getDictionaryheader(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get Dictionaryheader info by the code (and translation)
  // ---------------------------------------------------------------------------
  getDictionaryheaderByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a Dictionaryheader
    const result = await getDictionaryheaderByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all records from Dictionaryheader by a project
  // ---------------------------------------------------------------------------
  getDictionaryheaderByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Dictionaryheader
    const id = req.params.id;
    const result = await getDictionaryheaderByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a Dictionaryheader
  // ---------------------------------------------------------------------------
  updateDictionaryheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a Dictionaryheader
    const result = await updateDictionaryheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Dictionary set updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a Dictionaryheader position
  // -----------------------------------------------------------
  updateDictionaryheaderPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Dictionaryheader
    const result = await updateDictionaryheaderPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dictionary set position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Dictionaryheader table
  // -----------------------------------------------------------
  reorderDictionaryheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Dictionaryheader table
    const body = req.body;
    const result = await reorderDictionaryheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Dictionary set reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Dictionaryheader 
  // -----------------------------------------------------------
  copyDictionaryheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Dictionaryheader
    const result = await copyDictionaryheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Dictionary set record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Dictionary set copied successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete a record in the Dictionaryheader
  // ---------------------------------------------------------------------------
  deleteDictionaryheader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteDictionaryheader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Dictionary set deleted successfully",
    });
  })

};



