
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-10
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:20:34
 * @Description: All the routes available for the API natural
 */

const router = require("express").Router();
const {
  createNatural,
  getNatural,
  getNaturalByCode,
  getNaturalByHeader,
  updateNatural,
  updateNaturalPosition, 
  reorderNatural, 
  copyNatural, 
  copyAllNatural, 
  deleteNatural,
  deleteAllNatural
} = require("./natural.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getNatural); 
router.post("/value", getNaturalByCode);
router.post("/header", getNaturalByHeader); 
router.post("/update", updateNatural); 
router.post("/position", updateNaturalPosition); 
router.post("/reorder", reorderNatural); 
router.post("/copy", copyNatural);
router.post("/fullcopy", copyAllNatural);
router.post("/delete", deleteNatural);
router.post("/fulldelete", deleteAllNatural);
router.post("/create", createNatural); 


module.exports = router;
