
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-10
 * @Last Modified by: Someone
 * @Last Modified time: 2026-03-09 11:38:16
 * @Description: All the controllers (call operations) for the API Certificate
 */


const {
  createCertificate,
  getCertificateByCode,
  updateCertificate,
  deleteCertificate
} = require("./certificate.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new Certificate 
  // -----------------------------------------------------------
  createCertificate: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a Certificate
    const result = await createCertificate(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Certificate created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get Certificate info by the code
  // ---------------------------------------------------------------------------
  getCertificateByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a specific code for a Certificate
    const result = await getCertificateByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),



  // ---------------------------------------------------------------------------
  // update a Certificate
  // ---------------------------------------------------------------------------
  updateCertificate: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a Certificate
    const result = await updateCertificate(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "Certificate updated successfully",
    });
  }),

  
  // ---------------------------------------------------------------------------
  // Delete a Certificate
  // ---------------------------------------------------------------------------
  deleteCertificate: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to delete a Certificate
    const result = await deleteCertificate(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "Certificate deleted successfully",
    });
  }),

};



