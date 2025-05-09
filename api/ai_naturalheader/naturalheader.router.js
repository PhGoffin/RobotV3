
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-10-02
 * @Last Modified by: 
 * @Last Modified time: 2024-10-02 10:23:32
 * @Description: All the routes available for the API Naturalheader
 */

const router = require("express").Router();
const {
  createNaturalheader,
  getNaturalheader,
  getNaturalheaderById,
  getNaturalheaderByCode,
  updateNaturalheader,
  updateNaturalheaderPosition, 
  reorderNaturalheader, 
  copyNaturalheader, 
  deleteNaturalheader
} = require("./naturalheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/", getNaturalheader); 
router.get("/:id", getNaturalheaderById); 
router.post("/value", getNaturalheaderByCode);
router.post("/update", updateNaturalheader); 
router.post("/position", updateNaturalheaderPosition); 
router.get("/reorder", reorderNaturalheader); 
router.post("/copy", copyNaturalheader);
router.post("/delete", deleteNaturalheader);
router.post("/create", createNaturalheader); 


module.exports = router;
