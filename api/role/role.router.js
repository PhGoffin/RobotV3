
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-09 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-09 09:22:29
 * @Description: All the routes available for the API Role
 */

const router = require("express").Router();
//const { checkToken } = require("../../auth/token_validation");
const {
  getRoles
} = require("./role.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getRoles); 

module.exports = router;
