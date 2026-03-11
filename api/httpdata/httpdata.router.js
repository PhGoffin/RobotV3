
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2026-03-10
 * @Last Modified by: 
 * @Last Modified time: 2024-06-03 09:38:24
 * @Description: All the routes available for the API Httpdata
 */

const router = require("express").Router();
const {
  createHttpdata,
  getHttpdataByCode,
  updateHttpdata,
  deleteHttpdata
} = require("./httpdata.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.post("/code", getHttpdataByCode);
router.post("/update", updateHttpdata); 
router.post("/delete", deleteHttpdata);
router.post("/create", createHttpdata); 


module.exports = router;
