
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-08
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API Rule Header
 */

const router = require("express").Router();
const {
  createRuleheader,
  getRuleheader,
  getRuleheadersByProject,
  getRuleheadersByCode,
  updateRuleheader,
  updateRuleheaderPosition, 
  reorderRuleheader,
  copyRuleheader,
  importRuleheader, 
  deleteRuleheader
} = require("./ruleheader.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getRuleheader); 
router.get("/project/:id", getRuleheadersByProject); 
router.get("/code/:id", getRuleheadersByCode);
router.post("/update", updateRuleheader); 
router.post("/position", updateRuleheaderPosition); 
router.post("/reorder", reorderRuleheader); 
router.post("/copy", copyRuleheader);
router.post("/import", importRuleheader);
router.post("/delete", deleteRuleheader);
router.post("/create", createRuleheader); 


module.exports = router;
