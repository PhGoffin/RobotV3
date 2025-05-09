
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-18 13:16:51
 * @Description: All the controllers (call operations) for the API faker
 */


const {
  createFaker,
  getFakerByCode,
  getFakers,
  updateFaker,
  deleteFaker
} = require("./faker.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // -----------------------------------------------------------
  // Insert a new faker 
  // -----------------------------------------------------------
  createFaker: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to insert a faker
    const result = await createFaker(body);
    if (!result.affectedRows) {
      throw new AppError('Failed! Insert record', 200);
    }
    return res.status(200).json({
      success: 1,
      id: result.insertId,
      message: "Faker created successfully"
    });
  }),


  // ---------------------------------------------------------------------------
  // get faker info by the code
  // ---------------------------------------------------------------------------
  getFakerByCode: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to get a specific code for a user

    if (!body.user == undefined || body.code == undefined) {
      throw new AppError('No input data for getFakertByCode!', 200);
    }

    const result = await getFakerByCode(body);
    if (!result.length) {
      throw new AppError('Record not found!', 200);
    }
    return res.json({
      success: 1,
      data: result,
    });
  }),


  // ---------------------------------------------------------------------------
  // get all faker info
  // ---------------------------------------------------------------------------
  getFakers: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all fakers
    const result = await getFakers();
    return res.json({
      success: 1,
      data: result
    });
  }),


  // ---------------------------------------------------------------------------
  // update a faker
  // ---------------------------------------------------------------------------
  updateFaker: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    const body = req.body;
    // Call the database services to update a reference
    const result = await updateFaker(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to update record!', 200);
    }
    return res.json({
      success: 1,
      message: "faker updated successfully",
    });
  }),


  // ---------------------------------------------------------------------------
  // Delete a faker
  // ---------------------------------------------------------------------------
  deleteFaker: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    const body = req.body;
    // Call the database services to delete a faker
    const result = await deleteFaker(body);
    if (!result.affectedRows) {
      throw new AppError('Failed to delete record!', 200);
    }
    return res.json({
      success: 1,
      message: "faker deleted successfully",
    });
  })

};



