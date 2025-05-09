
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-12-21 07:48:15 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-21 13:16:15
 * @Description: All the controllers (call operations) for the API library
 */


const {
  getLibrary
} = require("./library.service");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");


module.exports = {


  // ---------------------------------------------------------------------------
  // get all the libraries
  // ---------------------------------------------------------------------------
  getLibrary: catchAsync(async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    // Call the database services to get all libraries
    const result = await getLibrary();
    return res.json({
      success: 1,
      data: result
    });
  }),

};



