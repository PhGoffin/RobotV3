
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2024-11-21 09:42:19
 * @Description: All the routes available for the API Rule
 */

const router = require("express").Router();
const {
  createRule,
  getRule,
  getRulesByProject,
  getRulesByCode,
  getRulesByDictionary,  
  getRulesByHeader,
  exportRule,
  downloadFile,
  updateRule,
  updateRuleResult, 
  updateRulePosition, 
  updateActive,
  updateCommentType,  
  reorderRule,
  copyRule, 
  copyAllRules, 
  importRule,  
  deleteRule,
  deleteAllRules
} = require("./rule.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getRule); 
router.get("/project/:id", getRulesByProject); 
router.post("/code", getRulesByCode);
router.post("/dictionary", getRulesByDictionary);
router.get("/header/:id", getRulesByHeader); 
router.post("/export", exportRule); 
router.get("/download/:id", downloadFile);
router.post("/update", updateRule); 
router.post("/result", updateRuleResult); 
router.post("/active", updateActive); 
router.post("/commentType", updateCommentType); 
router.post("/position", updateRulePosition); 
router.post("/reorder", reorderRule); 
router.post("/copy", copyRule);
router.post("/fullcopy", copyAllRules);
router.post("/import", importRule);
router.post("/delete", deleteRule);
router.post("/fulldelete", deleteAllRules);
router.post("/create", createRule); 


module.exports = router;
