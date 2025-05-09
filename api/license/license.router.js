
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2024-01-09 09:09:54
 * @Description: All the routes available for the API License
 */

const router = require("express").Router();
//const { checkToken } = require("../../auth/token_validation");
const {
  createLicense,
  getLicenseByName,
  getLicenseById,
  getLicenses,
  updateLicense,
  deleteLicense
} = require("./licence.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getLicenses); 
router.get("/:id", getLicenseById); 
router.post("/value", getLicenseByName);
router.post("/update", updateLicense); 
router.post("/delete", deleteLicense);
router.post("/create", createLicense); 


module.exports = router;
