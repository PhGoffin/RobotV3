
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2023-12-09 07:46:48 
 * @Last Modified by: 
 * @Last Modified time: 2024-12-13 07:22:45
 * @Description: All the routes available for the API performance
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createPerformance,
  getPerformance,
  getPerformanceByProject,
  getPerformanceByCode,
  getPerformanceBySequence,
  getPerformanceByScenario,
  getPerformanceByStory,
  getPerformanceByStep,
  getMaxPerformance,
  getAveragePerformance,
  updatePerformance,
  updatePerformanceById,  
  deletePerformance,
  deleteAllPerformance,
  exportPerformance,
  downloadFile
} = require("./performance.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getPerformance); 
router.get("/project/:id", getPerformanceByProject); 
router.post("/story", getPerformanceByStory); 
router.post("/step", getPerformanceByStep); 
router.post("/scenario", getPerformanceByScenario); 
router.post("/code", getPerformanceByCode);
router.post("/sequence", getPerformanceBySequence);
router.post("/max",   getMaxPerformance);
router.post("/average", getAveragePerformance);
router.post("/update", updatePerformance); 
router.post("/updatebyid", updatePerformanceById); 
router.post("/delete", deletePerformance);
router.post("/fulldelete", deleteAllPerformance);
router.post("/export", exportPerformance);
router.get("/download/:id", downloadFile);
router.post("/create", createPerformance); 


module.exports = router;
