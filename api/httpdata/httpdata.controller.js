
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-10
 * @Last Modified by: Someone
 * @Last Modified time: 2026-03-09 11:38:16
 * @Description: All the controllers (call operations) for the API Httpdata
 */


const {
  createHttpdata,
  getHttpdataByCode,
  updateHttpdata,
  deleteHttpdata
} = require("./httpdata.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Httpdata 
  // -----------------------------------------------------------
  createHttpdata: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a Httpdata
    const result = await createHttpdata(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Httpdata created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Httpdata info by the code
  // ---------------------------------------------------------------------------
  getHttpdataByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a specific code for a Httpdata
    const result = await getHttpdataByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),



  // ---------------------------------------------------------------------------
  // update a Httpdata
  // ---------------------------------------------------------------------------
  updateHttpdata: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a Httpdata
    const result = await updateHttpdata(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Httpdata updated successfully",
    });
  }),

  
  // ---------------------------------------------------------------------------
  // Delete a Httpdata
  // ---------------------------------------------------------------------------
  deleteHttpdata: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a Httpdata
    const result = await deleteHttpdata(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Httpdata deleted successfully",
    });
  }),

};



