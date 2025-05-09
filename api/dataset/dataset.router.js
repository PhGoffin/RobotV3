
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-01-30
 * @Last Modified by: 
 * @Last Modified time: 2024-06-03 09:38:24
 * @Description: All the routes available for the API Dataset
 */

const router = require("express").Router();
const {
  createDataset,
  getDataset,
  getDatasetByCode,
  getDatasetBySubProject,
  getDatasetByHeader,
  updateDataset,
  updateDatasetPosition, 
  reorderDataset,
  copyDataset,
  exportDataset,
  importDataset,
  downloadFile,
  copyAllDataset, 
  deleteDataset,
  deleteAllDataset
} = require("./dataset.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getDataset); 
router.post("/subproject", getDatasetBySubProject); 
router.post("/header", getDatasetByHeader); 
router.post("/code", getDatasetByCode);
router.post("/update", updateDataset); 
router.post("/position", updateDatasetPosition); 
router.post("/reorder", reorderDataset); 
router.post("/copy", copyDataset);
router.post("/fullcopy", copyAllDataset);
router.post("/export", exportDataset);
router.post("/import", importDataset); 
router.get("/download/:id", downloadFile);
router.post("/delete", deleteDataset);
router.post("/fulldelete", deleteAllDataset);
router.post("/create", createDataset); 


module.exports = router;
