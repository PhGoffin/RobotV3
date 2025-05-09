
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-21
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:23:00
 * @Description: All the routes available for the API scenario
 */

const router = require("express").Router();
const {
  createScenario,
  getScenarioById,
  getScenarioBySubproject,
  getScenarioByCode,
  importScenario,
  updateScenario,
  updateScenarioPosition, 
  reorderScenario,
  copyScenario,   
  deleteScenario
} = require("./scenario.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getScenarioById); 
router.get("/subproject/:id", getScenarioBySubproject);
router.post("/code", getScenarioByCode);
router.post("/import", importScenario);
router.post("/update", updateScenario);
router.post("/position", updateScenarioPosition); 
router.post("/reorder", reorderScenario); 
router.post("/copy", copyScenario);
router.post("/delete", deleteScenario);
router.post("/create", createScenario); 


module.exports = router;
