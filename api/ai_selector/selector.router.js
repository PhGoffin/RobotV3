
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-04-09
 * @Last Modified by: Philippe Goffin
 * @Last Modified time: 2024-04-09 16:04:07
 * @Description: All the routes available for the API AI Selector
 */

const router = require("express").Router();
const {
  createSelector,
  getSelector,
  getSelectorByProject,
  updateSelector,
  deleteSelector,
  deleteAllSelector,
  importSelector,
  updateSelectorPosition, 
  reorderSelector, 
  copySelector 

} = require("./selector.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getSelector);
router.post("/project", getSelectorByProject);
router.post("/create", createSelector);
router.post("/update", updateSelector);
router.get("/delete/:id", deleteSelector);
router.post("/fulldelete", deleteAllSelector);
router.post("/import", importSelector); 
router.post("/position", updateSelectorPosition); 
router.post("/reorder", reorderSelector); 
router.post("/copy", copySelector);





module.exports = router;
