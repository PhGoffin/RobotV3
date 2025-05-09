
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-09 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-09 09:14:51
 * @Description: All the controllers (call operations) for the API Roles
 */


const {
  getRoles
} = require("./role.service");

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // ---------------------------------------------------------------------------
  // get all Roles info
  // ---------------------------------------------------------------------------
  getRoles: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');    
    // Call the database services to get all Roles
    const result = await getRoles();
    return res.json({
      success: 1,
      data: result
    });
  }),


};



