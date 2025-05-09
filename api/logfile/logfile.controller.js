
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-29
 * @Last Modified by: 
 * @Last Modified time: 2024-08-02 15:10:21
 * @Description: All the controllers (call operations) for the API logfile
 */


const {
  createLogfile,
  getLogfileByUser,
  reorderLogfile,
  deleteLogfile,
  exportLog
} = require("./logfile.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new logfile 
  // -----------------------------------------------------------
  createLogfile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a logfile
    const result = await createLogfile(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Logfile created successfully"
    });
  }),

  // ---------------------------------------------------------------------------
  // get all logfiles from a userID
  // ---------------------------------------------------------------------------
  getLogfileByUser: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all logfile from a user
    const id = req.params.id;
    const result = await getLogfileByUser(id);
    return res.json({
      success: 1,
      data: result
    });
  }),


  // -----------------------------------------------------------
  // Reorder the logfile table
  // -----------------------------------------------------------
  reorderLogfile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to reorder the logfile table
    const id = req.params.id;
    const result = await reorderLogfile(id);
    if (!result.affectedRows) {
      throw new AppError('Failed! reordering record', 200);
    }
    return res.status(200).json({
      success: 1,
      message: "Logfile reordered successfully",
    });
  }),

  // -----------------------------------------------------------
  // Export a logfile 
  // -----------------------------------------------------------
  exportLog: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to export a logfile into a json file
    const result = await exportLog(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! export record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Logfile exported successfully"
    });
  }),  


  // ---------------------------------------------------------------------------
  // Delete all logfile of a user
  // ---------------------------------------------------------------------------
  deleteLogfile: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to delete all the logfiles of a user
    const id = req.params.id;
    const result = await deleteLogfile(id);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "logfile deleted successfully",
    });
  })

};



