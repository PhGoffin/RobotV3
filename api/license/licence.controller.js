
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-09 09:10:07
 * @Description: All the controllers (call operations) for the API License
 */


const {
  createLicense,
  getLicenseByName,
  getLicenseById,
  getLicenses,
  updateLicense,
  deleteLicense
} = require("./license.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new License 
  // -----------------------------------------------------------
  createLicense: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to insert a license
    const result = await createLicense(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "License created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get License info by the Name
  // ---------------------------------------------------------------------------
  getLicenseByName: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to get a specific license

    if (!body.license == undefined) {
      throw new AppError('No input data for getLicenseByName!', 200);
    }

    const result = await getLicenseByName(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get License info by the Name
  // ---------------------------------------------------------------------------
  getLicenseById: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const id = req.params.id;
    // Call the database services to get a specific license
    const result = await getLicenseById(id);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),



  // ---------------------------------------------------------------------------
  // get all Licenses info
  // ---------------------------------------------------------------------------
  getLicenses: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Licenses
    const result = await getLicenses();
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a License
  // ---------------------------------------------------------------------------
  updateLicense: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to update a License
    const result = await updateLicense(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "License updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a License
  // ---------------------------------------------------------------------------
  deleteLicense: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a license
    const result = await deleteLicense(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "License deleted successfully",
    });
  })

};



