
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:21:16
 * @Description: All the routes available for the API faker
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createFaker,
  getFakerByCode,
  getFakers,
  updateFaker,
  deleteFaker
} = require("./faker.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getFakers); 
router.post("/value", getFakerByCode);
router.post("/update", updateFaker); 
router.post("/delete", deleteFaker);
router.post("/create", createFaker); 


module.exports = router;
