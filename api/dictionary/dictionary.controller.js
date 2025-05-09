
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-02
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-02 16:49:50
 * @Description: All the controllers (call operations) for the API dictionary
 */


const {
  createDictionary,
  getDictionary,
  getDictionaryByCode,
  getDictionaryByProject,
  getDictionaryByHeader,
  getUnusedDictionary,  
  updateDictionary,
  updateDictionaryPosition, 
  reorderDictionary, 
  copyDictionary, 
  copyAllDictionary, 
  deleteDictionary,
  deleteAllDictionary
} = require("./dictionary.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new dictionary record 
  // -----------------------------------------------------------
  createDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Dictionary created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get dictionary info
  // ---------------------------------------------------------------------------
  getDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get a specific code for a dictionary
    const result = await getDictionary(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get dictionary info by the code (and translation)
  // ---------------------------------------------------------------------------
  getDictionaryByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific code for a dictionary
    const result = await getDictionaryByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all records from dictionary by a project
  // ---------------------------------------------------------------------------
  getDictionaryByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all dictionary
    const id = req.params.id;
    const result = await getDictionaryByProject(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get all unused records from dictionary by a project
  // ---------------------------------------------------------------------------
  getUnusedDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all dictionary
    const id = req.params.id;
    const result = await getUnusedDictionary(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // get all records from dictionary by a header
  // ---------------------------------------------------------------------------
  getDictionaryByHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all dictionary records by a dataset
    const body = req.body;
    const result = await getDictionaryByHeader(body);
    return res.json({
      success: 1,
      data: result
    });
  }),



  // ---------------------------------------------------------------------------
  // update a dictionary
  // ---------------------------------------------------------------------------
  updateDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a dictionary
    const result = await updateDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "dictionary updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Update a dictionary position
  // -----------------------------------------------------------
  updateDictionaryPosition: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update the position of a Dictionary
    const result = await updateDictionaryPosition(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! updating the record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dictionary position updated successfully",
    });
  }),

  // -----------------------------------------------------------
  // Reorder the Dictionary table
  // -----------------------------------------------------------
  reorderDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the Dictionary table
    const body = req.body;
    const result = await reorderDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      result: result,
      message: "Dictionary reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy a Dictionary 
  // -----------------------------------------------------------
  copyDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Dictionary
    const result = await copyDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a Dictionary record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Dictionary copied successfully",
    });
  }),

  // -----------------------------------------------------------
  // Copy all Dictionary records from the same dictionaryheader
  // -----------------------------------------------------------
  copyAllDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to copy a Dictionary
    const result = await copyAllDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! copying a full Dictionary record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Full Dictionary copied successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a record in the dictionary
  // ---------------------------------------------------------------------------
  deleteDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "dictionary deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all dictionary record linked to a dictionaryheader
  // ---------------------------------------------------------------------------
  deleteAllDictionary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteAllDictionary(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Full dictionary deleted successfully",
    });
  })


};



