
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 14:26:42
 * @Description: All the routes available for the API AI Statistic
 */

const router = require("express").Router();
const {
  createStatistic,
  getStatistic,
  getStatisticByProject,
  getStatisticByPath,
  updateStatistic,
  deleteStatistic,
  deleteAllStatistic,
  updateStatisticPosition, 
  updateStatisticCondition, 
  reorderStatistic, 
  copyStatistic 

} = require("./statistic.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getStatistic);
router.get("/project/:id", getStatisticByProject);
router.post("/path", getStatisticByPath);
router.post("/create", createStatistic);
router.post("/update", updateStatistic);
router.get("/delete/:id", deleteStatistic);
router.post("/fulldelete", deleteAllStatistic);
router.post("/position", updateStatisticPosition); 
router.post("/condition", updateStatisticCondition); 
router.post("/reorder", reorderStatistic); 
router.post("/copy", copyStatistic);





module.exports = router;
