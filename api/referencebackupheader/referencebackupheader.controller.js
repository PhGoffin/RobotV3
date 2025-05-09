
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04 
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-03-04
 * @Description: All the controllers (call operations) for the API reference backup header
 */

const {
  createRefBackHeader,
  getRefBackHeaderByProject,
  getRefBackHeaderByUser,
  getRefBackHeaderBySlot,
  getUserFromRefBackHeader,  
  deleteRefBackHeader
} = require("./referencebackupheader.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new reference 
  // -----------------------------------------------------------
  createRefBackHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createRefBackHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Reference Backup Header created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get reference backup header info by project
  // ---------------------------------------------------------------------------
  getRefBackHeaderByProject: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific backup reference header

    const result = await getRefBackHeaderByProject(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get reference backup header info by user
  // ---------------------------------------------------------------------------
  getRefBackHeaderByUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific backup reference header

    const result = await getRefBackHeaderByUser(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  // ---------------------------------------------------------------------------
  // get reference backup header info by user slot
  // ---------------------------------------------------------------------------
  getRefBackHeaderBySlot: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific backup reference header

    const result = await getRefBackHeaderBySlot(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),

  
  // ---------------------------------------------------------------------------
  // get all the users with a reference backup header
  // ---------------------------------------------------------------------------
  getUserFromRefBackHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get users with a backup reference header
    const result = await getUserFromRefBackHeader(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),



  // ---------------------------------------------------------------------------
  // Delete a backup reference header
  // ---------------------------------------------------------------------------
  deleteRefBackHeader: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a backup reference header
    const result = await deleteRefBackHeader(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "backup reference header deleted successfully",
    });
  })

};



