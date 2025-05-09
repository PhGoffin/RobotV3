
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-18
 * @Last Modified by: 
 * @Last Modified time: 2024-04-15 14:26:42
 * @Description: All the routes available for the API AI Training
 */

const router = require("express").Router();
const {
  createTraining,
  getTraining,
  getTrainingByProject,
  updateTraining,
  updateTrainingActive, 
  deleteTraining,
  deleteAllTraining,
  updateTrainingPosition, 
  reorderTraining, 
  copyTraining 

} = require("./training.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getTraining);
router.get("/project/:id", getTrainingByProject);
router.post("/create", createTraining);
router.post("/update", updateTraining);
router.post("/active", updateTrainingActive);
router.get("/delete/:id", deleteTraining);
router.post("/fulldelete", deleteAllTraining);
router.post("/position", updateTrainingPosition); 
router.post("/reorder", reorderTraining); 
router.post("/copy", copyTraining);





module.exports = router;
