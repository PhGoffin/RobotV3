
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-11-28 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API reference
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createReference,
  getReference,
  getReferenceByCode,
  getReferenceByProject,
  getReferenceByDashboard,
  updateReference,
  updateReferencePosition, 
  reorderReference,
  copyReference, 
  deleteReference,
  deleteAllReference
} = require("./reference.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getReference); 
router.post("/project", getReferenceByProject); 
router.post("/code", getReferenceByCode);
router.post("/dashboard", getReferenceByDashboard);
router.post("/update", updateReference); 
router.post("/position", updateReferencePosition); 
router.post("/reorder", reorderReference); 
router.post("/copy", copyReference);
router.post("/delete", deleteReference);
router.post("/fulldelete", deleteAllReference);
router.post("/create", createReference); 


module.exports = router;
