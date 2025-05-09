
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:16:15
 * @Description: All the controllers (call operations) for the API datasession (data is used to exchange information during a session )
 */


const {
  createDataSession,
  getDataSession,
  getDataSessionByCode,
  updateDataSession,
  deleteDataSession,
  resetDataSession
} = require("./datasession.service");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new data session 
  // -----------------------------------------------------------
  createDataSession: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;

    // Call the database services to insert a data session
    const result = await createDataSession(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Data session created successfully",
      // ????   profile_url: 'http://localhost:5000/public/${req.file.filename}',
    });
  }),

  // ---------------------------------------------------------------------------
  // get session info by the code
  // ---------------------------------------------------------------------------
  getDataSessionByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a specific code for a user

    if (!body.user == undefined || body.code == undefined) {
      throw new AppError('No input data for getDataSessionByCode!', 200);
    }

    const result = await getDataSessionByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all data session
  // ---------------------------------------------------------------------------
  getDataSession: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all users
    const result = await getDataSession();
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update data session
  // ---------------------------------------------------------------------------
  updateDataSession: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;

    // Call the database services to update a user
    const result = await updateDataSession(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a record in the data session
  // ---------------------------------------------------------------------------
  deleteDataSession: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;

    if (!body.user == undefined || body.code == undefined) {
      throw new AppError('No input data for deleteDataSession!', 200);
    }

    // Call the database services to delete a user
    const result = await deleteDataSession(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Code deleted successfully",
    });
  }),

  // ---------------------------------------------------------------------------
  // Delete all records from the data session
  // ---------------------------------------------------------------------------
  resetDataSession: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to delete a user
    const result = await resetDataSession(id);
    if (!result.affectedRows) {
      throw new AppError('Failed to reset record!', 200);
    }
    return res.json({
      success: 1,
      message: "datasession reset successfully",
    });
  })


};



