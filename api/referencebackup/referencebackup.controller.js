
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-03-04
 * @Last Modified by: Goffin Philippe
 * @Last Modified time: 2024-03-05 16:10
 * @Description: All the controllers (call operations) for the API reference backup
 */


const {
  importRefrencebackup,
  exportReferencebackup,
  deleteReferencebackup
} = require("./referencebackup.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Import a reference backup into reference 
  // -----------------------------------------------------------
  importRefrencebackup: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await importRefrencebackup(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Import record', 200);
    }
    return res.status(200).json({
      success: 1,
      count: result.affectedRows,
      message: "Reference imported successfully"
    });
  }),

  // -----------------------------------------------------------
  // Export a reference into a reference backup 
  // -----------------------------------------------------------
  exportReferencebackup: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a faker
    const result = await exportReferencebackup(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Export record', 200);
    }
    return res.status(200).json({
      success: 1,
      count: result.affectedRows,
      message: "Reference exported successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a reference backup
  // ---------------------------------------------------------------------------
  deleteReferencebackup: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteReferencebackup(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "reference backup deleted successfully",
    });
  })

};



