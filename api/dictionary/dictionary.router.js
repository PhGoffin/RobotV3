
/*
 * @Author: Philippe Goffin 
 * @Email: artcomputer123@gmail.com
 * @Date: 2024-02-01
 * @Last Modified by: 
 * @Last Modified time: 2023-12-07 09:20:34
 * @Description: All the routes available for the API dictionary
 */

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
  createDictionary,
  getDictionary,
  getDictionaryByCode,
  getDictionaryByProject,
  getDictionaryByHeader,
  getUnusedDictionary,
  updateDictionary,
  updateDictionaryPosition, 
  reorderDictionary, 
  copyDictionary, 
  copyAllDictionary, 
  deleteDictionary,
  deleteAllDictionary
} = require("./dictionary.controller");

// -------------------------------------------------------------
// Call the operation in the controller depending of the route
// -------------------------------------------------------------
router.get("/:id", getDictionary); 
router.get("/project/:id", getDictionaryByProject); 
router.get("/unused/:id", getUnusedDictionary); 
router.post("/value", getDictionaryByCode);
router.post("/header", getDictionaryByHeader); 
router.post("/update", updateDictionary); 
router.post("/position", updateDictionaryPosition); 
router.post("/reorder", reorderDictionary); 
router.post("/copy", copyDictionary);
router.post("/fullcopy", copyAllDictionary);
router.post("/delete", deleteDictionary);
router.post("/fulldelete", deleteAllDictionary);
router.post("/create", createDictionary); 


module.exports = router;
