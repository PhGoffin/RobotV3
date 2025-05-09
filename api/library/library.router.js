
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-12-21 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-21 10:23:52
 * @Description: All the routes available for the API library
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  getLibrary  
} = require("./library.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getLibrary);


module.exports = router;
